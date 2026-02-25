import { useState } from "react";
import { PredictionResult } from "@/hooks/useAttendance";

interface PredictionCardProps {
  onPredict: (
    value: number,
    unit: "classes" | "days" | "weeks",
    status: "present" | "absent",
    dailyStatus: "present" | "absent",
    dailyClasses: number,
    dailyTotal: number
  ) => boolean;
  prediction: PredictionResult | null;
  dailyStatus: "present" | "absent";
  dailyClasses: string;
  dailyTotal: string;
}

export default function PredictionCard({
  onPredict,
  prediction,
  dailyStatus,
  dailyClasses,
  dailyTotal,
}: PredictionCardProps) {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"classes" | "days" | "weeks">("classes");
  const [status, setStatus] = useState<"present" | "absent">("present");

  return (
    <div className="glass-card p-4 space-y-3">
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        🔮 Prediction
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Value</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 10"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as "classes" | "days" | "weeks")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="classes">Classes</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "present" | "absent")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      </div>
      <button
        onClick={() =>
          onPredict(
            parseFloat(value),
            unit,
            status,
            dailyStatus,
            parseFloat(dailyClasses) || 0,
            parseFloat(dailyTotal) || 0
          )
        }
        className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold active:scale-[0.98] transition-transform"
      >
        Show Future Attendance
      </button>

      {prediction && (
        <div className="rounded-xl bg-muted/50 p-4 space-y-2 animate-fade-in">
          <p className="text-center text-2xl font-bold text-foreground">
            {prediction.percentage.toFixed(2)}%
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground text-sm">{prediction.classesNeeded}</p>
              <p>classes need</p>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{prediction.days}</p>
              <p>days</p>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{prediction.weeks}</p>
              <p>weeks</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Bunks left: <span className="font-semibold text-foreground">{prediction.bunksLeft}</span>
          </p>
        </div>
      )}
    </div>
  );
}
