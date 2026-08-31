#!/usr/bin/env python3
"""
Monte Carlo validation for Regime Pullback Pro (or any trade list).

Resamples closed-trade results with replacement (optionally in blocks, to
preserve streak clustering) and reports the distributions of max drawdown,
profit factor, and final return. Use it on the trade list exported from the
MT5 Strategy Tester to answer: "given these trades were roughly exchangeable,
how bad could the drawdown plausibly get, and how fragile is the PF?"

Input CSV (one of):
  1. A single column of R-multiples (one trade per line), used with --risk-pct
  2. A CSV with a profit-in-money column (e.g. exported tester deals):
     pass --column Profit --balance 10000

Examples:
  python3 monte_carlo.py trades_r.csv --risk-pct 0.5 --sims 5000
  python3 monte_carlo.py tester_deals.csv --column Profit --balance 10000 --block 5

Acceptance targets (from STRATEGY_DESIGN.md):
  P(maxDD > 10%) < 5%      P(PF < 1.1) < 10%

No output of this script is a profit guarantee; it quantifies the variability
of the sample you feed it. Garbage in, garbage out.
"""

import argparse
import csv
import random
import statistics
import sys


def read_trades(path, column):
    """Return a list of per-trade profits (unit depends on the file)."""
    values = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        sample = f.read(4096)
        f.seek(0)
        has_header = any(c.isalpha() for c in sample.splitlines()[0]) if sample else False
        if has_header:
            reader = csv.DictReader(f)
            if column is None:
                candidates = [c for c in (reader.fieldnames or [])
                              if c.strip().lower() in ("r", "profit", "result", "pnl", "net")]
                if not candidates:
                    sys.exit("Header found but no obvious profit column; pass --column NAME. "
                             f"Columns: {reader.fieldnames}")
                column = candidates[0]
            for row in reader:
                raw = (row.get(column) or "").replace(" ", "").replace(",", "")
                if raw in ("", "-"):
                    continue
                try:
                    values.append(float(raw))
                except ValueError:
                    continue
        else:
            for line in f:
                line = line.strip().replace(",", "")
                if not line:
                    continue
                try:
                    values.append(float(line))
                except ValueError:
                    continue
    if len(values) < 30:
        sys.exit(f"Only {len(values)} trades parsed - too few for a meaningful Monte Carlo "
                 "(need >= 30, prefer >= 200).")
    return values


def to_fractional_returns(trades, risk_pct, balance):
    """Convert trades to per-trade fractional equity returns."""
    if balance is not None:
        return [t / balance for t in trades]          # money -> fraction of starting balance
    if risk_pct is not None:
        return [t * risk_pct / 100.0 for t in trades]  # R-multiples -> fraction at given risk
    sys.exit("Specify either --risk-pct (R-multiple input) or --balance (money input).")


def block_resample(returns, block):
    """Sample len(returns) values in contiguous blocks (circular) of size `block`."""
    n = len(returns)
    out = []
    while len(out) < n:
        start = random.randrange(n)
        out.extend(returns[(start + i) % n] for i in range(block))
    return out[:n]


def simulate(returns, sims, block, compound):
    max_dds, finals, pfs = [], [], []
    n = len(returns)
    for _ in range(sims):
        sample = block_resample(returns, block) if block > 1 else random.choices(returns, k=n)
        equity = 1.0
        peak = 1.0
        max_dd = 0.0
        gross_win = gross_loss = 0.0
        for r in sample:
            pnl = equity * r if compound else r
            equity += pnl
            if pnl >= 0:
                gross_win += pnl
            else:
                gross_loss -= pnl
            peak = max(peak, equity)
            if peak > 0:
                max_dd = max(max_dd, (peak - equity) / peak)
        max_dds.append(max_dd)
        finals.append(equity - 1.0)
        pfs.append(gross_win / gross_loss if gross_loss > 0 else float("inf"))
    return max_dds, finals, pfs


def pct(sorted_vals, q):
    idx = min(len(sorted_vals) - 1, max(0, int(q / 100.0 * len(sorted_vals))))
    return sorted_vals[idx]


def main():
    ap = argparse.ArgumentParser(description="Monte Carlo resampling of a trade list.")
    ap.add_argument("csv_path")
    ap.add_argument("--column", default=None, help="profit column name if the CSV has a header")
    ap.add_argument("--risk-pct", type=float, default=None,
                    help="input is R-multiples; risked %% of equity per trade (e.g. 0.5)")
    ap.add_argument("--balance", type=float, default=None,
                    help="input is money; starting balance of the backtest")
    ap.add_argument("--sims", type=int, default=5000)
    ap.add_argument("--block", type=int, default=1,
                    help="block size for block-bootstrap (preserves streak clustering; try 5)")
    ap.add_argument("--flat", action="store_true",
                    help="fixed-fraction of STARTING equity instead of compounding")
    ap.add_argument("--dd-limit", type=float, default=10.0, help="drawdown cap in %% (default 10)")
    ap.add_argument("--seed", type=int, default=None)
    args = ap.parse_args()

    if args.seed is not None:
        random.seed(args.seed)

    trades = read_trades(args.csv_path, args.column)
    returns = to_fractional_returns(trades, args.risk_pct, args.balance)

    wins = [r for r in returns if r > 0]
    losses = [r for r in returns if r < 0]
    print(f"Trades: {len(returns)} | win rate: {len(wins)/len(returns)*100:.1f}% "
          f"| avg win: {statistics.mean(wins)*100:.3f}% | avg loss: {statistics.mean(losses)*100:.3f}%"
          if wins and losses else f"Trades: {len(returns)}")
    original_pf = (sum(wins) / -sum(losses)) if losses else float("inf")
    print(f"Sample PF: {original_pf:.2f} | sample expectancy: {statistics.mean(returns)*100:.3f}% per trade")
    print(f"Simulating {args.sims} resampled equity curves "
          f"({'block=' + str(args.block) if args.block > 1 else 'iid'}, "
          f"{'flat' if args.flat else 'compounding'})...\n")

    max_dds, finals, pfs = simulate(returns, args.sims, args.block, not args.flat)
    max_dds.sort(); finals.sort(); pfs.sort()

    print("Max drawdown  : median {:6.2f}%  p90 {:6.2f}%  p95 {:6.2f}%  p99 {:6.2f}%".format(
        pct(max_dds, 50) * 100, pct(max_dds, 90) * 100, pct(max_dds, 95) * 100, pct(max_dds, 99) * 100))
    print("Final return  : p5 {:+7.2f}%  median {:+7.2f}%  p95 {:+7.2f}%".format(
        pct(finals, 5) * 100, pct(finals, 50) * 100, pct(finals, 95) * 100))
    finite_pfs = [p for p in pfs if p != float("inf")] or pfs
    print("Profit factor : p5 {:6.2f}  median {:6.2f}  p95 {:6.2f}".format(
        pct(sorted(finite_pfs), 5), pct(sorted(finite_pfs), 50), pct(sorted(finite_pfs), 95)))

    p_dd = sum(1 for d in max_dds if d > args.dd_limit / 100.0) / len(max_dds) * 100
    p_pf = sum(1 for p in pfs if p < 1.1) / len(pfs) * 100
    p_neg = sum(1 for x in finals if x <= 0) / len(finals) * 100
    print(f"\nP(maxDD > {args.dd_limit:.0f}%)  = {p_dd:5.1f}%   (target < 5%)")
    print(f"P(PF < 1.1)     = {p_pf:5.1f}%   (target < 10%)")
    print(f"P(net <= 0)     = {p_neg:5.1f}%")

    ok = p_dd < 5.0 and p_pf < 10.0
    print("\nVERDICT:", "PASS - within design risk targets for THIS sample."
          if ok else "FAIL - reduce risk per trade or reject the configuration.")
    print("Reminder: this quantifies variability of the supplied sample; it cannot "
          "prove the edge persists in the future.")


if __name__ == "__main__":
    main()
