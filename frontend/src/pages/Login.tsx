import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { useAuthStore } from "../store/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setAuth(res.data.access_token, res.data.user_id);
      navigate("/dashboard");
    } catch {
      setError("El correo o la contraseña no coinciden. ¿Intentamos de nuevo?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / titulo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📄</div>
          <h1 className="text-2xl font-semibold text-textMain">DocSimplify</h1>
          <p className="text-textSub mt-1">Tu asistente de lectura</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Bienvenido de vuelta</h2>

          {error && (
            <div className="bg-warning/10 border border-warning/30 text-warning rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSub mb-1">
                Correo electrónico
              </label>
              <input
                className="input"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSub mb-1">
                Contraseña
              </label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-textSub text-sm mt-6">
            ¿Primera vez aquí?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Crea tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
