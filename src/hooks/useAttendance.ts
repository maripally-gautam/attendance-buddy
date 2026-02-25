import { useState, useCallback, useEffect } from "react";

export interface AttendanceState {
  requiredPercentage: number;
  classesPerDay: number;
  daysPerWeek: number;
  presentCount: number;
  totalCount: number;
}

export interface CalculationResult {
  currentPercentage: number;
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

function loadState(): AttendanceState {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    const s = settings ? JSON.parse(settings) : {};
    return {
      requiredPercentage: s.requiredPercentage ?? 75,
      classesPerDay: s.classesPerDay ?? 5,
      daysPerWeek: s.daysPerWeek ?? 6,
      presentCount: s.presentCount ?? 0,
      totalCount: s.totalCount ?? 0,
    };
  } catch { }
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
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
  } catch { }
}

// 📌 1. attendancePercentage = (presentDays / totalDays) * 100, round 2
function calcPercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat(((present / total) * 100).toFixed(2));
}

// 📌 2. requiredClasses = ((R/100)*T - P) / (1 - R/100). If <0 → 0, else ceil()
function calcClassesNeeded(P: number, T: number, R: number): number {
  const r = R / 100;
  if (r >= 1) return Infinity;
  const needed = (r * T - P) / (1 - r);
  if (needed <= 0) return 0;
  return Math.ceil(needed);
}

// 📌 3. allowedBunks = (P / (R/100)) - T. If <0 → 0, else floor()
function calcBunksLeft(P: number, T: number, R: number): number {
  const r = R / 100;
  if (r <= 0) return Infinity;
  const bunks = P / r - T;
  if (bunks <= 0) return 0;
  return Math.floor(bunks);
}

// 📌 4. days = classes / classesPerDay, round 2
function classesToDays(classes: number, classesPerDay: number): number {
  if (classesPerDay <= 0) return 0;
  return parseFloat((classes / classesPerDay).toFixed(2));
}

// 📌 5. weeks = (classes / classesPerDay) / daysPerWeek, round 2
function classesToWeeks(classes: number, classesPerDay: number, daysPerWeek: number): number {
  if (classesPerDay <= 0 || daysPerWeek <= 0) return 0;
  const days = classes / classesPerDay;
  return parseFloat((days / daysPerWeek).toFixed(2));
}

// 📌 6. classes = days * classesPerDay
function daysToClasses(days: number, classesPerDay: number): number {
  return days * classesPerDay;
}

// 📌 7. days = weeks * daysPerWeek; classes = days * classesPerDay
function weeksToClasses(weeks: number, daysPerWeek: number, classesPerDay: number): number {
  return weeks * daysPerWeek * classesPerDay;
}

function convertToClasses(
  value: number,
  unit: "classes" | "days" | "weeks",
  classesPerDay: number,
  daysPerWeek: number
): number {
  if (unit === "days") return Math.round(daysToClasses(value, classesPerDay));
  if (unit === "weeks") return Math.round(weeksToClasses(value, daysPerWeek, classesPerDay));
  return Math.round(value);
}

export function useAttendance() {
  const [state, setState] = useState<AttendanceState>(loadState);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>("");

  // 📌 1. Current percentage based on entered values
  const percentage = calcPercentage(state.presentCount, state.totalCount);

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

  // Calculate attendance based on entered present & total values
  const calculateAttendance = useCallback(
    (present: number, total: number): boolean => {
      setError("");
      setPrediction(null);

      const settingsError = validateSettings();
      if (settingsError) {
        setError(settingsError);
        return false;
      }
      if (!Number.isFinite(total) || total <= 0) {
        setError("Total classes must be a positive number.");
        return false;
      }
      if (!Number.isFinite(present) || present < 0) {
        setError("Present classes must be a non-negative number.");
        return false;
      }
      if (present > total) {
        setError("Present classes cannot exceed total classes.");
        return false;
      }

      // Store the values
      setState((prev) => ({
        ...prev,
        presentCount: present,
        totalCount: total,
      }));

      const R = state.requiredPercentage;
      const cpd = state.classesPerDay;
      const dpw = state.daysPerWeek;

      const currentPct = calcPercentage(present, total);
      const classesNeeded = calcClassesNeeded(present, total, R);
      const bunksLeft = calcBunksLeft(present, total, R);

      setResult({
        currentPercentage: currentPct,
        classesNeeded,
        bunksLeft,
        classesNeededDays: classesToDays(classesNeeded, cpd),
        classesNeededWeeks: classesToWeeks(classesNeeded, cpd, dpw),
        bunksLeftDays: classesToDays(bunksLeft, cpd),
        bunksLeftWeeks: classesToWeeks(bunksLeft, cpd, dpw),
      });

      return true;
    },
    [state, validateSettings]
  );

  // 📌 8. Future attendance prediction
  // Convert input to classes → N
  // Present: newPresent = P + N, newTotal = T + N
  // Absent:  newPresent = P,     newTotal = T + N
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

      if (state.totalCount === 0) {
        setError("Please calculate your current attendance first.");
        return false;
      }

      const P = state.presentCount;
      const T = state.totalCount;
      const R = state.requiredPercentage;
      const cpd = state.classesPerDay;
      const dpw = state.daysPerWeek;

      const N = convertToClasses(value, unit, cpd, dpw);

      const newPresent = status === "present" ? P + N : P;
      const newTotal = T + N;

      const futurePercentage = calcPercentage(newPresent, newTotal);
      const classesNeeded = calcClassesNeeded(newPresent, newTotal, R);
      const bunksLeft = calcBunksLeft(newPresent, newTotal, R);

      setPrediction({
        percentage: futurePercentage,
        classesNeeded,
        bunksLeft,
        days: classesToDays(classesNeeded, cpd),
        weeks: classesToWeeks(classesNeeded, cpd, dpw),
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
