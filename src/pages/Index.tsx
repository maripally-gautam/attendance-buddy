import { useAttendance } from "@/hooks/useAttendance";
import ProgressCircle from "@/components/ProgressCircle";
import SettingsCard from "@/components/SettingsCard";
import DailyInputCard from "@/components/DailyInputCard";
import ResultCard from "@/components/ResultCard";
import PredictionCard from "@/components/PredictionCard";

const Index = () => {
  const {
    state,
    result,
    prediction,
    error,
    updateSettings,
    calculateAttendance,
    calculatePrediction,
    reset,
  } = useAttendance();

  const percentage = result?.percentage ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="mx-auto max-w-md px-4 pb-10 pt-6 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Attendance Calculator
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive animate-fade-in">
            {error}
          </div>
        )}

        {/* Progress Circle */}
        <ProgressCircle
          percentage={percentage}
          requiredPercentage={state.requiredPercentage}
          presentCount={state.presentCount}
          totalCount={state.totalCount}
          bunksLeft={result?.bunksLeft ?? 0}
          classesNeeded={result?.classesNeeded ?? 0}
        />

        {/* Settings */}
        <SettingsCard state={state} onUpdate={updateSettings} />

        {/* Daily Input */}
        <DailyInputCard onCalculate={calculateAttendance} />

        {/* Result */}
        {result && <ResultCard result={result} />}

        {/* Prediction */}
        {result && (
          <PredictionCard
            onPredict={calculatePrediction}
            prediction={prediction}
          />
        )}

        {/* Reset */}
        {result && (
          <button
            onClick={reset}
            className="w-full rounded-xl border border-border bg-card text-muted-foreground py-3 text-sm font-medium active:scale-[0.98] transition-transform"
          >
            Reset Counters
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;
