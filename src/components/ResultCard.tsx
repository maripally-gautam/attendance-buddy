import { CalculationResult } from "@/hooks/useAttendance";

interface ResultCardProps {
  result: CalculationResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="glass-card p-4 space-y-3 animate-fade-in">
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        📊 Current Status
      </h2>
      <p className="text-center text-2xl font-bold text-foreground">
        {result.currentPercentage.toFixed(2)}%
      </p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-muted-foreground text-[11px]">Classes Needed</p>
          <p className="font-semibold text-foreground">{result.classesNeeded} classes</p>
          <p className="text-muted-foreground text-[11px]">{result.classesNeededDays} days · {result.classesNeededWeeks} weeks</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-muted-foreground text-[11px]">Bunks Left</p>
          <p className="font-semibold text-foreground">{result.bunksLeft} classes</p>
          <p className="text-muted-foreground text-[11px]">{result.bunksLeftDays} days · {result.bunksLeftWeeks} weeks</p>
        </div>
      </div>
    </div>
  );
}
