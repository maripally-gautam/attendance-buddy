import { useState } from "react";

interface DailyInputCardProps {
  onCalculate: (status: "present" | "absent", classesToday: number) => boolean;
}

export default function DailyInputCard({ onCalculate }: DailyInputCardProps) {
  const [status, setStatus] = useState<"present" | "absent">("present");
  const [classesToday, setClassesToday] = useState("");

  const handleSubmit = () => {
    const val = parseFloat(classesToday);
    if (onCalculate(status, val)) {
      setClassesToday("");
    }
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        📋 Daily Input
      </h2>
      <div className="grid grid-cols-2 gap-3">
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
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Classes Today</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 5"
            value={classesToday}
            onChange={(e) => setClassesToday(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold active:scale-[0.98] transition-transform"
      >
        Show Current Attendance
      </button>
    </div>
  );
}
