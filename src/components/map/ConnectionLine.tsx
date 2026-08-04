"use client";

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export function ConnectionLine({ x1, y1, x2, y2, color }: ConnectionLineProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={`${color}25`}
      strokeWidth={1.5}
      strokeDasharray="6 4"
      style={{
        filter: `drop-shadow(0 0 4px ${color}15)`,
      }}
    />
  );
}
