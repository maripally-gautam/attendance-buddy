import { useState, useCallback, useEffect } from "react";

export interface AttendanceState {
  requiredPercentage: number;
  classesPerDay: number;
  daysPerWeek: number;
  presentCount: number;
  totalCount: number;
}

export interface CalculationResult {
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

const SETTINGS_KEY = "attendance-calculator-settings";
const COUNTERS_KEY = "attendance-calculator-counters";

function loadState(): AttendanceState {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    const counters = sessionStorage.getItem(COUNTERS_KEY);
    const s = settings ? JSON.parse(settings) : {};
    const c = counters ? JSON.parse(counters) : {};
    return {
      requiredPercentage: s.requiredPercentage ?? 75,
      classesPerDay: s.classesPerDay ?? 5,
      daysPerWeek: s.daysPerWeek ?? 6,
      presentCount: c.presentCount ?? 0,
      totalCount: c.totalCount ?? 0,
    };
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
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        requiredPercentage: state.requiredPercentage,
        classesPerDay: state.classesPerDay,
        daysPerWeek: state.daysPerWeek,
      })
    );
    sessionStorage.setItem(
      COUNTERS_KEY,
      JSON.stringify({
        presentCount: state.presentCount,
        totalCount: state.totalCount,
      })
    );
  } catch {}
}

export function useAttendance() {
  const [state, setState] = useState<AttendanceState>(loadState);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>("");

  // Derived percentage from state directly
  const percentage =
    state.totalCount > 0
      ? parseFloat(((state.presentCount / state.totalCount) * 100).toFixed(2))
      : 0;

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
    (
      status: "present" | "absent",
      classesToday: number,
      totalToday: number
    ): boolean => {
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
        setError("Value must be a non-negative number.");
        return false;
      }
      if (classesToday > totalToday) {
        setError(
          status === "present"
            ? "Present classes cannot exceed total classes."
            : "Absent classes cannot exceed total classes."
        );
        return false;
      }

      // When present: classesToday = attended classes
      // When absent: classesToday = missed classes, so attended = total - absent
      const presentToAdd =
        status === "present" ? classesToday : totalToday - classesToday;
      const newPresent = state.presentCount + presentToAdd;
      const newTotal = state.totalCount + totalToday;

      setState((prev) => ({
        ...prev,
        presentCount: newPresent,
        totalCount: newTotal,
      }));

      const req = state.requiredPercentage / 100;
      const newPct = newTotal === 0 ? 0 : (newPresent / newTotal) * 100;

      let classesNeeded = 0;
      if (newPct < state.requiredPercentage && req < 1) {
        classesNeeded = Math.ceil(
          (req * newTotal - newPresent) / (1 - req)
        );
        if (classesNeeded < 0) classesNeeded = 0;
      }

      let bunksLeft = 0;
      if (req > 0) {
        bunksLeft = Math.floor(newPresent / req - newTotal);
        if (bunksLeft < 0) bunksLeft = 0;
      }

      const cpd = state.classesPerDay;
      const dpw = state.daysPerWeek;

      setResult({
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

      const pct = newTotal === 0 ? 0 : (newPresent / newTotal) * 100;
      const req = state.requiredPercentage / 100;

      let classesNeeded = 0;
      if (pct < state.requiredPercentage && req < 1) {
        classesNeeded = Math.ceil(
          (req * newTotal - newPresent) / (1 - req)
        );
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
        percentage: parseFloat(pct.toFixed(2)),
        classesNeeded,
        bunksLeft,
        days: parseFloat((classesNeeded / cpd).toFixed(2)),
        weeks: parseFloat((classesNeeded / (cpd * dpw)).toFixed(2)),
      });

      return true;
    },
    [state, validateSettings]
  );

  return {
    state,
    percentage,
    result,
    prediction,
    error,
    updateSettings,
    calculateAttendance,
    calculatePrediction,
    setError,
  };
}
