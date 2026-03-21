import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { useAuthStore } from "../store/auth";

const PRESETS = [
  { id: "TDAH",      label: "TDAH",       desc: "Bullets cortos y timers",     emoji: "⚡" },
  { id: "Dislexia",  label: "Dislexia",   desc: "Frases muy cortas y fuente OpenDyslexic", emoji: "📖" },
  { id: "Combinado", label: "Combinado",  desc: "Todo activado, máxima calma", emoji: "🌿" },
  { id: "Docente",   label: "Docente",    desc: "Múltiples niveles simultáneos", emoji: "🎓" },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preset, setPreset] = useState("TDAH");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      setAuth(res.data.access_token, res.data.user_id);
      navigate("/dashboard");
    } catch {
      setError("Algo salió diferente. ¿Intentamos de nuevo?");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📄</div>
          <h1 className="text-2xl font-semibold text-textMain">DocSimplify</h1>
          <p className="text-textSub mt-1">Crea tu cuenta en 2 pasos</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className={`step-badge ${step >= 1 ? "bg-primary" : "bg-gray-300"}`}>1</div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-200"}`} />
          <div className={`step-badge ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}>2</div>
        </div>

        <div className="card">
          {error && (
            <div className="bg-warning/10 border border-warning/30 text-warning rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-1">Tus datos</h2>
              <p className="text-textSub text-sm mb-5">Solo tomará un momento</p>
              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSub mb-1">Nombre</label>
                  <input className="input" placeholder="¿Cómo te llamamos?" value={name}
                    onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSub mb-1">Correo</label>
                  <input className="input" type="email" placeholder="tu@correo.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSub mb-1">Contraseña</label>
                  <input className="input" type="password" placeholder="Mínimo 6 caracteres" value={password}
                    onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <button type="submit" className="btn-primary w-full mt-2">Continuar →</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-1">¿Cómo lees mejor?</h2>
              <p className="text-textSub text-sm mb-5">
                Elige tu perfil. Puedes cambiarlo cuando quieras.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      preset === p.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/40"
                    }`}
                  >
                    <div className="text-2xl mb-1">{p.emoji}</div>
                    <div className="font-semibold text-sm text-textMain">{p.label}</div>
                    <div className="text-xs text-textSub mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Creando tu cuenta..." : "Empezar →"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="btn-secondary w-full mt-3"
              >
                ← Volver
              </button>
            </>
          )}

          {step === 1 && (
            <p className="text-center text-textSub text-sm mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Entra aquí
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
