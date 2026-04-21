import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../lib/api";

const C = {
  bg: "#0F0F0F",
  card: "#161616",
  border: "#242424",
  text: "#F2F2F2",
  muted: "#8C8C8C",
  primary: "#00E094",
  danger: "#FF4D4D"
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const LDP_LOGO_URL = "https://framerusercontent.com/images/BPdPf6k8BgiSiBdZLnUfu46NeKY.png";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      const { token, user } = response.data;

      setAuth(token, user);

      navigate("/");

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al conectar con el servidor";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Nunito Sans', sans-serif"
    }}>
      <div style={{
        background: C.card, padding: 40, borderRadius: 12,
        border: `1px solid ${C.border}`, width: "100%", maxWidth: 400
      }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src={LDP_LOGO_URL}
            alt="LDP Logo"
            style={{ width: "auto", height: "clamp(30px, 6vw, 50px)", marginBottom: 16 }}
            referrerPolicy="no-referrer"
          />
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
            Ingresa tus credenciales para acceder al panel
          </p>
        </div>
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#8C8C8C" }}>
          ¿No tienes una cuenta?{" "}
          <Link to="/register" style={{ color: "#00E094", fontWeight: 700, textDecoration: "none" }}>
            Regístrate acá
          </Link>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 77, 77, 0.1)", border: `1px solid ${C.danger}`,
            color: C.danger, padding: "10px 16px", borderRadius: 6,
            fontSize: 13, marginBottom: 20, textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 8 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 16px", background: "#1C1C1C",
                border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 8 }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 16px", background: "#1C1C1C",
                border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%", padding: "14px", background: C.primary, color: "#0F0F0F",
              borderRadius: 8, fontWeight: 800, fontSize: 15, border: "none",
              cursor: isLoading ? "wait" : "pointer", opacity: isLoading ? 0.7 : 1,
              marginTop: 8
            }}
          >
            {isLoading ? "Validando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}