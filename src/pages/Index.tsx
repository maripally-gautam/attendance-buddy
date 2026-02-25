import { useState } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import ProgressCircle from "@/components/ProgressCircle";
import SettingsCard from "@/components/SettingsCard";
import InputCard from "@/components/DailyInputCard";
import ResultCard from "@/components/ResultCard";
import PredictionCard from "@/components/PredictionCard";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const {
    state,
    percentage,
    result,
    prediction,
    error,
    updateSettings,
    calculateAttendance,
    calculatePrediction,
  } = useAttendance();

  const [present, setPresent] = useState(state.presentCount > 0 ? String(state.presentCount) : "");
  const [total, setTotal] = useState(state.totalCount > 0 ? String(state.totalCount) : "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="mx-auto max-w-md px-4 pb-10 pt-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Attendance Calculator
          </h1>
          <ThemeToggle />
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
        />

        {/* Input */}
        <InputCard
          onCalculate={calculateAttendance}
          present={present}
          setPresent={setPresent}
          total={total}
          setTotal={setTotal}
        />

        {/* Result */}
        {result && <ResultCard result={result} />}

        {/* Prediction */}
        <PredictionCard
          onPredict={calculatePrediction}
          prediction={prediction}
        />

        {/* Settings */}
        <SettingsCard state={state} onUpdate={updateSettings} />
      </div>
    </div>
  );
};

export default Index;
