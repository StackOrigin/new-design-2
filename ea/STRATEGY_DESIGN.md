# Regime Pullback Pro — Strategy Design Document

**Replaces:** TrendRider Pullback Pro v1.00
**Deliverables:** `RegimePullbackPro.mq5` (EA), `monte_carlo.py` (validation tool), this document
**Status:** design + implementation complete; **statistical validation is YOUR next step** (Section 7)

> Nothing in this document claims guaranteed profits. It describes a design with
> *intended* positive expectancy, the math that the design targets, and the exact
> protocol to verify — on your broker's data — whether the edge is real. If
> validation fails the acceptance criteria in Section 7, do not trade it live.

---

## 1. Post-mortem: why TrendRider v1 loses money

Ranked by estimated damage. The first three are structural — no parameter tuning fixes them.

### 1.1 Transaction costs vs. stop size (the killer)

v1 enters on M5 with a stop behind a 6-bar M5 swing, clamped to a *minimum of
0.6 × ATR(M5)*. On EURUSD in quiet hours, ATR(M5) ≈ 3–5 pips, so stops of
**2–4 pips** are routine. With ~0.8–1.2 pips of spread+commission, transaction
costs are **15–30 % of one R on every trade**.

The math: if cost `c` is measured as a fraction of R, expectancy is
`E_net = E_gross − c`. A strategy whose *gross* edge is +0.10R per trade (already
good for a pullback system) is destroyed by c = 0.20R. v1's cost gate
(`spread < 0.5 × ATR`) allowed costs of up to *half an ATR* — it gated almost
nothing. **v1 could have a genuine gross edge and still bleed money.**

### 1.2 Trend detection too low-timeframe, too lagged, and whipsawing

- M15 EMA50/EMA200 + ADX(14) ≥ 18 is a noisy regime definition. M15 ADX crosses
  18 constantly; the "trend" flips many times per week.
- Worse, `InpCloseOnBiasFlip=true` force-flattens every position when the bias
  flips. Because the bias is *lagged* (EMA cross confirms long after the move),
  flips systematically occur **after** an adverse move — the EA repeatedly sold
  lows and bought highs on exit. This converts noise into realized losses.
- No anchor above M15: the EA traded "trends" that are ripples inside H4 ranges.

### 1.3 The "pullback" wasn't a pullback

The entry required only: EMA20(M5) touched within 3 bars + a strong close back
through it. On M5 the EMA20 is touched *constantly*; there was **no depth
requirement and no impulse prerequisite**. So the entry fired on sideways drift
as readily as on genuine trend pullbacks — i.e., the setup carried almost no
information. The RSI 32–68 window passed the vast majority of bars (that range
is where RSI lives), so it filtered nearly nothing.

### 1.4 Trade management crushed the average winner

Banking 50 % at +1R and moving to break-even *feels* safe and lifts the count of
green trades, but on M5, the BE stop sits ~3 pips from price — normal two-bar
noise. The runner was stopped at ~+0.05R constantly. Result: average win shrinks
toward ~0.5R while full losses stay −1R (plus cost). Additionally, with 0.01
starting lots the partial couldn't split (min-lot check fails silently), so
management silently degraded to "move SL to BE at +1R" — the single worst
variant: every trade that touched +1R and retraced became a scratch, and every
trade that didn't became a full loss.

### 1.5 Unlimited correlated stacking

`InpMaxOpenPositions=0` (unlimited) with signals every M5 bar in the same
trend = the same trade opened 5–10 times. Each was "0.5 % risk," but at ~1.0
correlation the *portfolio* was risking 3–5 % on one directional idea. Run on
several USD pairs simultaneously, worse. Drawdowns compound far beyond the
per-trade risk suggests, and there was **no daily loss limit and no streak
brake** to interrupt a cascade.

### 1.6 No session awareness

M5 pullback-continuation behaviour is strongly session-dependent: continuation
edges concentrate in London/NY; the Asian session mean-reverts and spreads are
relatively wider. v1 traded 24/5 (rollover filter defaulted off), so it paid
full costs to trade the hours where its premise is weakest.

### 1.7 No news protection

Stops clamped at max 2.5 × ATR(M5) (≈ 10 pips) sit inside the first second of a
CPI/NFP repricing. Slippage through the stop turns −1R into −2R…−4R. A few of
these per quarter erase weeks of grinding.

### 1.8 No volatility regime filter

ADX was the only regime input. In dead volatility, the cost ratio worsens and
follow-through dies; in panic volatility, stops and trails are mis-scaled and
slippage explodes. v1 traded both.

**Summary:** v1 = high-frequency noise trading with 15–30 % cost drag, a
whipsawing bias that force-realized losses, an entry with little informational
content, management that amputated winners, and no portfolio-level risk
containment. Each element is individually plausible-looking; the combination is
reliably unprofitable.

---

## 2. The new strategy: Regime Pullback Pro

**Thesis (unchanged, executed properly):** in an established trend, after a
fresh impulse, the first orderly pullback into value tends to continue. We only
monetize this where the tendency is strongest: trending regime, normal
volatility, liquid sessions, no imminent news, and with costs capped as a
fraction of risk.

### 2.1 Structure — three timeframes, each with one job

| Layer | TF | Job | Rule |
|---|---|---|---|
| Bias | **H4** | Direction | EMA50 vs EMA200 **and** ATR-normalised EMA50 slope ≥ 0.15 ATR/8 bars |
| Momentum | **H1** | Regime quality + agreement | Kaufman Efficiency Ratio(24) ≥ 0.20 **and** RSI(14) in [45, 78] for longs (mirrored shorts) |
| Entry | **M15** | Timing | Impulse → pullback → trigger (below) |

Moving the entry from M5 to M15 (with H4 context) multiplies typical stop size
~3–4×, which alone cuts cost drag from 15–30 % of R to **4–8 % of R** — the
single largest expectancy improvement in the redesign.

### 2.2 Market regime filter

- **Trend:** H4 EMA stack **plus slope**. The slope requirement
  ((EMA50 − EMA50[8 bars ago]) / ATR(H4) ≥ 0.15) rejects the flat-cross zones
  where stacked EMAs still mean "range". Output is +1 / −1 / **0 = stand aside**.
- **Choppiness:** Efficiency Ratio on H1: `|close[t] − close[t−24]| / Σ|Δclose|`.
  ER ≈ 0 in chop, → 1 in clean trends. Threshold 0.20 is deliberately mild; it
  removes the worst regime tail rather than cherry-picking.
- **Regime-flip exit** now requires a *confirmed opposite* regime (stack AND
  slope), not merely "neutral". Neutral lets the trail finish the trade —
  eliminating v1's sell-the-low forced exits.

### 2.3 Volatility filter (adaptive by construction)

Current ATR(M15,14) is ranked against its own last 800 bars (~2 trading weeks).
Entries allowed only in the **20th–92nd percentile**. Below: dead tape, poor
follow-through, worst relative costs. Above: event/panic conditions where stop
geometry and slippage assumptions break. Percentile ranking self-adapts per
symbol and per era — no fixed pip thresholds to re-tune.

### 2.4 Session filter

Entries only **07:00–17:00 GMT** (London through NY morning), where FX
continuation moves concentrate and spreads are tightest. No new entries Friday
after 15:00 GMT; optional flatten Friday 20:00 GMT (default on) to avoid weekend
gap risk — a direct drawdown-tail control. Rollover window blocked.
(`InpServerGmtOffset` must match your broker, including DST changes.)

### 2.5 News filter

MQL5 economic calendar: entries blocked 30 min before to 20 min after
**high-impact** events for either currency of the symbol (optionally moderate).
**Honest limitation:** the calendar API does not work in the Strategy Tester,
so backtests do not exercise this filter; it protects live/demo trading only.
Expect live results ≥ backtest on this dimension, not the reverse.

### 2.6 Entry logic (M15)

Long (short mirrored):

1. **Impulse:** highest high of last 24 bars > highest high of prior 48 bars —
   the trend recently *did something*; we buy the retrace of demonstrated
   strength, not drift. (This is the informational core v1 lacked.)
2. **Pullback with depth:** low of last 5 bars touched EMA20, and impulse-high −
   pullback-low is **0.8–3.5 × ATR**. Too shallow = no reset; too deep = trend
   likely broken.
3. **Structure intact:** trigger close > EMA50(M15).
4. **Trigger candle:** bullish close back above EMA20 with close in the top 40 %
   of its range, or bullish engulfing — evidence the zone was *defended*, and
   close ≤ 1.2 × ATR above EMA20 (no chasing an extended reclaim).
5. All gates from 2.2–2.5 green.

### 2.7 Exit logic

| Mechanism | Rule | Purpose |
|---|---|---|
| Initial stop | Behind 12-bar swing − 0.4 ATR buffer, clamped **1.2–3.0 × ATR** | Structural, but never inside the noise band (v1 allowed 0.6 ATR) |
| TP1 | Close 50 % at **+1R**, SL → entry +0.1R | Converts ~half the good entries into banked profit; the +0.1R lock pays residual costs |
| Runner trail | Chandelier: highest close since entry − **(2.0–3.0) × ATR**, tighten-only; multiplier scales with the volatility percentile | Loose enough to survive normal retraces (v1's 1.5 ATR on M5 was inside noise), adaptive to conditions |
| TP backstop | +4R broker-side | Catastrophe/disconnection backstop, not the expected exit |
| Time-stop | If < +0.25R after 20 bars (5 h) → close | The thesis is *immediate* continuation; stagnant trades are near-coin-flips holding capital and correlation budget |
| Small-lot mode | If the lot can't split into two legal halves: no partial, TP = **+1.8R** | Fixes v1's silent degradation on 0.01-lot accounts |
| Regime flip | Flatten only on confirmed opposite H4 regime | Reason for the trade is gone |
| Friday flatten | 20:00 GMT (optional, default on) | Weekend gap tail control |

### 2.8 Risk management

- **Per trade:** 0.5 % of equity default, hard-clamped 0.25–1.0 %.
- **Daily loss limit:** −2 % of day-start equity → no new entries (optional flatten).
- **Loss-streak governor:** 3 consecutive losses → risk halved; 5 → entries
  paused 24 h; a win resets. (Scratches within ±[−0.5R, +0.25R] don't move the
  streak, so time-stops don't trigger false brakes.)
- **Concurrency caps:** max 4 total (all symbols, this magic), **1 per symbol**,
  **2 sharing any one currency** — the correlation cap that prevents v1-style
  same-idea stacking across EURUSD/GBPUSD/… .
- **Re-entry cooldown:** 6 entry bars on a symbol after a loss there.
- **Cost gate:** spread + commission must be ≤ **10 % of the actual stop
  distance** of the candidate trade — the direct fix for failure 1.1.

### 2.9 Adaptive parameters (no fixed-pip anything)

Every distance is ATR-multiples (self-scaling across symbols and vol eras); the
volatility gate is percentile-based (self-referential per symbol); the trail
multiplier interpolates 2.0→3.0 with the volatility percentile; risk steps down
automatically on streaks. The *shape* of the system is fixed; its *scale*
adapts. This is deliberately preferred over online parameter re-optimisation,
which is a classic overfitting vector.

---

## 3. Why each rule improves expectancy (rule → failure it fixes)

| Rule | Fixes | Mechanism |
|---|---|---|
| M15 entries + 1.2 ATR min stop | 1.1 | Cost drag ~20 % → ~5 % of R; expectancy shifts by that difference on *every* trade |
| Cost gate ≤ 10 % of R | 1.1 | Refuses individually uneconomical trades (spread spikes, wrong hours) |
| H4 bias + slope, flip = confirmed opposite only | 1.2 | Far fewer, more meaningful regime states; ends forced exits at local extremes |
| Impulse prerequisite | 1.3 | Entry now conditions on demonstrated directional demand — the setup carries information |
| Pullback depth 0.8–3.5 ATR | 1.3 | Separates real retraces from drift and from broken trends |
| ER ≥ 0.20 | 1.8/1.2 | Removes the choppiest regime tail where pullbacks resolve randomly |
| ATR percentile 20–92 | 1.8 | Skips dead and panic tape; keeps the band where the R-geometry is calibrated |
| Session window | 1.6 | Concentrates trades where continuation frequency is highest and costs lowest |
| News blackout | 1.7 | Truncates the −2R…−4R slippage tail (live) |
| Loose adaptive trail (2–3 ATR on closes) | 1.4 | Runner survives normal retraces → average win rises toward design targets |
| Time-stop | 1.4 | Converts stagnant near-coin-flips into ~0R scratches; frees correlation budget |
| Single-target small-lot mode | 1.4 | Removes the silent worst-case management on micro accounts |
| 1/symbol, 2/currency, 4 total | 1.5 | Bounds portfolio heat per *idea*, not per ticket |
| Daily limit + streak governor | 1.5 | Cuts the left tail of daily/weekly P/L; regime breaks stop hurting quickly |

---

## 4. Expectancy math

### 4.1 Framework

With outcomes measured in R (initial risk = 1R) and costs `c` expressed as a
fraction of R (entry spread is already inside R; `c` covers commission+slippage):

```
E[R per trade] = Σ pᵢ·rᵢ − c
Profit Factor  = Σ(win R) / |Σ(loss R)|
```

### 4.2 Design-target outcome distribution

**These are targets the design aims for, NOT measured results.** They exist so
that validation has explicit numbers to confirm or reject. Standard-mode
(partial+runner) targets:

| Outcome | Path | Net R | Target prob |
|---|---|---|---|
| Full stop | SL before TP1 | −1.00 | 0.35 |
| Time-stop scratch | stagnant 20 bars | −0.05 | 0.15 |
| TP1 → BE | 50 % at +1R, runner out at +0.1R | +0.55 | 0.25 |
| TP1 → runner | 50 % at +1R, trail exit avg +2.5R | +1.75 | 0.25 |

```
E_gross = 0.35(−1) + 0.15(−0.05) + 0.25(0.55) + 0.25(1.75)
        = −0.350 − 0.0075 + 0.1375 + 0.4375 = +0.2175 R
E_net   ≈ +0.2175 − 0.05 (costs at ~5 % of R) ≈ +0.16–0.17 R per trade

PF      = (0.1375 + 0.4375) / (0.350 + 0.0075 + 0.05·allocation) ≈ 1.35–1.45
Win rate (net-positive trades) = 0.25 + 0.25 = 50 % (+ any scratches that close ≥ 0)
```

### 4.3 Margin of safety (the anti-fragility budget)

Average win = (0.25·0.55 + 0.25·1.75)/0.50 = **+1.15R**; average loss =
(0.35·1.0 + 0.15·0.05)/0.50 = **−0.715R**.

```
Break-even win rate = 0.715 / (0.715 + 1.15) ≈ 38.3 %
```

The design targets ~50 % positive trades against a 38.3 % break-even point.
That ~12-point gap **is** the robustness budget: regimes can degrade the hit
rate substantially before expectancy crosses zero. A strategy needing 55 % to
break even and winning 57 % is fragile; this geometry is the opposite choice.

### 4.4 Drawdown geometry (why risk is 0.5 % and why the governor exists)

Probability of a k-loss streak somewhere in N trades ≈ `N·p^k`. With loss
probability p ≈ 0.5 (counting scratches as neutral) over N = 500 trades:
expected worst streak ≈ `ln(500)/ln(2) ≈ 9`; the 99th percentile ≈ 13–15.

- Flat 0.5 % risk: 14-loss streak ≈ **−6.8 %** equity → inside the 10 % cap.
- With the governor (risk halves after 3): 3×0.5 % + 11×0.25 % ≈ **−4.2 %**,
  plus a hard stop of −2 %/day on cascade days.
- At 1.0 % flat risk the same streak is ≈ −13 % → **breaches the cap**. This is
  why the EA hard-clamps risk to ≤ 1 % and defaults to 0.5 %.

Monte Carlo (Section 7.4) replaces these closed-form sketches with the full
distribution from your actual trade sample.

### 4.5 Trade frequency

The gates are intentionally strict. Expect roughly **0.2–0.6 entries/day/pair**
in favourable regimes and zero for days in bad ones. Run 4–6 majors in parallel
(the currency caps keep aggregate heat bounded) for a meaningful sample. If the
tester shows < ~10 trades/month/pair, loosen in this order: ER 0.20→0.15,
vol floor 20→10, session end 17→19 GMT — and re-validate.

---

## 5. MQL5 implementation plan (module map)

| Module | Functions | Notes |
|---|---|---|
| Lifecycle | `OnInit / OnDeinit / ValidateInputs` | Handle creation, hard input validation, risk clamp 0.25–1 % |
| Regime | `BiasDirection`, `EfficiencyRatio`, `AtrPercentileRank` | All on closed bars (shift 1); percentile self-referential |
| Clock gates | `InEntrySession`, `IsRolloverWindow`, `FridayFlattenDue`, `NewsBlackout` | GMT via offset input; calendar cached 60–300 s, tester-inert |
| Account gates | `UpdateDailyAnchor`, `DailyLimitBreached`, `LossStreak/PauseUntil`, `CurrentRiskPercent`, `PositionCapsOk`, `ReentryCooldownActive` | State persisted in GlobalVariables (survive restarts; tester-isolated) |
| Signal | `EvaluateEntry` → `CheckPullbackPattern` | Cheap gates first; every rejection logged with reason (throttled) |
| Execution | `TryOpen`, `CalculateLots`, `MarginAllowsTrade`, `ApplyMinimumStopDistance`, `SaveMetaForNewPositions` | Cost gate vs actual stop; small-lot single-target mode decided at entry |
| Management | `ManagePositions`, `LoadPositionMeta`, `ClampStopToMinDistance` | Partial→BE→adaptive chandelier; time-stop; flip/Friday/daily flatten; meta recovery after restart (GV → comment → SL reconstruction) |
| Bookkeeping | `OnTradeTransaction`, `PositionStillOpen`, `SweepOrphanMeta` | Aggregates net P/L per position id; streak/cooldown updates; GV cleanup |
| Research | `OnTester` | Custom criterion: `min(PF,3)·√trades·(1 − DD/15 %)` — selects plateaus, not spikes |

One position per symbol; partials work on both netting and hedging accounts.

---

## 6. Every filter is ablatable (anti-overfitting by construction)

`InpUseErFilter`, `InpUseVolFilter`, `InpUseSessionFilter`, `InpUseNewsFilter`,
time-stop (`InpTimeStopBars=0`), Friday flatten, flip-close — all toggleable.
**Protocol:** a filter earns its place only if switching it ON improves net
expectancy or the DD profile on in-sample data *and* the improvement persists
out-of-sample. Delete anything that doesn't. Fewer active rules that each pay
rent > many rules that fit history.

---

## 7. Validation protocol (run before any live deployment)

Data: MT5 Strategy Tester, **"Every tick based on real ticks"**, with your
broker's real commission configured, plus a modelled slippage assumption.
Symbols: EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD. Period: 2015–2025.

### 7.1 Split the data — and lock the vault

- In-sample (IS): 2015–2021
- Out-of-sample (OOS): 2022–2023
- **Final holdout: 2024–2025 — touched exactly once, at the very end.**

### 7.2 Baseline + ablation (IS only)

1. Run all-defaults on all 5 pairs. Record trades, PF, E[R], DD, outcome
   distribution vs the Section 4.2 targets.
2. Toggle each filter off one at a time; keep only filters that pay rent.
   ≥ 300 trades per configuration or the comparison is noise.

### 7.3 Walk-forward optimisation (IS only)

MT5 has no built-in WFO — run it manually:

1. Optimise **at most 3 parameters** (suggested: `InpMinEr` ∈ {0.15, 0.20, 0.25},
   `InpTrailAtrMax` ∈ {2.5, 3.0, 3.5}, `InpTimeStopBars` ∈ {12, 20, 28}).
   Everything else stays at defaults. Use the custom `OnTester` criterion.
2. Windows: optimise 24 months → test next 6 months → roll forward 6 months
   (2015→2021 gives ~9 OOS segments).
3. **Pick plateaus:** a value whose neighbours score similarly. If ±1 step
   changes the result materially, the parameter is fit to noise — revert to default.
4. Acceptance: ≥ 60 % of walk-forward segments profitable; aggregate
   walk-forward PF ≥ 1.2; **walk-forward efficiency** (OOS E[R] / IS E[R]) ≥ 0.5.

### 7.4 Monte Carlo (`monte_carlo.py`)

Export the tester report (or deals CSV), then:

```
python3 monte_carlo.py trades.csv --risk-pct 0.5 --sims 5000
```

Resamples your closed-trade R-multiples with replacement (plus optional block
bootstrap to respect streak clustering) and reports the distributions of max
drawdown, PF, and final return. **Acceptance:** P(maxDD > 10 %) < 5 %;
P(PF < 1.1) < 10 %. If the 0.5 %-risk DD distribution violates the cap, drop to
0.25 % — never "optimise" the DD away with entry tweaks.

### 7.5 Out-of-sample + holdout

Frozen parameters → 2022–2023, all pairs: require PF ≥ 1.2 aggregate, majority
of pairs positive, DD within Monte-Carlo bands, outcome distribution similar in
*shape* to IS. Only then run 2024–2025 **once**. Degradation vs IS is expected
(IS numbers always flatter); collapse is disqualification.

### 7.6 Forward demo

≥ 3 months / ≥ 50 trades on a demo account at your live broker (this also
exercises the news filter, which backtests can't). Compare fill quality,
spread-at-entry, and the outcome distribution against the tester. Then, if
funded: minimum size, 0.25 % risk, scale up only after ~100 live trades
confirm the distribution.

### 7.7 Ongoing monitoring

Track rolling-50-trade E[R] and the outcome distribution vs validation. Alarm
conditions: rolling PF < 1.0 over ≥ 80 trades, DD > Monte-Carlo 95th
percentile, or scratch-rate double the backtest. Alarm = back to demo, not
"add a filter live".

---

## 8. Known limitations (read before trusting any backtest)

1. **News filter is inert in the tester** — live results differ from backtests
   on news days by design.
2. **GMT offset is manual** (`InpServerGmtOffset`) and most brokers shift with
   US DST — wrong offset silently shifts the session window by an hour.
3. Tick-quality, spread modelling, and swaps in the tester are approximations;
   demo-forward is the arbiter.
4. Percentile/ER windows need warm-up history; the EA stands aside (and says
   so) until buffers fill.
5. The strategy is *designed* to have an edge; only your validation can show it
   does on your broker, your symbols, your costs. If it doesn't — the correct
   response is "don't trade it", not "tune until it looks good".
