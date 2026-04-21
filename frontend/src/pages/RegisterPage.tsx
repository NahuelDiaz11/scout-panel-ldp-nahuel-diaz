import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";

const C = {
    bg: "#0F0F0F",
    card: "#161616",
    surface: "#1C1C1C",
    border: "#242424",
    text: "#F2F2F2",
    muted: "#8C8C8C",
    primary: "#00E094",
    danger: "#E84040"
};

const LDP_LOGO_URL = "https://framerusercontent.com/images/BPdPf6k8BgiSiBdZLnUfu46NeKY.png";

export function RegisterPage() {
    const navigate = useNavigate();
    // const setAuth = useAuthStore((state) => state.setAuth); 

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    // 👇 1. Nuevo estado para el mensaje de éxito
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Ocurrió un error al registrar la cuenta.");
            }

            if (data.token) {

                setSuccessMsg("¡Cuenta creada con éxito! Ingresando al panel...");

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false); 
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: C.bg,
            fontFamily: "'Nunito Sans', sans-serif",
            position: "relative",
            overflow: "hidden"
        }}>
            <div style={{
                position: "absolute",
                top: "20%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600,
                height: 600,
                background: "radial-gradient(circle, rgba(0, 224, 148, 0.08) 0%, transparent 60%)",
                pointerEvents: "none"
            }} />

            <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "40px 32px",
                width: "100%",
                maxWidth: 420,
                zIndex: 1,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}>

                <style>{`
                    .ldp-auth-input {
                        width: 100%;
                        background: ${C.surface};
                        border: 1px solid ${C.border};
                        color: ${C.text};
                        border-radius: 8px;
                        padding: 14px 16px 14px 44px;
                        font-size: 14px;
                        font-family: 'Nunito Sans', sans-serif;
                        outline: none;
                        transition: all 0.2s ease;
                    }
                    .ldp-auth-input::placeholder {
                        color: ${C.muted};
                    }
                    .ldp-auth-input:focus {
                        border-color: ${C.primary};
                        box-shadow: 0 0 0 3px rgba(0, 224, 148, 0.15);
                    }
                `}</style>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        border: `2px solid ${C.primary}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "black", overflow: "hidden"
                    }}>
                        <img src={LDP_LOGO_URL} alt="LDP Logo" style={{ width: "80%", height: "auto" }} />
                    </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, margin: "0 0 8px 0" }}>
                        Crear una cuenta
                    </h1>
                    <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
                        Únete a LDP Scout Panel para analizar jugadores.
                    </p>
                </div>

                {/* ── MENSAJE DE ERROR ── */}
                {error && (
                    <div style={{
                        background: "rgba(232, 64, 64, 0.1)",
                        border: `1px solid rgba(232, 64, 64, 0.3)`,
                        color: C.danger,
                        padding: "12px 16px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 20,
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                {/* MENSAJE DE ÉXITO  */}
                {successMsg && (
                    <div style={{
                        background: "rgba(0, 224, 148, 0.1)",
                        border: `1px solid rgba(0, 224, 148, 0.3)`,
                        color: C.primary,
                        padding: "12px 16px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        animation: "fadeIn 0.3s ease"
                    }}>
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    <div style={{ position: "relative" }}>
                        <User size={18} color={C.muted} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            type="text"
                            name="name"
                            className="ldp-auth-input"
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={!!successMsg} // Bloqueamos el input si ya fue un éxito
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Mail size={18} color={C.muted} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            type="email"
                            name="email"
                            className="ldp-auth-input"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={!!successMsg}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Lock size={18} color={C.muted} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            type="password"
                            name="password"
                            className="ldp-auth-input"
                            placeholder="Contraseña (min. 6 caracteres)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            disabled={!!successMsg}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !!successMsg}
                        style={{
                            marginTop: 8,
                            width: "100%",
                            padding: "14px",
                            background: successMsg ? "transparent" : C.primary,
                            color: successMsg ? C.primary : "#0F0F0F",
                            border: `1px solid ${successMsg ? C.primary : "transparent"}`,
                            borderRadius: 8,
                            fontSize: 15,
                            fontWeight: 800,
                            cursor: (isLoading || successMsg) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "all 0.2s",
                            opacity: isLoading && !successMsg ? 0.7 : 1,
                        }}
                    >
                        {isLoading && !successMsg ? "Creando cuenta..." : successMsg ? "Redirigiendo..." : (
                            <>
                                Registrarse <ArrowRight size={18} strokeWidth={2.5} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24, fontSize: 12, color: C.muted }}>
                    <ShieldCheck size={14} color={C.primary} />
                    Tus datos están protegidos y encriptados.
                </div>

                <div style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: C.muted }}>
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" style={{ color: C.primary, fontWeight: 700, textDecoration: "none" }}>
                        Inicia sesión acá
                    </Link>
                </div>

            </div>
        </div>
    );
}