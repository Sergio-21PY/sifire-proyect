import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/404.css";

// Tiempo para redirigir al inicio (en segundos)
const SECONDS = 15;

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(SECONDS);

  useEffect(() => {
    if (count <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  const path = window.location.pathname;

  return (
    <div className="nf-root">
      <div className="nf-box">

        {/* Llama */}
        <div className="nf-fire" aria-hidden="true">
          <div className="flame flame-back" />
          <div className="flame flame-mid" />
          <div className="flame flame-front" />
          <div className="flame flame-core" />
          <div className="ember ember-1" />
          <div className="ember ember-2" />
          <div className="ember ember-3" />
          <div className="ember ember-4" />
        </div>

        <div className="nf-code" aria-label="Error 404">404</div>
        <h1 className="nf-title">Página no encontrada</h1>
        <p className="nf-desc">
          La ruta que ingresaste se incendió. Puede que haya sido
          movida, eliminada, o simplemente escribiste mal la URL.
        </p>

        <div className="nf-divider" />

        <div className="nf-meta">
          <div className="nf-meta-row">
            <span className="nf-meta-key">ruta</span>
            <span className="nf-meta-val">{path}</span>
          </div>
          <div className="nf-meta-row">
            <span className="nf-meta-key">estado</span>
            <span className="nf-meta-val">404 Not Found</span>
          </div>
          <div className="nf-meta-row">
            <span className="nf-meta-key">sistema</span>
            <span className="nf-meta-val">SIFIRE — frontend</span>
          </div>
        </div>

        <div className="nf-progress-wrap">
          <div className="nf-progress-label">
            <span>redirigiendo al inicio</span>
            <span>{count}s</span>
          </div>
          <div className="nf-progress-track">
            <div
              className="nf-progress-bar"
              style={{ width: `\${(count / SECONDS) * 100}%` }}
            />
          </div>
        </div>

        <div className="nf-actions">
          <button className="nf-btn nf-btn-primary" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
          <button className="nf-btn nf-btn-ghost" onClick={() => navigate(-1)}>
            Página anterior
          </button>
        </div>

      </div>
    </div>
  );
}