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

/** Compute classes needed and bunks left given present/total/required */
function computeMetrics(present: number, total: number, requiredPct: number) {
  const req = requiredPct / 100;
  const pct = total === 0 ? 0 : (present / total) * 100;

  let classesNeeded = 0;
  if (pct < requiredPct && req < 1) {
    classesNeeded = Math.ceil((req * total - present) / (1 - req));
    if (classesNeeded < 0) classesNeeded = 0;
  }

  let bunksLeft = 0;
  if (req > 0) {
    bunksLeft = Math.floor(present / req - total);
    if (bunksLeft < 0) bunksLeft = 0;
  }

  return { pct, classesNeeded, bunksLeft };
}

export function useAttendance() {
  const [state, setState] = useState<AttendanceState>(loadState);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>("");

  // Track what was last added so re-clicking same inputs doesn't accumulate
  const [lastAdded, setLastAdded] = useState<{ present: number; total: number } | null>(null);

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

      const presentToAdd =
        status === "present" ? classesToday : totalToday - classesToday;

      // Undo last addition if re-clicking with same/different values
      setState((prev) => {
        let basePresent = prev.presentCount;
        let baseTotal = prev.totalCount;

        if (lastAdded) {
          basePresent -= lastAdded.present;
          baseTotal -= lastAdded.total;
        }

        const newPresent = basePresent + presentToAdd;
        const newTotal = baseTotal + totalToday;

        return {
          ...prev,
          presentCount: newPresent,
          totalCount: newTotal,
        };
      });

      setLastAdded({ present: presentToAdd, total: totalToday });

      // Compute result using the new values
      // We need to calculate based on what state WILL be
      const basePresent = lastAdded
        ? state.presentCount - lastAdded.present
        : state.presentCount;
      const baseTotal = lastAdded
        ? state.totalCount - lastAdded.total
        : state.totalCount;

      const newPresent = basePresent + presentToAdd;
      const newTotal = baseTotal + totalToday;

      const { classesNeeded, bunksLeft } = computeMetrics(
        newPresent,
        newTotal,
        state.requiredPercentage
      );

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
    [state, validateSettings, lastAdded]
  );

  const calculatePrediction = useCallback(
    (
      value: number,
      unit: "classes" | "days" | "weeks",
      status: "present" | "absent",
      dailyStatus?: "present" | "absent",
      dailyClasses?: number,
      dailyTotal?: number
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

      // Start from base counters (undo lastAdded to get clean base)
      let basePresent = state.presentCount;
      let baseTotal = state.totalCount;

      if (lastAdded) {
        basePresent -= lastAdded.present;
        baseTotal -= lastAdded.total;
      }

      // Add the daily input if provided (whether or not "show current" was clicked)
      if (
        dailyTotal != null &&
        dailyTotal > 0 &&
        dailyClasses != null &&
        dailyClasses >= 0 &&
        dailyClasses <= dailyTotal
      ) {
        const dailyPresent =
          dailyStatus === "present"
            ? dailyClasses
            : dailyTotal - dailyClasses;
        basePresent += dailyPresent;
        baseTotal += dailyTotal;
      } else if (lastAdded) {
        // If daily input is invalid but we have lastAdded (user already clicked show current), use that
        basePresent += lastAdded.present;
        baseTotal += lastAdded.total;
      }

      // Now add prediction
      let classes = value;
      if (unit === "days") classes = value * state.classesPerDay;
      if (unit === "weeks")
        classes = value * state.daysPerWeek * state.classesPerDay;
      classes = Math.round(classes);

      const addPresent = status === "present" ? classes : 0;
      const newPresent = basePresent + addPresent;
      const newTotal = baseTotal + classes;

      const { pct, classesNeeded, bunksLeft } = computeMetrics(
        newPresent,
        newTotal,
        state.requiredPercentage
      );

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
    [state, validateSettings, lastAdded]
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
