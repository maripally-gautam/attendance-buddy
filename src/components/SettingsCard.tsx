import { AttendanceState } from "@/hooks/useAttendance";

interface SettingsCardProps {
  state: AttendanceState;
  onUpdate: (field: keyof AttendanceState, value: number) => void;
}

export default function SettingsCard({ state, onUpdate }: SettingsCardProps) {
  return (
    <div className="glass-card p-4 space-y-3">
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        ⚙️ Settings
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Required %", field: "requiredPercentage" as const, val: state.requiredPercentage },
          { label: "Classes/Day", field: "classesPerDay" as const, val: state.classesPerDay },
          { label: "Days/Week", field: "daysPerWeek" as const, val: state.daysPerWeek },
        ].map((item) => (
          <div key={item.field} className="flex flex-col gap-1">
            <label className="text-[11px] text-muted-foreground">{item.label}</label>
            <input
              type="number"
              inputMode="numeric"
              value={item.val || ""}
              onChange={(e) => onUpdate(item.field, parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
