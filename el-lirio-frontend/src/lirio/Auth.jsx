import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiCheck } from "react-icons/fi";
import { Logo, Flower, ErrorBox, ThemeToggle } from "./UI";
import { useStore } from "./StoreContext";
import { api } from "./api";

export default function Auth({ mode = "login" }) {
  const { signIn, demoAccounts } = useStore(),
    navigate = useNavigate(),
    location = useLocation(),
    [params] = useSearchParams();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const register = mode === "register",
    recover = mode === "recover",
    reset = mode === "reset";
  const title = register
    ? "Un lugar para ti."
    : recover
      ? "Volvamos a conectar."
      : reset
        ? "Un nuevo comienzo."
        : "Qué bueno verte.";
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (recover || reset) {
        const result = await api("/auth/" + (recover ? "recover" : "reset"), {
          method: "POST",
          body: recover
            ? { email }
            : { token: params.get("token") || "", password },
        });
        setMessage(result.message);
        return;
      }
      const result = await api("/auth/" + (register ? "register" : "login"), {
        method: "POST",
        body: register ? { ...fields, email, password } : { email, password },
      });
      signIn(result);
      const next = location.state?.from;
      navigate(
        next?.startsWith("/") && !next.startsWith("//")
          ? next
          : result.user.rol === "ADMIN"
            ? "/admin"
            : "/",
        { replace: true },
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-shell">
      <div className="auth-story">
        <Logo />
        <div>
          <span className="eyebrow">BIENVENIDO A EL LIRIO</span>
          <h1>
            Las cosas buenas
            <br />
            empiezan <em>en casa.</em>
          </h1>
          <p>
            Tu despensa, tus favoritos
            <br />y una tienda que te conoce.
          </p>
          <Flower className="auth-flower" />
        </div>
        <Link className="text-link" to="/">
          ← Volver a la tienda
        </Link>
      </div>
      <div className="auth-main">
        <div className="auth-theme"><ThemeToggle /></div>
        <div className="auth-card">
          <span className="auth-lock">
            <FiLock />
          </span>
          <h2>{title}</h2>
          <p className="muted">
            {register
              ? "Crea tu cuenta y simplifica tu próxima compra."
              : recover
                ? "Te enviaremos un enlace para recuperar tu cuenta."
                : reset
                  ? "Elige una contraseña de al menos 8 caracteres."
                  : "Entra a tu cuenta y sigue donde lo dejaste."}
          </p>
          {message ? (
            <div className="auth-success">
              <FiCheck />
              <p>{message}</p>
              <Link className="btn primary" to="/login">
                Ir a iniciar sesión <FiArrowRight />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} key={mode}>
              {register && (
                <div className="form-grid">
                  <label>
                    Nombre
                    <input
                      required
                      name="nombre"
                      autoComplete="given-name"
                      maxLength="100"
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label>
                    Apellido
                    <input
                      required
                      name="apellido"
                      autoComplete="family-name"
                      maxLength="100"
                      placeholder="Tu apellido"
                    />
                  </label>
                </div>
              )}
              {!reset && (
                <label>
                  Correo electrónico
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength="150"
                    placeholder="hola@ejemplo.com"
                  />
                </label>
              )}
              {!recover && (
                <label>
                  Contraseña
                  <div className="password-input">
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={register || reset ? 8 : 1}
                      maxLength="72"
                      required
                      autoComplete={
                        register || reset ? "new-password" : "current-password"
                      }
                      placeholder={
                        register || reset
                          ? "Al menos 8 caracteres"
                          : "Tu contraseña"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      aria-label={
                        show ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                    >
                      {show ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </label>
              )}
              {register && (
                <label>
                  Teléfono <span className="muted">(opcional)</span>
                  <input
                    type="tel"
                    name="telefono"
                    autoComplete="tel"
                    pattern="[0-9+ ()-]{7,20}"
                    placeholder="9XX XXX XXX"
                  />
                </label>
              )}
              {!register && !recover && !reset && (
                <Link className="auth-forgot" to="/recuperar">
                  ¿Olvidaste tu contraseña?
                </Link>
              )}
              {error && <ErrorBox message={error} />}
              <button className="btn primary full" disabled={busy}>
                {busy
                  ? "Un momento…"
                  : register
                    ? "Crear mi cuenta"
                    : recover
                      ? "Enviar enlace"
                      : reset
                        ? "Guardar contraseña"
                        : "Entrar a mi cuenta"}{" "}
                <FiArrowRight />
              </button>
            </form>
          )}
          {!recover && !reset && (
            <p className="auth-switch">
              {register ? "¿Ya tienes una cuenta?" : "¿Es tu primera visita?"}{" "}
              <Link
                to={register ? "/login" : "/registro"}
                state={location.state}
              >
                {register ? "Inicia sesión" : "Crea tu cuenta"}
              </Link>
            </p>
          )}
          {(recover || reset) && (
            <Link className="text-link" to="/login">
              Volver a iniciar sesión
            </Link>
          )}
          {demoAccounts && mode === "login" && (
            <div className="demo-accounts">
              <span className="eyebrow">PRUEBA LA EXPERIENCIA</span>
              <p>Cuentas de demostración local</p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("cliente@lirio.local");
                    setPassword("ClienteDemo2026!");
                  }}
                >
                  Como cliente <FiArrowRight />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@lirio.local");
                    setPassword("LirioDemo2026!");
                  }}
                >
                  Como administrador <FiArrowRight />
                </button>
              </div>
              <small>
                Solo datos de ejemplo. La contraseña se completa al elegir.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
