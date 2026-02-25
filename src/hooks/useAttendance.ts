import { useState, useCallback, useEffect } from "react";

export interface AttendanceState {
  requiredPercentage: number;
  classesPerDay: number;
  daysPerWeek: number;
  presentCount: number;
  totalCount: number;
}

export interface CalculationResult {
  percentage: number;
  classesNeeded: number;
  bunksLeft: number;
  classesNeededDays: number;
  classesNeededWeeks: number;
  bunksLeftDays: number;
  bunksLeftWeeks: number;
}

export interface PredictionResult {
  percentage: number;
  classesNeeded: number;
  bunksLeft: number;
  days: number;
  weeks: number;
}

const STORAGE_KEY = "attendance-calculator-state";

function loadState(): AttendanceState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return {
    requiredPercentage: 75,
    classesPerDay: 5,
    daysPerWeek: 6,
    presentCount: 0,
    totalCount: 0,
  };
}

function saveState(state: AttendanceState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useAttendance() {
  const [state, setState] = useState<AttendanceState>(loadState);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateSettings = useCallback(
    (field: keyof AttendanceState, value: number) => {
      setError("");
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateSettings = useCallback((): string | null => {
    if (state.requiredPercentage <= 0 || state.requiredPercentage > 100)
      return "Required percentage must be between 1 and 100.";
    if (state.classesPerDay < 1) return "Classes per day must be at least 1.";
    if (state.daysPerWeek < 1) return "Days per week must be at least 1.";
    return null;
  }, [state]);

  const calculateAttendance = useCallback(
    (status: "present" | "absent", classesToday: number, totalToday: number): boolean => {
      setError("");
      setPrediction(null);

      const settingsError = validateSettings();
      if (settingsError) {
        setError(settingsError);
        return false;
      }
      if (totalToday <= 0 || !Number.isFinite(totalToday)) {
        setError("Total classes today must be a positive number.");
        return false;
      }
      if (classesToday < 0 || !Number.isFinite(classesToday)) {
        setError("Present classes must be a non-negative number.");
        return false;
      }
      if (status === "present" && classesToday > totalToday) {
        setError("Present classes cannot exceed total classes.");
        return false;
      }

      const presentToAdd = status === "present" ? classesToday : 0;
      const newPresent = state.presentCount + presentToAdd;
      const newTotal = state.totalCount + totalToday;

      setState((prev) => ({
        ...prev,
        presentCount: newPresent,
        totalCount: newTotal,
      }));

      const percentage = newTotal === 0 ? 0 : (newPresent / newTotal) * 100;
      const req = state.requiredPercentage / 100;

      // Classes needed to reach required %: solve (present + x) / (total + x) >= req
      let classesNeeded = 0;
      if (percentage < state.requiredPercentage && req < 1) {
        classesNeeded = Math.ceil((req * newTotal - newPresent) / (1 - req));
        if (classesNeeded < 0) classesNeeded = 0;
      }

      // Bunks left: solve present / (total + x) >= req => x <= present/req - total
      let bunksLeft = 0;
      if (req > 0) {
        bunksLeft = Math.floor(newPresent / req - newTotal);
        if (bunksLeft < 0) bunksLeft = 0;
      }

      const cpd = state.classesPerDay;
      const dpw = state.daysPerWeek;

      setResult({
        percentage: parseFloat(percentage.toFixed(2)),
        classesNeeded,
        bunksLeft,
        classesNeededDays: parseFloat((classesNeeded / cpd).toFixed(2)),
        classesNeededWeeks: parseFloat(
          (classesNeeded / (cpd * dpw)).toFixed(2)
        ),
        bunksLeftDays: parseFloat((bunksLeft / cpd).toFixed(2)),
        bunksLeftWeeks: parseFloat((bunksLeft / (cpd * dpw)).toFixed(2)),
      });

      return true;
    },
    [state, validateSettings]
  );

  const calculatePrediction = useCallback(
    (
      value: number,
      unit: "classes" | "days" | "weeks",
      status: "present" | "absent"
    ): boolean => {
      setError("");

      if (value <= 0 || !Number.isFinite(value)) {
        setError("Prediction value must be a positive number.");
        return false;
      }

      const settingsError = validateSettings();
      if (settingsError) {
        setError(settingsError);
        return false;
      }

      let classes = value;
      if (unit === "days") classes = value * state.classesPerDay;
      if (unit === "weeks")
        classes = value * state.daysPerWeek * state.classesPerDay;
      classes = Math.round(classes);

      const addPresent = status === "present" ? classes : 0;
      const newPresent = state.presentCount + addPresent;
      const newTotal = state.totalCount + classes;

      const percentage = newTotal === 0 ? 0 : (newPresent / newTotal) * 100;
      const req = state.requiredPercentage / 100;

      let classesNeeded = 0;
      if (percentage < state.requiredPercentage && req < 1) {
        classesNeeded = Math.ceil((req * newTotal - newPresent) / (1 - req));
        if (classesNeeded < 0) classesNeeded = 0;
      }

      let bunksLeft = 0;
      if (req > 0) {
        bunksLeft = Math.floor(newPresent / req - newTotal);
        if (bunksLeft < 0) bunksLeft = 0;
      }

      const cpd = state.classesPerDay;
      const dpw = state.daysPerWeek;

      setPrediction({
        percentage: parseFloat(percentage.toFixed(2)),
        classesNeeded,
        bunksLeft,
        days: parseFloat((classesNeeded / cpd).toFixed(2)),
        weeks: parseFloat((classesNeeded / (cpd * dpw)).toFixed(2)),
      });

      return true;
    },
    [state, result, validateSettings]
  );

  const reset = useCallback(() => {
    setState((prev) => ({ ...prev, presentCount: 0, totalCount: 0 }));
    setResult(null);
    setPrediction(null);
    setError("");
  }, []);

  return {
    state,
    result,
    prediction,
    error,
    updateSettings,
    calculateAttendance,
    calculatePrediction,
    reset,
    setError,
  };
}
