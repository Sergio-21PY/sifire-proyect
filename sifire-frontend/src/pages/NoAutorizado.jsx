import { useNavigate } from 'react-router-dom';

export default function NoAutorizado() {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>🚫</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Acceso no autorizado</h1>
            <p style={{ color: '#64748b' }}>No tienes permisos para ver esta página.</p>
            <button onClick={() => navigate(-1)}
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Volver
            </button>
        </div>
    );
}