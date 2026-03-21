import { useState } from "react";
import type { SimplifiedResponse } from "../api/endpoints";
import SimplifiedView from "./SimplifiedView";

interface Props {
  results: SimplifiedResponse[];
}

const LEVEL_LABELS = ["A1 — Muy simple", "A2 — Simple", "B1 — Intermedio"];
const LEVEL_DESC = [
  "Frases cortas, vocabulario básico",
  "Frases breves, vocabulario familiar",
  "Frases moderadas, más contexto",
];

export default function VersionTabs({ results }: Props) {
  const [active, setActive] = useState(0);

  const handleDownload = () => {
    const content = results
      .map((r, i) => `=== ${LEVEL_LABELS[i]} ===\n\n${r.simplified_text}`)
      .join("\n\n\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "versiones-simplificadas.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-textMain">3 versiones generadas</h2>
          <p className="text-xs text-textSub mt-0.5">Selecciona el nivel para ver cada versión</p>
        </div>
        <button
          onClick={handleDownload}
          className="btn-secondary text-xs py-2 px-3"
        >
          ⬇️ Descargar todas
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {LEVEL_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
              active === i
                ? "bg-primary text-white shadow-sm"
                : "bg-surface text-textSub hover:bg-gray-200"
            }`}
          >
            <div>{label.split(" — ")[0]}</div>
            <div className={`text-xs font-normal mt-0.5 ${active === i ? "text-white/80" : "text-textSub"}`}>
              {LEVEL_DESC[i]}
            </div>
          </button>
        ))}
      </div>

      {/* Active version */}
      {results[active] && (
        <SimplifiedView result={results[active]} chatId="" />
      )}
    </div>
  );
}
