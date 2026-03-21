import { useEffect, useRef, useState } from "react";

const TOTAL = 18 * 60; // 18 minutes in seconds

type Phase = "idle" | "running" | "paused" | "done";

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [remaining, setRemaining] = useState(TOTAL);
  const [minimized, setMinimized] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = (remaining / TOTAL) * 100;
  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");

  // SVG circle params
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  useEffect(() => {
    if (phase === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setPhase("done");
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  const start  = () => setPhase("running");
  const pause  = () => setPhase("paused");
  const reset  = () => { setPhase("idle"); setRemaining(TOTAL); };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-20 right-4 z-50 bg-white shadow-lg border border-gray-200
                   rounded-2xl px-3 py-2 flex items-center gap-2 text-sm font-medium text-textMain"
      >
        <span className={phase === "running" ? "animate-pulse" : ""}>⏱️</span>
        <span>{minutes}:{seconds}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-white shadow-lg border border-gray-200
                    rounded-2xl p-4 w-44">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-textSub uppercase tracking-wide">
          🍅 Foco
        </span>
        <button
          onClick={() => setMinimized(true)}
          className="text-textSub hover:text-textMain text-sm"
        >
          —
        </button>
      </div>

      {/* Circle timer */}
      <div className="flex justify-center mb-3">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
            {/* Track */}
            <circle
              cx="36" cy="36" r={radius}
              fill="none" stroke="#EEEAE3" strokeWidth="5"
            />
            {/* Progress */}
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke={phase === "done" ? "#7EC8A4" : "#5B8DEF"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-textMain tabular-nums">
              {phase === "done" ? "✓" : `${minutes}:${seconds}`}
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {phase === "done" ? (
        <p className="text-center text-xs text-success font-medium mb-3">
          ¡Buen trabajo! Tómate 5 minutos 🌿
        </p>
      ) : (
        <p className="text-center text-xs text-textSub mb-3">
          {phase === "idle"   && "18 min de lectura enfocada"}
          {phase === "running" && "Estás haciendo genial 👍"}
          {phase === "paused" && "En pausa — cuando quieras"}
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {phase === "idle" && (
          <button onClick={start} className="btn-primary w-full text-xs py-2">
            Iniciar
          </button>
        )}
        {phase === "running" && (
          <button onClick={pause} className="btn-secondary w-full text-xs py-2">
            Pausar
          </button>
        )}
        {phase === "paused" && (
          <>
            <button onClick={start} className="btn-primary flex-1 text-xs py-2">Continuar</button>
            <button onClick={reset} className="btn-secondary flex-1 text-xs py-2">Reiniciar</button>
          </>
        )}
        {phase === "done" && (
          <button onClick={reset} className="btn-primary w-full text-xs py-2">
            Nuevo ciclo
          </button>
        )}
      </div>
    </div>
  );
}
