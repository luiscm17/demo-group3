import { useAccessibilityStore } from "../store/accessibility";

export default function AccessibilityBar() {
  const { dyslexicFont, fontSize, beelineActive, toggleDyslexicFont, setFontSize, toggleBeeline } =
    useAccessibilityStore();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white shadow-lg border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-3">
        {/* Font size */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFontSize("normal")}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              fontSize === "normal" ? "bg-primary text-white" : "text-textSub hover:bg-surface"
            }`}
          >
            Aa
          </button>
          <button
            onClick={() => setFontSize("large")}
            className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
              fontSize === "large" ? "bg-primary text-white" : "text-textSub hover:bg-surface"
            }`}
          >
            Aa
          </button>
          <button
            onClick={() => setFontSize("xlarge")}
            className={`px-2 py-1 rounded-lg text-base font-medium transition-colors ${
              fontSize === "xlarge" ? "bg-primary text-white" : "text-textSub hover:bg-surface"
            }`}
          >
            Aa
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* OpenDyslexic toggle */}
        <button
          onClick={toggleDyslexicFont}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            dyslexicFont ? "bg-primary text-white" : "text-textSub hover:bg-surface"
          }`}
          title="Fuente OpenDyslexic"
        >
          🔤 Dyslexic
        </button>

        <div className="w-px h-6 bg-gray-200" />

        {/* BeeLine toggle */}
        <button
          onClick={toggleBeeline}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            beelineActive ? "bg-success text-white" : "text-textSub hover:bg-surface"
          }`}
          title="BeeLine — colores por línea"
        >
          🌈 BeeLine
        </button>
      </div>
    </div>
  );
}
