//+------------------------------------------------------------------+
//| Regime Pullback Pro  (TrendRider v2 — full redesign)             |
//|                                                                  |
//| Impulse-pullback-continuation system with regime, volatility,    |
//| session and news gating, portfolio risk controls and adaptive    |
//| (ATR-normalised) parameters.                                     |
//|                                                                  |
//| STRUCTURE                                                        |
//|   Bias      H4 : EMA50 vs EMA200 + ATR-normalised EMA slope.     |
//|   Momentum  H1 : Kaufman Efficiency Ratio + RSI regime.          |
//|   Entry    M15 : fresh impulse -> pullback into EMA20 value      |
//|                  zone -> rejection/reclaim trigger candle.       |
//|                                                                  |
//| RISK                                                             |
//|   0.25-1.0% per trade (hard-clamped), daily equity loss limit,   |
//|   loss-streak risk halving + trading pause, max positions per    |
//|   symbol / currency / total, re-entry cooldown after a loss.     |
//|                                                                  |
//| EXITS                                                            |
//|   Structural stop (clamped to an ATR band), 50% off at +1R,      |
//|   break-even lock, volatility-adaptive chandelier trail on the   |
//|   runner, time-stop for dead trades, H4 regime-flip flatten,     |
//|   optional Friday flatten.                                       |
//|                                                                  |
//| HONESTY                                                          |
//|   No strategy guarantees profit. This EA encodes a positive-     |
//|   expectancy DESIGN that must be validated per symbol/broker     |
//|   with the protocol in STRATEGY_DESIGN.md (walk-forward, Monte   |
//|   Carlo, out-of-sample). Every filter can be toggled for         |
//|   ablation testing. DEMO FIRST. The news filter uses the MQL5    |
//|   economic calendar and is inactive inside the Strategy Tester. |
//+------------------------------------------------------------------+
#property version   "2.00"
#property description "Impulse-pullback continuation with regime/vol/session/news gating"

#include <Trade/Trade.mqh>

//+------------------------------------------------------------------+
//| Inputs                                                           |
//+------------------------------------------------------------------+
input group "=== Trading ==="
input bool            InpAllowLiveTrading      = true;      // false = alert-only mode
input ulong           InpMagicNumber           = 26100701;
input ENUM_TIMEFRAMES InpBiasTimeframe         = PERIOD_H4; // macro trend
input ENUM_TIMEFRAMES InpMomentumTimeframe     = PERIOD_H1; // regime / momentum
input ENUM_TIMEFRAMES InpEntryTimeframe        = PERIOD_M15;// trigger
input int             InpDeviationPoints       = 30;

input group "=== Regime filter (bias TF) ==="
input int             InpBiasEmaFast           = 50;
input int             InpBiasEmaSlow           = 200;
input int             InpBiasSlopeBars         = 8;         // slope measured over this many bias bars
input double          InpMinSlopeAtr           = 0.15;      // min |EMA-fast slope| in bias-ATR units
input bool            InpUseErFilter           = true;
input int             InpErPeriod              = 24;        // Efficiency Ratio bars on momentum TF
input double          InpMinEr                 = 0.20;      // below = choppy, stand aside

input group "=== Momentum confirmation (momentum TF) ==="
input int             InpMomRsiPeriod          = 14;
input double          InpMomRsiFloor           = 45.0;      // long window [floor..ceiling]; shorts mirrored
input double          InpMomRsiCeiling         = 78.0;

input group "=== Volatility filter (entry TF ATR percentile) ==="
input bool            InpUseVolFilter          = true;
input int             InpAtrPeriod             = 14;
input int             InpVolLookback           = 800;       // bars for the percentile window
input double          InpVolMinPercentile      = 20.0;      // dead market below
input double          InpVolMaxPercentile      = 92.0;      // panic market above

input group "=== Session filter (GMT) ==="
input bool            InpUseSessionFilter      = true;
input int             InpServerGmtOffset       = 2;         // broker server = GMT + offset (check yours + DST!)
input int             InpSessionStartHour      = 7;         // London open (GMT)
input int             InpSessionStartMinute    = 0;
input int             InpSessionEndHour        = 17;        // NY morning end (GMT)
input int             InpSessionEndMinute      = 0;
input int             InpFridayCutoffHourGmt   = 15;        // no NEW entries Friday after this GMT hour
input bool            InpCloseAllFriday        = true;      // flatten before the weekend
input int             InpFridayCloseHourGmt    = 20;
input int             InpAvoidRolloverMinutes  = 20;        // block entries around server midnight

input group "=== News filter (MQL5 calendar; inactive in tester) ==="
input bool            InpUseNewsFilter         = true;
input int             InpNewsMinutesBefore     = 30;        // block entries this long before an event
input int             InpNewsMinutesAfter      = 20;        // ...and after
input bool            InpNewsIncludeModerate   = false;     // true = also block moderate-impact events

input group "=== Entry setup (entry TF) ==="
input int             InpImpulseRecentBars     = 24;        // fresh extreme must be inside this window
input int             InpImpulsePriorBars      = 48;        // ...and exceed the extreme of this prior window
input int             InpValueEmaPeriod        = 20;        // pullback value zone
input int             InpTrendEmaPeriod        = 50;        // trend-intact line
input int             InpPullbackLookback      = 5;         // bars in which the value-zone touch must occur
input double          InpMinPullbackAtr        = 0.80;      // pullback depth >= this x ATR (no drift entries)
input double          InpMaxPullbackAtr        = 3.50;      // deeper than this = trend likely broken
input double          InpMinCloseStrength      = 0.60;      // trigger close in top/bottom 40% of its range
input double          InpMaxChaseAtr           = 1.20;      // trigger close within this x ATR of value EMA

input group "=== Stops & targets (structure + ATR clamps) ==="
input int             InpSwingBars             = 12;        // SL behind extreme of these entry bars
input double          InpSwingBufferAtr        = 0.40;      // extra ATR buffer behind the swing
input double          InpMinSlAtr              = 1.20;      // SL never tighter than this x ATR
input double          InpMaxSlAtr              = 3.00;      // SL never wider than this x ATR
input double          InpPartialTakeR          = 1.00;      // bank at this R multiple...
input double          InpPartialClosePct       = 50.0;      // ...this % of the position
input double          InpBreakEvenLockR        = 0.10;      // then SL -> entry + this x R
input double          InpTrailAtrMin           = 2.00;      // chandelier trail mult at low vol percentile
input double          InpTrailAtrMax           = 3.00;      // ...at high vol percentile (adaptive)
input double          InpFinalTpR              = 4.00;      // broker TP backstop for the runner
input double          InpSingleModeTpR         = 1.80;      // TP when lot too small to split (no partial)
input int             InpTimeStopBars          = 20;        // scratch dead trades after N entry bars...
input double          InpTimeStopMaxR          = 0.25;      // ...if open profit still below this R
input bool            InpCloseOnBiasFlip       = true;      // flatten on CONFIRMED opposite H4 regime

input group "=== Risk & portfolio controls ==="
input double          InpRiskPercent           = 0.50;      // % equity per trade (hard-clamped 0.25..1.00)
input double          InpDailyLossLimitPct     = 2.00;      // block new entries after this daily equity loss
input bool            InpCloseOnDailyLimit     = false;     // also flatten when the daily limit trips
input int             InpLossStreakHalveRisk   = 3;         // halve risk after this many consecutive losses
input int             InpLossStreakPause       = 5;         // pause new entries after this many...
input int             InpPauseHours            = 24;        // ...for this long
input int             InpMaxOpenTotal          = 4;         // across all symbols (this magic)
input int             InpMaxPerSymbol          = 1;
input int             InpMaxPerCurrency        = 2;         // positions sharing one currency (correlation cap)
input int             InpReentryCooldownBars   = 6;         // entry-TF bars to wait after a loss on this symbol

input group "=== Costs ==="
input int             InpMaxSpreadPoints       = 0;         // absolute spread cap, 0 = off
input double          InpCommissionPoints      = 0.0;       // round-trip commission expressed in points
input double          InpMaxCostPctOfRisk      = 10.0;      // skip entry if (spread+comm) > this % of SL distance

input group "=== Diagnostics ==="
input bool            InpLogBlockedReasons     = true;
input int             InpBlockLogSeconds       = 60;
input bool            InpShowChartStatus       = true;

//+------------------------------------------------------------------+
//| Globals                                                          |
//+------------------------------------------------------------------+
CTrade trade;

int hBiasEmaFast  = INVALID_HANDLE;
int hBiasEmaSlow  = INVALID_HANDLE;
int hBiasAtr      = INVALID_HANDLE;
int hMomRsi       = INVALID_HANDLE;
int hValueEma     = INVALID_HANDLE;
int hTrendEma     = INVALID_HANDLE;
int hAtr          = INVALID_HANDLE;

int      g_biasDir       = 0;      // +1 bull, -1 bear, 0 stand aside (confirmed regime only)
double   g_er            = -1.0;   // last efficiency ratio
double   g_volRank       = -1.0;   // last ATR percentile rank 0..1 (-1 = unknown)
double   g_riskBase      = 0.5;    // InpRiskPercent clamped to [0.25, 1.0]
datetime g_lastEntryBar  = 0;
datetime g_lastBlockLog  = 0;
string   g_lastBlock     = "";
string   g_gateTrace     = "";
bool     g_calendarWarned = false;

//+------------------------------------------------------------------+
//| Global-variable name helpers (persist across restarts; the       |
//| tester keeps its own isolated set per pass)                      |
//+------------------------------------------------------------------+
string GvPrefix()                 { return StringFormat("RPP%I64u_", InpMagicNumber); }
string GvAcc(const string tag)    { return GvPrefix() + tag; }
string GvPos(const string tag, const long posId) { return StringFormat("%s%s_%I64d", GvPrefix(), tag, posId); }
string GvSym(const string tag)    { return GvPrefix() + tag + "_" + _Symbol; }

//+------------------------------------------------------------------+
//| Init / deinit                                                    |
//+------------------------------------------------------------------+
int OnInit()
{
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetDeviationInPoints(InpDeviationPoints);
   ApplyBestFillingMode();

   if(!ValidateInputs())
      return INIT_FAILED;

   g_riskBase = MathMax(0.25, MathMin(1.00, InpRiskPercent));
   if(g_riskBase != InpRiskPercent)
      Print("Risk input ", DoubleToString(InpRiskPercent, 2),
            "% clamped to ", DoubleToString(g_riskBase, 2), "% (allowed band 0.25-1.00%).");

   hBiasEmaFast = iMA(_Symbol, InpBiasTimeframe, InpBiasEmaFast, 0, MODE_EMA, PRICE_CLOSE);
   hBiasEmaSlow = iMA(_Symbol, InpBiasTimeframe, InpBiasEmaSlow, 0, MODE_EMA, PRICE_CLOSE);
   hBiasAtr     = iATR(_Symbol, InpBiasTimeframe, InpAtrPeriod);
   hMomRsi      = iRSI(_Symbol, InpMomentumTimeframe, InpMomRsiPeriod, PRICE_CLOSE);
   hValueEma    = iMA(_Symbol, InpEntryTimeframe, InpValueEmaPeriod, 0, MODE_EMA, PRICE_CLOSE);
   hTrendEma    = iMA(_Symbol, InpEntryTimeframe, InpTrendEmaPeriod, 0, MODE_EMA, PRICE_CLOSE);
   hAtr         = iATR(_Symbol, InpEntryTimeframe, InpAtrPeriod);

   if(hBiasEmaFast == INVALID_HANDLE || hBiasEmaSlow == INVALID_HANDLE || hBiasAtr == INVALID_HANDLE ||
      hMomRsi == INVALID_HANDLE || hValueEma == INVALID_HANDLE || hTrendEma == INVALID_HANDLE ||
      hAtr == INVALID_HANDLE)
   {
      Print("Startup failed. Could not create indicator handles.");
      return INIT_FAILED;
   }

   SweepOrphanMeta();

   Print("Regime Pullback Pro loaded on ", _Symbol,
         " | bias=", EnumToString(InpBiasTimeframe),
         " momentum=", EnumToString(InpMomentumTimeframe),
         " entry=", EnumToString(InpEntryTimeframe),
         " | risk=", DoubleToString(g_riskBase, 2), "%",
         " | daily stop=", DoubleToString(InpDailyLossLimitPct, 1), "%");
   Print("REALITY CHECK: this is a statistical edge DESIGN, not a guarantee. ",
         "Validate with walk-forward + Monte Carlo + out-of-sample before any live use. ",
         "News filter is inactive inside the Strategy Tester.");

   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   Comment("");
   if(hBiasEmaFast != INVALID_HANDLE) IndicatorRelease(hBiasEmaFast);
   if(hBiasEmaSlow != INVALID_HANDLE) IndicatorRelease(hBiasEmaSlow);
   if(hBiasAtr != INVALID_HANDLE)     IndicatorRelease(hBiasAtr);
   if(hMomRsi != INVALID_HANDLE)      IndicatorRelease(hMomRsi);
   if(hValueEma != INVALID_HANDLE)    IndicatorRelease(hValueEma);
   if(hTrendEma != INVALID_HANDLE)    IndicatorRelease(hTrendEma);
   if(hAtr != INVALID_HANDLE)         IndicatorRelease(hAtr);
}

bool ValidateInputs()
{
   if(InpBiasEmaFast < 2 || InpBiasEmaSlow <= InpBiasEmaFast || InpBiasSlopeBars < 1 ||
      InpMinSlopeAtr < 0.0 || InpErPeriod < 5 || InpMinEr < 0.0 || InpMinEr > 1.0)
   {
      Print("Startup check failed. Regime inputs invalid.");
      return false;
   }
   if(InpMomRsiFloor < 0 || InpMomRsiCeiling <= InpMomRsiFloor || InpMomRsiCeiling > 100)
   {
      Print("Startup check failed. Momentum RSI window invalid.");
      return false;
   }
   if(InpAtrPeriod < 2 || InpVolLookback < 100 ||
      InpVolMinPercentile < 0 || InpVolMaxPercentile <= InpVolMinPercentile || InpVolMaxPercentile > 100)
   {
      Print("Startup check failed. Volatility filter inputs invalid.");
      return false;
   }
   if(InpImpulseRecentBars < 3 || InpImpulsePriorBars < InpImpulseRecentBars ||
      InpValueEmaPeriod < 2 || InpTrendEmaPeriod <= InpValueEmaPeriod ||
      InpPullbackLookback < 1 || InpMinPullbackAtr < 0.0 || InpMaxPullbackAtr <= InpMinPullbackAtr ||
      InpMinCloseStrength <= 0.0 || InpMinCloseStrength > 1.0 || InpMaxChaseAtr <= 0.0)
   {
      Print("Startup check failed. Entry setup inputs invalid.");
      return false;
   }
   if(InpSwingBars < 2 || InpSwingBufferAtr < 0.0 || InpMinSlAtr <= 0.0 || InpMaxSlAtr < InpMinSlAtr ||
      InpPartialTakeR <= 0.0 || InpPartialClosePct <= 0.0 || InpPartialClosePct >= 100.0 ||
      InpBreakEvenLockR < 0.0 || InpTrailAtrMin < 0.0 || InpTrailAtrMax < InpTrailAtrMin ||
      InpFinalTpR <= InpPartialTakeR || InpSingleModeTpR <= 0.0 ||
      InpTimeStopBars < 0 || InpTimeStopMaxR < 0.0)
   {
      Print("Startup check failed. Stop/target inputs invalid.");
      return false;
   }
   if(InpRiskPercent <= 0.0 || InpDailyLossLimitPct <= 0.0 ||
      InpLossStreakHalveRisk < 1 || InpLossStreakPause < InpLossStreakHalveRisk || InpPauseHours < 0 ||
      InpMaxOpenTotal < 1 || InpMaxPerSymbol < 1 || InpMaxPerCurrency < 1 || InpReentryCooldownBars < 0)
   {
      Print("Startup check failed. Risk inputs invalid.");
      return false;
   }
   if(InpMaxSpreadPoints < 0 || InpCommissionPoints < 0.0 || InpMaxCostPctOfRisk <= 0.0)
   {
      Print("Startup check failed. Cost inputs invalid.");
      return false;
   }
   if(InpSessionStartHour < 0 || InpSessionStartHour > 23 || InpSessionEndHour < 0 || InpSessionEndHour > 23 ||
      InpSessionStartMinute < 0 || InpSessionStartMinute > 59 || InpSessionEndMinute < 0 || InpSessionEndMinute > 59)
   {
      Print("Startup check failed. Session inputs invalid.");
      return false;
   }

   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double step   = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   if(minLot <= 0.0 || maxLot < minLot || step <= 0.0)
   {
      Print("Startup check failed. Broker volume settings invalid.");
      return false;
   }
   return true;
}

//+------------------------------------------------------------------+
//| Main tick                                                        |
//+------------------------------------------------------------------+
void OnTick()
{
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick))
      return;

   UpdateDailyAnchor();
   ManagePositions(tick);

   if(InpShowChartStatus)
      ShowStatus();

   //--- evaluate entries once per entry-TF bar, on its first tick
   datetime currentBar = iTime(_Symbol, InpEntryTimeframe, 0);
   if(currentBar <= 0 || currentBar == g_lastEntryBar)
      return;
   g_lastEntryBar = currentBar;

   //--- refresh regime state (used by both entries and flip-exits)
   g_biasDir = BiasDirection();
   g_er      = InpUseErFilter ? EfficiencyRatio(InpMomentumTimeframe, InpErPeriod) : 1.0;
   g_volRank = AtrPercentileRank();
   BuildGateTrace();

   EvaluateEntry(tick);
}

//+------------------------------------------------------------------+
//| Regime: H4 EMA stack + ATR-normalised slope. Returns confirmed   |
//| direction only; 0 means neutral/unknown (no trades, no flips).   |
//+------------------------------------------------------------------+
int BiasDirection()
{
   double emaFast     = Buf(hBiasEmaFast, 1);
   double emaSlow     = Buf(hBiasEmaSlow, 1);
   double emaFastPrev = Buf(hBiasEmaFast, 1 + InpBiasSlopeBars);
   double atrBias     = Buf(hBiasAtr, 1);

   if(emaFast == EMPTY_VALUE || emaSlow == EMPTY_VALUE || emaFastPrev == EMPTY_VALUE ||
      atrBias == EMPTY_VALUE || atrBias <= 0.0)
      return 0;

   double slopeAtr = (emaFast - emaFastPrev) / atrBias;

   if(emaFast > emaSlow && slopeAtr >= InpMinSlopeAtr)
      return 1;
   if(emaFast < emaSlow && slopeAtr <= -InpMinSlopeAtr)
      return -1;
   return 0;
}

//+------------------------------------------------------------------+
//| Kaufman Efficiency Ratio: |net move| / sum(|bar moves|).         |
//| ~0 = chop, ~1 = perfectly directional. Returns -1 if no data.    |
//+------------------------------------------------------------------+
double EfficiencyRatio(ENUM_TIMEFRAMES tf, int period)
{
   double closes[];
   ArraySetAsSeries(closes, true);
   if(CopyClose(_Symbol, tf, 1, period + 1, closes) < period + 1)
      return -1.0;

   double net = MathAbs(closes[0] - closes[period]);
   double sum = 0.0;
   for(int i = 0; i < period; i++)
      sum += MathAbs(closes[i] - closes[i + 1]);

   if(sum <= 0.0)
      return 0.0;
   return net / sum;
}

//+------------------------------------------------------------------+
//| Percentile rank (0..1) of the current closed-bar ATR within the  |
//| lookback window. Adapts the vol filter to each symbol's own      |
//| history instead of fixed pip thresholds. Returns -1 if no data.  |
//+------------------------------------------------------------------+
double AtrPercentileRank()
{
   int want = InpVolLookback;
   double atrBuf[];
   ArraySetAsSeries(atrBuf, true);
   int got = CopyBuffer(hAtr, 0, 1, want, atrBuf);
   if(got < 200)                      // need a minimally meaningful window
      return -1.0;

   double current = atrBuf[0];
   if(current <= 0.0)
      return -1.0;

   int below = 0;
   for(int i = 1; i < got; i++)
      if(atrBuf[i] < current)
         below++;

   return (double)below / (double)(got - 1);
}

//+------------------------------------------------------------------+
//| Session / time gates (all in GMT via server offset input)        |
//+------------------------------------------------------------------+
datetime GmtNow() { return TimeCurrent() - (datetime)(InpServerGmtOffset * 3600); }

bool InEntrySession(string &reason)
{
   if(!InpUseSessionFilter)
      return true;

   MqlDateTime g;
   TimeToStruct(GmtNow(), g);

   if(g.day_of_week == 0 || g.day_of_week == 6)
   {
      reason = "weekend";
      return false;
   }
   if(g.day_of_week == 5 && g.hour >= InpFridayCutoffHourGmt)
   {
      reason = "Friday cutoff: no new entries into the weekend";
      return false;
   }

   int nowMin   = g.hour * 60 + g.min;
   int startMin = InpSessionStartHour * 60 + InpSessionStartMinute;
   int endMin   = InpSessionEndHour * 60 + InpSessionEndMinute;

   bool inside = (startMin <= endMin)
                 ? (nowMin >= startMin && nowMin < endMin)
                 : (nowMin >= startMin || nowMin < endMin);   // overnight window support
   if(!inside)
   {
      reason = "outside London/NY entry window";
      return false;
   }
   return true;
}

bool IsRolloverWindow()
{
   if(InpAvoidRolloverMinutes <= 0)
      return false;
   MqlDateTime now;
   TimeToStruct(TimeCurrent(), now);          // rollover happens at SERVER midnight
   if(now.hour == 0 && now.min < InpAvoidRolloverMinutes)
      return true;
   if(now.hour == 23 && now.min >= 60 - InpAvoidRolloverMinutes)
      return true;
   return false;
}

//+------------------------------------------------------------------+
//| News blackout via the MQL5 economic calendar. Cached 5 minutes.  |
//| The calendar is unavailable in the Strategy Tester: there the    |
//| filter is inert (documented limitation, do not pretend it works).|
//+------------------------------------------------------------------+
bool NewsBlackout()
{
   if(!InpUseNewsFilter)
      return false;
   if(MQLInfoInteger(MQL_TESTER) != 0)
      return false;

   static datetime lastCheck  = 0;
   static bool     lastResult = false;
   datetime now = TimeCurrent();
   if(lastCheck > 0 && now - lastCheck < 300 && !lastResult)
      return false;
   if(lastCheck > 0 && now - lastCheck < 60)
      return lastResult;
   lastCheck = now;

   string curBase  = SymbolInfoString(_Symbol, SYMBOL_CURRENCY_BASE);
   string curQuote = SymbolInfoString(_Symbol, SYMBOL_CURRENCY_PROFIT);

   datetime from = now - (datetime)(InpNewsMinutesAfter * 60);
   datetime to   = now + (datetime)(InpNewsMinutesBefore * 60);

   lastResult = false;
   for(int c = 0; c < 2; c++)
   {
      string currency = (c == 0) ? curBase : curQuote;
      if(c == 1 && curQuote == curBase)
         break;

      MqlCalendarValue values[];
      if(!CalendarValueHistory(values, from, to, NULL, currency))
      {
         if(!g_calendarWarned)
         {
            Print("News filter: economic calendar unavailable (error ", GetLastError(),
                  "). Entries will NOT be news-filtered.");
            g_calendarWarned = true;
         }
         return false;
      }

      for(int i = 0; i < ArraySize(values); i++)
      {
         MqlCalendarEvent event;
         if(!CalendarEventById(values[i].event_id, event))
            continue;
         if(event.importance == CALENDAR_IMPORTANCE_HIGH ||
            (InpNewsIncludeModerate && event.importance == CALENDAR_IMPORTANCE_MODERATE))
         {
            lastResult = true;
            return true;
         }
      }
   }
   return lastResult;
}

//+------------------------------------------------------------------+
//| Daily equity anchor + loss limit (account-wide via global vars)  |
//+------------------------------------------------------------------+
void UpdateDailyAnchor()
{
   long today = (long)(TimeCurrent() / 86400);
   string sStamp = GvAcc("dayStamp");
   string sEq    = GvAcc("dayEq");

   if(!GlobalVariableCheck(sStamp) || (long)GlobalVariableGet(sStamp) != today)
   {
      GlobalVariableSet(sStamp, (double)today);
      GlobalVariableSet(sEq, AccountInfoDouble(ACCOUNT_EQUITY));
   }
}

double DayStartEquity()
{
   if(!GlobalVariableCheck(GvAcc("dayEq")))
      return 0.0;
   return GlobalVariableGet(GvAcc("dayEq"));
}

bool DailyLimitBreached()
{
   double anchor = DayStartEquity();
   if(anchor <= 0.0)
      return false;
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   return equity <= anchor * (1.0 - InpDailyLossLimitPct / 100.0);
}

//+------------------------------------------------------------------+
//| Loss-streak state (persisted). Streak increments on closed net   |
//| losses > 0.5R, resets on wins > 0.25R; scratches change nothing. |
//+------------------------------------------------------------------+
int  LossStreak()        { return GlobalVariableCheck(GvAcc("streak")) ? (int)GlobalVariableGet(GvAcc("streak")) : 0; }
datetime PauseUntil()    { return GlobalVariableCheck(GvAcc("pauseUntil")) ? (datetime)(long)GlobalVariableGet(GvAcc("pauseUntil")) : 0; }

double CurrentRiskPercent()
{
   double risk = g_riskBase;
   if(LossStreak() >= InpLossStreakHalveRisk)
      risk *= 0.5;                         // adaptive de-risking in adverse conditions
   return risk;
}

//+------------------------------------------------------------------+
//| Portfolio caps: total / per-symbol / per-currency (correlation)  |
//+------------------------------------------------------------------+
bool PositionCapsOk(string &reason)
{
   int total = 0, onSymbol = 0;
   string myBase  = SymbolInfoString(_Symbol, SYMBOL_CURRENCY_BASE);
   string myQuote = SymbolInfoString(_Symbol, SYMBOL_CURRENCY_PROFIT);
   int baseCount = 0, quoteCount = 0;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0)
         continue;
      if((ulong)PositionGetInteger(POSITION_MAGIC) != InpMagicNumber)
         continue;

      total++;
      string posSymbol = PositionGetString(POSITION_SYMBOL);
      if(posSymbol == _Symbol)
         onSymbol++;

      string pb = SymbolInfoString(posSymbol, SYMBOL_CURRENCY_BASE);
      string pq = SymbolInfoString(posSymbol, SYMBOL_CURRENCY_PROFIT);
      if(pb == myBase  || pq == myBase)  baseCount++;
      if(pb == myQuote || pq == myQuote) quoteCount++;
   }

   if(total >= InpMaxOpenTotal)      { reason = "max total positions reached (" + IntegerToString(total) + ")"; return false; }
   if(onSymbol >= InpMaxPerSymbol)   { reason = "max positions on this symbol reached";                          return false; }
   if(baseCount >= InpMaxPerCurrency){ reason = "currency exposure cap hit on " + myBase;                        return false; }
   if(quoteCount >= InpMaxPerCurrency){reason = "currency exposure cap hit on " + myQuote;                       return false; }
   return true;
}

bool ReentryCooldownActive()
{
   string name = GvSym("coolUntil");
   if(!GlobalVariableCheck(name))
      return false;
   return TimeCurrent() < (datetime)(long)GlobalVariableGet(name);
}

//+------------------------------------------------------------------+
//| Entry evaluation: cheap gates first, then the pattern            |
//+------------------------------------------------------------------+
void EvaluateEntry(const MqlTick &tick)
{
   string why = "";

   //--- 1. terminal / quote sanity
   if(!PreTradeChecks(tick, why))                    { BlockTrade(why); return; }

   //--- 2. clock gates
   if(!InEntrySession(why))                          { BlockTrade(why); return; }
   if(IsRolloverWindow())                            { BlockTrade("rollover window: spreads unreliable"); return; }
   if(NewsBlackout())                                { BlockTrade("high-impact news blackout"); return; }

   //--- 3. account-state gates
   if(DailyLimitBreached())                          { BlockTrade("daily loss limit hit: no new entries today"); return; }
   if(TimeCurrent() < PauseUntil())                  { BlockTrade("loss-streak pause active (cooling off)"); return; }
   if(ReentryCooldownActive())                       { BlockTrade("re-entry cooldown after recent loss on this symbol"); return; }
   if(!PositionCapsOk(why))                          { BlockTrade(why); return; }

   //--- 4. regime gates
   if(g_biasDir == 0)                                { BlockTrade("no confirmed H4 regime (EMA stack + slope)"); return; }
   if(InpUseErFilter && g_er >= 0.0 && g_er < InpMinEr)
                                                     { BlockTrade(StringFormat("choppy market: ER %.2f < %.2f", g_er, InpMinEr)); return; }
   if(InpUseErFilter && g_er < 0.0)                  { BlockTrade("ER unavailable (warming up)"); return; }
   if(InpUseVolFilter)
   {
      if(g_volRank < 0.0)                            { BlockTrade("ATR percentile unavailable (warming up)"); return; }
      if(g_volRank * 100.0 < InpVolMinPercentile)    { BlockTrade(StringFormat("dead volatility: ATR pct %.0f", g_volRank * 100.0)); return; }
      if(g_volRank * 100.0 > InpVolMaxPercentile)    { BlockTrade(StringFormat("extreme volatility: ATR pct %.0f", g_volRank * 100.0)); return; }
   }

   //--- 5. momentum confirmation
   double rsi = Buf(hMomRsi, 1);
   if(rsi == EMPTY_VALUE)                            { BlockTrade("momentum RSI unavailable"); return; }
   if(g_biasDir > 0 && (rsi < InpMomRsiFloor || rsi > InpMomRsiCeiling))
                                                     { BlockTrade(StringFormat("H1 momentum not aligned for longs (RSI %.1f)", rsi)); return; }
   if(g_biasDir < 0 && (rsi > 100.0 - InpMomRsiFloor || rsi < 100.0 - InpMomRsiCeiling))
                                                     { BlockTrade(StringFormat("H1 momentum not aligned for shorts (RSI %.1f)", rsi)); return; }

   //--- 6. the pattern itself
   CheckPullbackPattern(tick);
}

void CheckPullbackPattern(const MqlTick &tick)
{
   int need = MathMax(InpImpulseRecentBars + InpImpulsePriorBars, MathMax(InpSwingBars, InpPullbackLookback)) + 3;
   MqlRates rates[];
   ArraySetAsSeries(rates, true);
   if(CopyRates(_Symbol, InpEntryTimeframe, 0, need, rates) < need)
   {
      BlockTrade("not enough entry-TF history yet");
      return;
   }

   double valueEma = Buf(hValueEma, 1);
   double trendEma = Buf(hTrendEma, 1);
   double atr      = Buf(hAtr, 1);
   if(valueEma == EMPTY_VALUE || trendEma == EMPTY_VALUE || atr == EMPTY_VALUE || atr <= 0.0)
   {
      BlockTrade("entry indicators unavailable");
      return;
   }

   double range1 = rates[1].high - rates[1].low;
   if(range1 <= 0.0)
   {
      BlockTrade("trigger candle has zero range");
      return;
   }

   bool bullBar = rates[1].close > rates[1].open;
   bool bearBar = rates[1].close < rates[1].open;
   double strengthUp   = (rates[1].close - rates[1].low) / range1;
   double strengthDown = (rates[1].high - rates[1].close) / range1;

   if(g_biasDir > 0)
   {
      //--- fresh impulse: recent window printed a higher high than the prior window
      double recentHigh = HighestHigh(rates, 1, InpImpulseRecentBars);
      double priorHigh  = HighestHigh(rates, 1 + InpImpulseRecentBars, InpImpulsePriorBars);
      bool impulse = recentHigh > priorHigh;

      //--- pullback into value with real depth (not sideways drift)
      double pullLow = LowestLow(rates, 1, InpPullbackLookback);
      bool touched  = pullLow <= valueEma;
      double depth  = recentHigh - pullLow;
      bool depthOk  = depth >= InpMinPullbackAtr * atr && depth <= InpMaxPullbackAtr * atr;

      //--- structure intact + trigger candle
      bool trendIntact = rates[1].close > trendEma;
      bool reclaimed   = rates[1].close > valueEma;
      bool engulf      = rates[2].close < rates[2].open &&
                         rates[1].close > rates[2].open && rates[1].open <= rates[2].close;
      bool strongClose = strengthUp >= InpMinCloseStrength;
      bool noChase     = (rates[1].close - valueEma) <= InpMaxChaseAtr * atr;
      bool trigger     = bullBar && reclaimed && (strongClose || engulf) && noChase;

      if(impulse && touched && depthOk && trendIntact && trigger)
         TryOpen(ORDER_TYPE_BUY, tick, rates, atr);
      else
         BlockTrade(StringFormat("bull: waiting [impulse=%s touch=%s depth=%s intact=%s trigger=%s]",
                    impulse ? "Y" : "n", touched ? "Y" : "n", depthOk ? "Y" : "n",
                    trendIntact ? "Y" : "n", trigger ? "Y" : "n"));
      return;
   }

   if(g_biasDir < 0)
   {
      double recentLow = LowestLow(rates, 1, InpImpulseRecentBars);
      double priorLow  = LowestLow(rates, 1 + InpImpulseRecentBars, InpImpulsePriorBars);
      bool impulse = recentLow < priorLow;

      double pullHigh = HighestHigh(rates, 1, InpPullbackLookback);
      bool touched  = pullHigh >= valueEma;
      double depth  = pullHigh - recentLow;
      bool depthOk  = depth >= InpMinPullbackAtr * atr && depth <= InpMaxPullbackAtr * atr;

      bool trendIntact = rates[1].close < trendEma;
      bool reclaimed   = rates[1].close < valueEma;
      bool engulf      = rates[2].close > rates[2].open &&
                         rates[1].close < rates[2].open && rates[1].open >= rates[2].close;
      bool strongClose = strengthDown >= InpMinCloseStrength;
      bool noChase     = (valueEma - rates[1].close) <= InpMaxChaseAtr * atr;
      bool trigger     = bearBar && reclaimed && (strongClose || engulf) && noChase;

      if(impulse && touched && depthOk && trendIntact && trigger)
         TryOpen(ORDER_TYPE_SELL, tick, rates, atr);
      else
         BlockTrade(StringFormat("bear: waiting [impulse=%s touch=%s depth=%s intact=%s trigger=%s]",
                    impulse ? "Y" : "n", touched ? "Y" : "n", depthOk ? "Y" : "n",
                    trendIntact ? "Y" : "n", trigger ? "Y" : "n"));
   }
}

double HighestHigh(const MqlRates &rates[], int start, int count)
{
   double h = rates[start].high;
   for(int i = start + 1; i < start + count && i < ArraySize(rates); i++)
      h = MathMax(h, rates[i].high);
   return h;
}

double LowestLow(const MqlRates &rates[], int start, int count)
{
   double l = rates[start].low;
   for(int i = start + 1; i < start + count && i < ArraySize(rates); i++)
      l = MathMin(l, rates[i].low);
   return l;
}

//+------------------------------------------------------------------+
//| Order placement: structural stop, cost gate, risk sizing         |
//+------------------------------------------------------------------+
void TryOpen(ENUM_ORDER_TYPE orderType, const MqlTick &tick, const MqlRates &rates[], double atr)
{
   double entry, stop;
   if(orderType == ORDER_TYPE_BUY)
   {
      entry = tick.ask;
      double swingLow = LowestLow(rates, 1, InpSwingBars);
      stop = swingLow - InpSwingBufferAtr * atr;
      double dist = entry - stop;
      dist = MathMax(InpMinSlAtr * atr, MathMin(InpMaxSlAtr * atr, dist));
      stop = entry - dist;
   }
   else
   {
      entry = tick.bid;
      double swingHigh = HighestHigh(rates, 1, InpSwingBars);
      stop = swingHigh + InpSwingBufferAtr * atr;
      double dist = stop - entry;
      dist = MathMax(InpMinSlAtr * atr, MathMin(InpMaxSlAtr * atr, dist));
      stop = entry + dist;
   }

   double rDistance = MathAbs(entry - stop);
   double stopPts   = rDistance / _Point;

   //--- cost gate: transaction costs may not eat more than X% of one R.
   //    This is the gate that made v1 uneconomical: costs vs an M5 stop
   //    were routinely 15-30% of risk. Here they are capped explicitly.
   double costPts = CurrentSpreadPoints(tick) + InpCommissionPoints;
   if(costPts > InpMaxCostPctOfRisk / 100.0 * stopPts)
   {
      BlockTrade(StringFormat("cost gate: %.0f pts cost > %.0f%% of %.0f pt stop",
                 costPts, InpMaxCostPctOfRisk, stopPts));
      return;
   }

   //--- sizing at the adaptive risk fraction
   double riskPct = CurrentRiskPercent();
   double lots = CalculateLots(rDistance, riskPct);
   string side = (orderType == ORDER_TYPE_BUY) ? "BUY" : "SELL";
   if(lots <= 0.0)
   {
      Print(side, " setup skipped: calculated lot below broker/risk minimum.");
      return;
   }

   //--- decide management mode up front: if the lot cannot be split into
   //    two legal halves, run single-target mode instead of partials.
   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   bool singleMode = (lots < 2.0 * minLot);

   double tpR = singleMode ? InpSingleModeTpR : InpFinalTpR;
   double target = (orderType == ORDER_TYPE_BUY) ? entry + tpR * rDistance
                                                 : entry - tpR * rDistance;

   ApplyMinimumStopDistance(orderType, entry, stop, target);
   stop      = NormalizeDouble(stop, _Digits);
   target    = NormalizeDouble(target, _Digits);
   rDistance = MathAbs(entry - stop);

   if(!MarginAllowsTrade(orderType, lots, entry))
   {
      Print(side, " setup skipped: margin gate rejected the trade.");
      return;
   }

   int rPoints = (int)MathRound(rDistance / _Point);
   string comment = "RPP R:" + IntegerToString(rPoints);   // redundant fallback; global vars are primary

   Print(side, " signal | bias=", g_biasDir > 0 ? "BULL" : "BEAR",
         " ER=", DoubleToString(g_er, 2),
         " volPct=", g_volRank >= 0 ? DoubleToString(g_volRank * 100.0, 0) : "n/a",
         " | R=", rPoints, " pts | lots=", DoubleToString(lots, 2),
         " | risk=", DoubleToString(riskPct, 2), "%",
         " | mode=", singleMode ? "single-target" : "partial+runner");

   if(!InpAllowLiveTrading)
   {
      Alert(side, " Regime Pullback signal on ", _Symbol, " (alert-only mode).");
      return;
   }

   bool ok = (orderType == ORDER_TYPE_BUY)
             ? trade.Buy(lots, _Symbol, 0.0, stop, target, comment)
             : trade.Sell(lots, _Symbol, 0.0, stop, target, comment);

   if(!ok)
   {
      Print("Order failed. Retcode=", trade.ResultRetcode(), " ", trade.ResultRetcodeDescription());
      return;
   }

   SaveMetaForNewPositions(rPoints, lots);
}

void SaveMetaForNewPositions(int rPoints, double lots)
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0)
         continue;
      if(PositionGetString(POSITION_SYMBOL) != _Symbol)
         continue;
      if((ulong)PositionGetInteger(POSITION_MAGIC) != InpMagicNumber)
         continue;

      long posId = PositionGetInteger(POSITION_IDENTIFIER);
      if(!GlobalVariableCheck(GvPos("R", posId)))
      {
         GlobalVariableSet(GvPos("R", posId), (double)rPoints);
         GlobalVariableSet(GvPos("V0", posId), lots);
      }
   }
}

//+------------------------------------------------------------------+
//| Position management (every tick)                                 |
//|  - flatten on confirmed opposite H4 regime / Friday close /      |
//|    (optional) daily-limit flatten                                |
//|  - time-stop for dead trades                                     |
//|  - partial at +1R -> break-even lock                             |
//|  - volatility-adaptive chandelier trail on the runner            |
//+------------------------------------------------------------------+
void ManagePositions(const MqlTick &tick)
{
   if(!InpAllowLiveTrading)
      return;

   double atr = Buf(hAtr, 1);
   bool fridayFlatten = FridayFlattenDue();
   bool dailyFlatten  = InpCloseOnDailyLimit && DailyLimitBreached();

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0)
         continue;
      if(PositionGetString(POSITION_SYMBOL) != _Symbol)
         continue;
      if((ulong)PositionGetInteger(POSITION_MAGIC) != InpMagicNumber)
         continue;

      long   type      = PositionGetInteger(POSITION_TYPE);
      long   posId     = PositionGetInteger(POSITION_IDENTIFIER);
      datetime opened  = (datetime)PositionGetInteger(POSITION_TIME);
      double openPrice = PositionGetDouble(POSITION_PRICE_OPEN);
      double currentSl = PositionGetDouble(POSITION_SL);
      double currentTp = PositionGetDouble(POSITION_TP);
      double volume    = PositionGetDouble(POSITION_VOLUME);

      //--- hard flatten conditions
      if(fridayFlatten)
      {
         Print("Closing ", ticket, ": Friday flatten before the weekend.");
         trade.PositionClose(ticket);
         continue;
      }
      if(dailyFlatten)
      {
         Print("Closing ", ticket, ": daily loss limit flatten.");
         trade.PositionClose(ticket);
         continue;
      }
      if(InpCloseOnBiasFlip && g_biasDir != 0)
      {
         if((type == POSITION_TYPE_BUY && g_biasDir < 0) ||
            (type == POSITION_TYPE_SELL && g_biasDir > 0))
         {
            Print("Closing ", ticket, ": H4 regime flipped against the position.");
            trade.PositionClose(ticket);
            continue;
         }
      }

      //--- per-position meta (R in points, initial volume)
      double rPoints = 0.0, v0 = 0.0;
      LoadPositionMeta(posId, openPrice, currentSl, (int)type, volume, rPoints, v0);
      if(rPoints <= 0.0)
         continue;                                   // manage by broker SL/TP only

      double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
      bool singleMode = (v0 > 0.0 && v0 < 2.0 * minLot);

      double profitPoints = (type == POSITION_TYPE_BUY)
                            ? (tick.bid - openPrice) / _Point
                            : (openPrice - tick.ask) / _Point;
      double profitR = profitPoints / rPoints;

      bool beDone = (type == POSITION_TYPE_BUY)
                    ? (currentSl > 0.0 && currentSl >= openPrice - 0.5 * _Point)
                    : (currentSl > 0.0 && currentSl <= openPrice + 0.5 * _Point);

      //--- time-stop: the setup thesis is immediate continuation; if the
      //    trade goes nowhere it is statistically closer to a coin flip,
      //    so free the capital and cap the bleed.
      if(!beDone && InpTimeStopBars > 0)
      {
         int age = iBarShift(_Symbol, InpEntryTimeframe, opened);
         if(age >= InpTimeStopBars && profitR <= InpTimeStopMaxR)
         {
            Print("Closing ", ticket, ": time-stop after ", age, " bars at ",
                  DoubleToString(profitR, 2), "R.");
            trade.PositionClose(ticket);
            continue;
         }
      }

      //--- stage 1: partial at +1R (or BE-only in single mode)
      if(!beDone && profitR >= InpPartialTakeR)
      {
         if(!singleMode)
         {
            double closeVol = NormalizeVolume(v0 * InpPartialClosePct / 100.0, false);
            if(closeVol >= minLot && volume - closeVol >= minLot)
            {
               if(!trade.PositionClosePartial(ticket, closeVol))
                  Print("Partial close failed. Retcode=", trade.ResultRetcode(), " ",
                        trade.ResultRetcodeDescription());
            }
         }

         double lockPts = InpBreakEvenLockR * rPoints;
         double newSl = (type == POSITION_TYPE_BUY) ? openPrice + lockPts * _Point
                                                    : openPrice - lockPts * _Point;
         newSl = ClampStopToMinDistance(type, newSl, tick);
         if(newSl > 0.0)
         {
            newSl = NormalizeDouble(newSl, _Digits);
            bool improves = (type == POSITION_TYPE_BUY) ? (newSl > currentSl)
                                                        : (currentSl <= 0.0 || newSl < currentSl);
            if(improves && !trade.PositionModify(ticket, newSl, currentTp))
               Print("Break-even modify failed. Retcode=", trade.ResultRetcode(), " ",
                     trade.ResultRetcodeDescription());
         }
         continue;
      }

      //--- stage 2: chandelier trail on the runner, tighten-only.
      //    Trail width adapts to the volatility percentile: quiet tape
      //    trails tighter, wild tape gets room to breathe.
      if(beDone && atr != EMPTY_VALUE && atr > 0.0 && InpTrailAtrMax > 0.0)
      {
         double volRank = (g_volRank >= 0.0) ? g_volRank : 0.5;
         double mult = InpTrailAtrMin + (InpTrailAtrMax - InpTrailAtrMin) * volRank;

         int sinceOpen = iBarShift(_Symbol, InpEntryTimeframe, opened);
         double newSl = 0.0;

         if(type == POSITION_TYPE_BUY)
         {
            double anchor = tick.bid;
            if(sinceOpen >= 1)
            {
               int hi = iHighest(_Symbol, InpEntryTimeframe, MODE_CLOSE, sinceOpen, 1);
               if(hi >= 0)
                  anchor = MathMax(anchor, iClose(_Symbol, InpEntryTimeframe, hi));
            }
            double candidate = anchor - mult * atr;
            candidate = ClampStopToMinDistance(type, candidate, tick);
            if(candidate > 0.0 && candidate > currentSl + _Point)
               newSl = candidate;
         }
         else
         {
            double anchor = tick.ask;
            if(sinceOpen >= 1)
            {
               int lo = iLowest(_Symbol, InpEntryTimeframe, MODE_CLOSE, sinceOpen, 1);
               if(lo >= 0)
                  anchor = MathMin(anchor, iClose(_Symbol, InpEntryTimeframe, lo));
            }
            double candidate = anchor + mult * atr;
            candidate = ClampStopToMinDistance(type, candidate, tick);
            if(candidate > 0.0 && (currentSl <= 0.0 || candidate < currentSl - _Point))
               newSl = candidate;
         }

         if(newSl > 0.0)
         {
            newSl = NormalizeDouble(newSl, _Digits);
            if(!trade.PositionModify(ticket, newSl, currentTp))
               Print("Trail modify failed. Retcode=", trade.ResultRetcode(), " ",
                     trade.ResultRetcodeDescription());
         }
      }
   }
}

bool FridayFlattenDue()
{
   if(!InpCloseAllFriday)
      return false;
   MqlDateTime g;
   TimeToStruct(GmtNow(), g);
   return (g.day_of_week == 5 && g.hour >= InpFridayCloseHourGmt);
}

//+------------------------------------------------------------------+
//| Per-position meta: primary = global variables, fallback = comment|
//| parse, last resort = reconstruct from the live SL distance.      |
//+------------------------------------------------------------------+
void LoadPositionMeta(long posId, double openPrice, double currentSl, int type,
                      double volume, double &rPoints, double &v0)
{
   rPoints = GlobalVariableCheck(GvPos("R", posId)) ? GlobalVariableGet(GvPos("R", posId)) : 0.0;
   v0      = GlobalVariableCheck(GvPos("V0", posId)) ? GlobalVariableGet(GvPos("V0", posId)) : 0.0;
   if(rPoints > 0.0 && v0 > 0.0)
      return;

   //--- fallback 1: comment (may be altered by some brokers)
   if(rPoints <= 0.0)
   {
      string comment = PositionGetString(POSITION_COMMENT);
      int pos = StringFind(comment, "R:");
      if(pos >= 0)
         rPoints = (double)StringToInteger(StringSubstr(comment, pos + 2));
   }

   //--- fallback 2: reconstruct from SL if it is still on the loss side
   if(rPoints <= 0.0 && currentSl > 0.0)
   {
      bool slOnLossSide = (type == POSITION_TYPE_BUY) ? (currentSl < openPrice)
                                                      : (currentSl > openPrice);
      if(slOnLossSide)
         rPoints = MathAbs(openPrice - currentSl) / _Point;
   }

   if(v0 <= 0.0)
      v0 = volume;

   if(rPoints > 0.0)
   {
      GlobalVariableSet(GvPos("R", posId), rPoints);
      GlobalVariableSet(GvPos("V0", posId), v0);
      Print("Recovered meta for position ", posId, ": R=", (int)rPoints, " pts (after restart).");
   }
}

void SweepOrphanMeta()
{
   string prefix = GvPrefix();
   for(int i = GlobalVariablesTotal() - 1; i >= 0; i--)
   {
      string name = GlobalVariableName(i);
      if(StringFind(name, prefix) != 0)
         continue;
      if(StringFind(name, prefix + "R_") != 0 && StringFind(name, prefix + "V0_") != 0)
         continue;

      int us = StringLen(name) - 1;
      while(us > 0 && StringGetCharacter(name, us) != '_')
         us--;
      long posId = StringToInteger(StringSubstr(name, us + 1));
      if(posId > 0 && !PositionStillOpen(posId))
         GlobalVariableDel(name);
   }
}

bool PositionStillOpen(long posId)
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0)
         continue;
      if(PositionGetInteger(POSITION_IDENTIFIER) == posId)
         return true;
   }
   return false;
}

//+------------------------------------------------------------------+
//| Trade bookkeeping: on final close of one of our positions,       |
//| aggregate its net P/L, update the loss streak, arm the symbol    |
//| re-entry cooldown, clean up meta.                                |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans,
                        const MqlTradeRequest &request,
                        const MqlTradeResult &result)
{
   if(trans.type != TRADE_TRANSACTION_DEAL_ADD)
      return;

   ulong deal = trans.deal;
   if(deal == 0 || !HistoryDealSelect(deal))
      return;
   if((ulong)HistoryDealGetInteger(deal, DEAL_MAGIC) != InpMagicNumber)
      return;

   ENUM_DEAL_ENTRY entry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(deal, DEAL_ENTRY);
   if(entry != DEAL_ENTRY_OUT && entry != DEAL_ENTRY_OUT_BY)
      return;

   long posId = HistoryDealGetInteger(deal, DEAL_POSITION_ID);
   if(PositionStillOpen(posId))
      return;                                        // partial close, not final

   //--- aggregate the whole position
   if(!HistorySelectByPosition(posId))
      return;
   double net = 0.0;
   for(int i = 0; i < HistoryDealsTotal(); i++)
   {
      ulong t = HistoryDealGetTicket(i);
      if(t == 0)
         continue;
      net += HistoryDealGetDouble(t, DEAL_PROFIT) +
             HistoryDealGetDouble(t, DEAL_SWAP) +
             HistoryDealGetDouble(t, DEAL_COMMISSION);
   }

   string closedSymbol = HistoryDealGetString(deal, DEAL_SYMBOL);

   //--- classify vs planned risk so tiny scratches don't poison the streak
   double rPts = GlobalVariableCheck(GvPos("R", posId)) ? GlobalVariableGet(GvPos("R", posId)) : 0.0;
   double v0   = GlobalVariableCheck(GvPos("V0", posId)) ? GlobalVariableGet(GvPos("V0", posId)) : 0.0;
   double riskMoney = 0.0;
   if(rPts > 0.0 && v0 > 0.0)
   {
      double tickSize  = SymbolInfoDouble(closedSymbol, SYMBOL_TRADE_TICK_SIZE);
      double tickValue = SymbolInfoDouble(closedSymbol, SYMBOL_TRADE_TICK_VALUE);
      double pointSize = SymbolInfoDouble(closedSymbol, SYMBOL_POINT);
      if(tickSize > 0.0 && tickValue > 0.0 && pointSize > 0.0)
         riskMoney = rPts * pointSize / tickSize * tickValue * v0;
   }

   bool isLoss, isWin;
   if(riskMoney > 0.0)
   {
      isLoss = (net <= -0.5 * riskMoney);
      isWin  = (net >=  0.25 * riskMoney);
   }
   else
   {
      isLoss = (net < 0.0);
      isWin  = (net > 0.0);
   }

   int streak = LossStreak();
   if(isLoss)
   {
      streak++;
      GlobalVariableSet(GvAcc("streak"), (double)streak);

      //--- symbol re-entry cooldown (stop machine-gunning a failing setup)
      if(InpReentryCooldownBars > 0 && closedSymbol == _Symbol)
      {
         datetime until = TimeCurrent() + (datetime)(InpReentryCooldownBars * PeriodSeconds(InpEntryTimeframe));
         GlobalVariableSet(GvSym("coolUntil"), (double)(long)until);
      }

      if(streak == InpLossStreakPause && InpPauseHours > 0)
      {
         datetime pauseUntil = TimeCurrent() + (datetime)(InpPauseHours * 3600);
         GlobalVariableSet(GvAcc("pauseUntil"), (double)(long)pauseUntil);
         Print("Loss streak of ", streak, " reached: pausing new entries for ",
               InpPauseHours, "h and running at half risk until a win.");
      }
      else if(streak == InpLossStreakHalveRisk)
         Print("Loss streak of ", streak, ": risk halved to ",
               DoubleToString(CurrentRiskPercent(), 2), "% until a win.");
   }
   else if(isWin)
   {
      if(streak > 0)
         Print("Winning trade: loss streak reset (was ", streak, ").");
      GlobalVariableSet(GvAcc("streak"), 0.0);
   }

   Print("Position ", posId, " closed. Net=", DoubleToString(net, 2),
         riskMoney > 0.0 ? StringFormat(" (%.2fR)", net / riskMoney) : "",
         " | streak=", LossStreak());

   GlobalVariableDel(GvPos("R", posId));
   GlobalVariableDel(GvPos("V0", posId));
}

//+------------------------------------------------------------------+
//| Pre-trade sanity                                                 |
//+------------------------------------------------------------------+
bool PreTradeChecks(const MqlTick &tick, string &reason)
{
   if((ENUM_SYMBOL_TRADE_MODE)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_MODE) == SYMBOL_TRADE_MODE_DISABLED)
   {
      reason = "symbol trading disabled";
      return false;
   }
   if(InpAllowLiveTrading && (!MQLInfoInteger(MQL_TRADE_ALLOWED) || !TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)))
   {
      reason = "live trading not allowed by terminal or chart";
      return false;
   }
   if(tick.bid <= 0.0 || tick.ask <= 0.0)
   {
      reason = "no quotes received yet";
      return false;
   }

   int spread = CurrentSpreadPoints(tick);
   if(spread < 0)
   {
      reason = "invalid quote (crossed bid/ask)";
      return false;
   }
   if(InpMaxSpreadPoints > 0 && spread > InpMaxSpreadPoints)
   {
      reason = "spread too high: " + IntegerToString(spread) + " pts";
      return false;
   }
   return true;
}

//+------------------------------------------------------------------+
//| Helpers                                                          |
//+------------------------------------------------------------------+
double Buf(int handle, int shift)
{
   double value[1];
   if(CopyBuffer(handle, 0, shift, 1, value) != 1)
      return EMPTY_VALUE;
   return value[0];
}

int CurrentSpreadPoints(const MqlTick &tick)
{
   return (int)MathRound((tick.ask - tick.bid) / _Point);
}

void ApplyBestFillingMode()
{
   long fillingFlags = SymbolInfoInteger(_Symbol, SYMBOL_FILLING_MODE);
   if((fillingFlags & SYMBOL_FILLING_IOC) != 0)
      trade.SetTypeFilling(ORDER_FILLING_IOC);
   else if((fillingFlags & SYMBOL_FILLING_FOK) != 0)
      trade.SetTypeFilling(ORDER_FILLING_FOK);
   else
      trade.SetTypeFilling(ORDER_FILLING_RETURN);
}

bool MarginAllowsTrade(ENUM_ORDER_TYPE orderType, double lots, double entryPrice)
{
   if(!InpAllowLiveTrading)
      return true;

   double margin = 0.0;
   if(!OrderCalcMargin(orderType, _Symbol, lots, entryPrice, margin))
   {
      Print("OrderCalcMargin failed. Error=", GetLastError());
      return false;
   }
   double freeMargin = AccountInfoDouble(ACCOUNT_MARGIN_FREE);
   return (margin > 0.0 && freeMargin > 0.0 && margin < freeMargin);
}

double CalculateLots(double stopDistance, double riskPercent)
{
   if(stopDistance <= 0.0)
      return 0.0;

   double equity    = AccountInfoDouble(ACCOUNT_EQUITY);
   double riskMoney = equity * riskPercent / 100.0;
   double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   if(tickSize <= 0.0 || tickValue <= 0.0)
      return 0.0;

   double lossPerLot = stopDistance / tickSize * tickValue;
   if(lossPerLot <= 0.0)
      return 0.0;

   return NormalizeVolume(riskMoney / lossPerLot, false);
}

double NormalizeVolume(double volume, bool allowRaiseToMinimum)
{
   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double step   = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);

   if(volume <= 0.0 || minLot <= 0.0 || maxLot < minLot)
      return 0.0;
   if(!allowRaiseToMinimum && volume < minLot)
      return 0.0;

   volume = MathMax(minLot, MathMin(maxLot, volume));
   if(step > 0.0)
      volume = MathFloor(volume / step) * step;
   if(volume < minLot)
      return 0.0;

   int digits = 2;
   if(step > 0.0)
      digits = (int)MathMax(0, MathRound(-MathLog10(step)));
   return NormalizeDouble(volume, digits);
}

void ApplyMinimumStopDistance(ENUM_ORDER_TYPE orderType, double entry, double &stop, double &target)
{
   int stopLevelPoints = (int)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
   double minimumDistance = (stopLevelPoints + 2) * _Point;
   if(minimumDistance <= 0.0)
      return;

   if(orderType == ORDER_TYPE_BUY)
   {
      if(entry - stop < minimumDistance)   stop = entry - minimumDistance;
      if(target - entry < minimumDistance) target = entry + minimumDistance;
   }
   else
   {
      if(stop - entry < minimumDistance)   stop = entry + minimumDistance;
      if(entry - target < minimumDistance) target = entry - minimumDistance;
   }
}

double ClampStopToMinDistance(long type, double candidate, const MqlTick &tick)
{
   int stopLevelPoints = (int)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
   double minimumDistance = (stopLevelPoints + 2) * _Point;

   if(type == POSITION_TYPE_BUY)
   {
      if(tick.bid - candidate < minimumDistance)
         candidate = tick.bid - minimumDistance;
   }
   else
   {
      if(candidate - tick.ask < minimumDistance)
         candidate = tick.ask + minimumDistance;
   }
   return candidate;
}

//+------------------------------------------------------------------+
//| Diagnostics                                                      |
//+------------------------------------------------------------------+
void BuildGateTrace()
{
   string bias = (g_biasDir > 0) ? "BULL" : (g_biasDir < 0 ? "BEAR" : "NEUTRAL");
   g_gateTrace = StringFormat("bias=%s  ER=%s  volPct=%s  streak=%d  risk=%.2f%%",
                              bias,
                              g_er >= 0.0 ? DoubleToString(g_er, 2) : "n/a",
                              g_volRank >= 0.0 ? DoubleToString(g_volRank * 100.0, 0) : "n/a",
                              LossStreak(),
                              CurrentRiskPercent());
}

void ShowStatus()
{
   double anchor = DayStartEquity();
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double dayPl  = (anchor > 0.0) ? (equity - anchor) / anchor * 100.0 : 0.0;

   Comment("Regime Pullback Pro  ", TimeToString(TimeCurrent(), TIME_MINUTES | TIME_SECONDS),
           "\n", g_gateTrace,
           "\nday P/L: ", DoubleToString(dayPl, 2), "%  (limit -", DoubleToString(InpDailyLossLimitPct, 1), "%)",
           "  open(sym): ", IntegerToString(CountSymbolPositions()),
           "\nlast block: ", g_lastBlock);
}

int CountSymbolPositions()
{
   int count = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0)
         continue;
      if(PositionGetString(POSITION_SYMBOL) != _Symbol)
         continue;
      if((ulong)PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
         count++;
   }
   return count;
}

void BlockTrade(string reason)
{
   bool sameReason = (reason == g_lastBlock);
   g_lastBlock = reason;

   if(!InpLogBlockedReasons)
      return;

   datetime now = TimeCurrent();
   if(sameReason && g_lastBlockLog > 0 && now - g_lastBlockLog < InpBlockLogSeconds)
      return;

   Print("No trade: ", reason);
   g_lastBlockLog = now;
}

//+------------------------------------------------------------------+
//| Custom optimisation criterion for walk-forward runs:             |
//| profit factor (capped) x sqrt(trades) x drawdown penalty.        |
//| Rewards robust, well-sampled, low-DD parameter plateaus instead  |
//| of lucky spikes. Select by this in the optimiser.                |
//+------------------------------------------------------------------+
double OnTester()
{
   double trades = TesterStatistics(STAT_TRADES);
   if(trades < 80)
      return 0.0;                                   // too few trades = statistically meaningless

   double pf = TesterStatistics(STAT_PROFIT_FACTOR);
   double dd = TesterStatistics(STAT_EQUITY_DDREL_PERCENT);
   if(pf <= 0.0)
      return 0.0;

   double ddPenalty = MathMax(0.0, 1.0 - dd / 15.0); // zero score at 15%+ drawdown
   return MathMin(pf, 3.0) * MathSqrt(trades) * ddPenalty;
}
//+------------------------------------------------------------------+
