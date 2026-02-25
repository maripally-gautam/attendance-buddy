import { useEffect, useState, useRef } from "react";

interface ProgressCircleProps {
  percentage: number;
  requiredPercentage: number;
  presentCount: number;
  totalCount: number;
  bunksLeft: number;
  classesNeeded: number;
}

export default function ProgressCircle({
  percentage,
  requiredPercentage,
  presentCount,
  totalCount,
  bunksLeft,
  classesNeeded,
}: ProgressCircleProps) {
  const [displayPct, setDisplayPct] = useState(0);
  const animRef = useRef<number>(0);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayPct / 100) * circumference;

  // Color logic
  let strokeColor = "hsl(142, 71%, 45%)"; // green
  if (percentage < requiredPercentage - 5) {
    strokeColor = "hsl(0, 84%, 60%)"; // red
  } else if (percentage < requiredPercentage) {
    strokeColor = "hsl(45, 93%, 47%)"; // yellow
  }

  useEffect(() => {
    const start = displayPct;
    const end = Math.min(percentage, 100);
    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPct(parseFloat((start + (end - start) * eased).toFixed(2)));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease-out, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">
            {displayPct.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground mt-1">Attendance</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {[
          { label: "Present", value: presentCount },
          { label: "Total", value: totalCount },
          { label: "Bunks Left", value: bunksLeft },
          { label: "Need", value: classesNeeded },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 px-4 py-3 text-center"
          >
            <p className="text-lg font-semibold text-foreground">{item.value}</p>
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
