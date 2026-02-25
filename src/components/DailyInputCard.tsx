interface DailyInputCardProps {
  onCalculate: (status: "present" | "absent", classesToday: number, totalToday: number) => boolean;
  status: "present" | "absent";
  setStatus: (s: "present" | "absent") => void;
  classesToday: string;
  setClassesToday: (v: string) => void;
  totalToday: string;
  setTotalToday: (v: string) => void;
}

export default function DailyInputCard({
  onCalculate,
  status,
  setStatus,
  classesToday,
  setClassesToday,
  totalToday,
  setTotalToday,
}: DailyInputCardProps) {
  const handleSubmit = () => {
    const count = parseFloat(classesToday);
    const total = parseFloat(totalToday);
    onCalculate(status, count, total);
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        📋 Daily Input
      </h2>
      <div className="grid grid-cols-3 gap-3">
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
          <label className="text-[11px] text-muted-foreground">
            {status === "present" ? "Present" : "Absent"}
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder={status === "present" ? "e.g. 4" : "e.g. 1"}
            value={classesToday}
            onChange={(e) => setClassesToday(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Total</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 5"
            value={totalToday}
            onChange={(e) => setTotalToday(e.target.value)}
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
