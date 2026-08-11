import type { ReactNode } from "react";

type MeshGradientProps = {
  tone: [string, string];
  className?: string;
  animate?: boolean;
  children?: ReactNode;
};

export default function MeshGradient({
  tone,
  className = "",
  animate = false,
  children,
}: MeshGradientProps) {
  const [a, b] = tone;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(155deg, ${a} 0%, ${b} 55%, ${a} 100%)`,
      }}
    >
      <div
        className={`absolute -top-1/3 -left-1/4 h-2/3 w-2/3 rounded-full opacity-40 blur-3xl ${
          animate ? "animate-[pulse_10s_ease-in-out_infinite]" : ""
        }`}
        style={{ background: b }}
      />
      <div
        className={`absolute -bottom-1/3 -right-1/4 h-2/3 w-2/3 rounded-full opacity-30 blur-3xl ${
          animate ? "animate-[pulse_12s_ease-in-out_infinite]" : ""
        }`}
        style={{ background: a }}
      />
      <div className="grain-overlay" />
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}
