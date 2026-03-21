import { useAccessibilityStore } from "../store/accessibility";
import type { SimplifiedResponse } from "../api/endpoints";
import WcagBadge from "./WcagBadge";
import ComprehensionQuiz from "./ComprehensionQuiz";

interface Props {
  result: SimplifiedResponse;
  chatId: string;
}

export default function SimplifiedView({ result, chatId }: Props) {
  const { beelineActive } = useAccessibilityStore();

  // Split text into lines and apply BeeLine colors
  const lines = result.simplified_text.split(/\r?\n/).filter((l) => l.trim());
  // Two strongly contrasting colors so the eye can track each line
  const beelineColors = ["#1d4ed8", "#b45309"]; // blue ↔ amber

  return (
    <div className="space-y-5">
      {/* Simplified text */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-textMain">Texto simplificado</h3>
          <div className="flex items-center gap-2">
            {result.reading_level_used && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                Nivel {result.reading_level_used}
              </span>
            )}
            {result.preset_used && (
              <span className="text-xs bg-success/10 text-green-700 px-2 py-1 rounded-full font-medium">
                {result.preset_used}
              </span>
            )}
          </div>
        </div>

        <ul className="tdah-bullets space-y-1">
          {lines.map((line, i) => {
            const clean = line.replace(/^[-•*]\s*/, "");
            return (
              <li
                key={i}
                style={beelineActive ? {
                  color: beelineColors[i % beelineColors.length],
                  borderLeftColor: beelineColors[i % beelineColors.length],
                  fontWeight: 500,
                } : {}}
                className="leading-relaxed max-w-reading"
              >
                {clean}
              </li>
            );
          })}
        </ul>

        {result.audio_url && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-textSub mb-2">🔊 Escuchar</p>
            <audio controls src={result.audio_url} className="w-full" />
          </div>
        )}
      </div>

      {/* Explanation */}
      <details className="card cursor-pointer group">
        <summary className="flex items-center justify-between font-medium text-textMain list-none">
          <span>💬 ¿Por qué cambié esto?</span>
          <span className="text-textSub text-sm group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <p className="text-textSub mt-3 leading-relaxed text-sm max-w-reading">
          {result.explanation}
        </p>
      </details>

      {/* Comprehension quiz */}
      <ComprehensionQuiz simplifiedText={result.simplified_text} chatId={chatId} />

      {/* WCAG badge */}
      <WcagBadge report={result.wcag_report} />
    </div>
  );
}
