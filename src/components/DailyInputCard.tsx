interface InputCardProps {
  onCalculate: (present: number, total: number) => boolean;
  present: string;
  setPresent: (v: string) => void;
  total: string;
  setTotal: (v: string) => void;
}

export default function InputCard({
  onCalculate,
  present,
  setPresent,
  total,
  setTotal,
}: InputCardProps) {
  const handleSubmit = () => {
    onCalculate(parseFloat(present), parseFloat(total));
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        📋 Enter Attendance
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Classes Attended</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 45"
            value={present}
            onChange={(e) => setPresent(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Total Classes</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 60"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold active:scale-[0.98] transition-transform"
      >
        Calculate
      </button>
    </div>
  );
}
