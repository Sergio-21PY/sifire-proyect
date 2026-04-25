import { useAuth } from '../context/AuthContext';
import { useGestionBrigadistas } from '../hooks/useGestionBrigadistas';
import BrigadistaForm from '../components/brigadistas/BrigadistaForm';
import BrigadistasTabla from '../components/brigadistas/BrigadistasTabla';
import * as styles from '../styles/GestionBrigadistas.styles';

export default function GestionBrigadistas() {
  const { usuario } = useAuth();
  const { brigadistas, form, errors, showForm, exito, loading, loadingData, handleChange, handleSubmit, toggleEstado, setShowForm, setForm, setErrors } = useGestionBrigadistas();

  return (
    <div style={styles.mainContainer}>

      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.headerTitle}>Gestión de Brigadistas</h1>
          <p style={styles.headerSubtitle}>Registrado como: {usuario?.nombre} — {usuario?.rol}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={styles.headerButton}>
          {showForm ? 'Cancelar' : '+ Nuevo Brigadista'}
        </button>
      </div>

      {exito && <div style={styles.successAlert}>✓ Brigadista registrado correctamente.</div>}

      {showForm && (
        <BrigadistaForm
          form={form}
          errors={errors}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancelar={() => { setShowForm(false); setForm({ nombre: '', email: '', telefono: '', password: '' }); setErrors({}); }}
        />
      )}

      <BrigadistasTabla
        brigadistas={brigadistas}
        loadingData={loadingData}
        onToggleEstado={toggleEstado}
      />

    </div>
  );
}