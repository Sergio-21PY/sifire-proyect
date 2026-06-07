package cl.sifire.alertas.model;


import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests para la entidad Alerta.
 * Cubre: constructores, getters/setters, @PrePersist, enums.
 * Ubicar en: src/test/java/cl/sifire/alertas/model/AlertaTest.java
 */
class AlertaTest {

    // ── Constructor vacío ───────────────────────────────────────────────────
    @Test
    void constructorVacio_DebeCrearInstanciaVacia() {
        Alerta a = new Alerta();
        assertNull(a.getId());
        assertNull(a.getEstado());
        assertNotNull(a.getUsuariosAsignadosIds()); // El Set se inicializa en el campo
    }

    // ── Constructor completo (AllArgsConstructor de Lombok) ─────────────────
    @Test
    void constructorCompleto_DebeAsignarTodosLosCampos() {
        Set<Long> usuarios = new HashSet<>();
        usuarios.add(10L);
        LocalDateTime now = LocalDateTime.now();

        Alerta a = new Alerta(
            1L, 2L, "Título", "Mensaje",
            Alerta.Canal.EMAIL,
            "BRIGADISTA", "Descripción",
            -33.0, -70.0,
            Alerta.Estado.PENDIENTE,
            5L, usuarios,
            now, null
        );

        assertEquals(1L, a.getId());
        assertEquals(2L, a.getReporteId());
        assertEquals("Título", a.getTitulo());
        assertEquals("Mensaje", a.getMensaje());
        assertEquals(Alerta.Canal.EMAIL, a.getCanal());
        assertEquals("BRIGADISTA", a.getTipo());
        assertEquals("Descripción", a.getDescripcion());
        assertEquals(-33.0, a.getLatitud());
        assertEquals(-70.0, a.getLongitud());
        assertEquals(Alerta.Estado.PENDIENTE, a.getEstado());
        assertEquals(5L, a.getBrigadistaId());
        assertEquals(usuarios, a.getUsuariosAsignadosIds());
        assertEquals(now, a.getCreatedAt());
        assertNull(a.getResolvedAt());
    }

    // ── Setters/Getters ─────────────────────────────────────────────────────
    @Test
    void settersYGetters_DebenFuncionar() {
        Alerta a = new Alerta();
        a.setId(99L);
        a.setReporteId(7L);
        a.setTitulo("Test");
        a.setMensaje("Mensaje test");
        a.setCanal(Alerta.Canal.SMS);
        a.setTipo("CIUDADANO");
        a.setDescripcion("Desc");
        a.setLatitud(10.5);
        a.setLongitud(20.5);
        a.setEstado(Alerta.Estado.ENVIADA);
        a.setBrigadistaId(3L);
        a.getUsuariosAsignadosIds().add(3L);
        LocalDateTime resolved = LocalDateTime.now();
        a.setResolvedAt(resolved);

        assertEquals(99L, a.getId());
        assertEquals(7L, a.getReporteId());
        assertEquals("Test", a.getTitulo());
        assertEquals("Mensaje test", a.getMensaje());
        assertEquals(Alerta.Canal.SMS, a.getCanal());
        assertEquals("CIUDADANO", a.getTipo());
        assertEquals("Desc", a.getDescripcion());
        assertEquals(10.5, a.getLatitud());
        assertEquals(20.5, a.getLongitud());
        assertEquals(Alerta.Estado.ENVIADA, a.getEstado());
        assertEquals(3L, a.getBrigadistaId());
        assertTrue(a.getUsuariosAsignadosIds().contains(3L));
        assertEquals(resolved, a.getResolvedAt());
    }

    // ── @PrePersist: asigna PENDIENTE si estado es null ─────────────────────
    @Test
    void prePersist_CuandoEstadoEsNull_DebeAsignarPendiente() {
        Alerta a = new Alerta();
        assertNull(a.getEstado());
        a.prePersist();
        assertEquals(Alerta.Estado.PENDIENTE, a.getEstado());
        assertNotNull(a.getCreatedAt()); // se fija createdAt
    }

    @Test
    void prePersist_CuandoEstadoYaExiste_NoDebeSobrescribir() {
        Alerta a = new Alerta();
        a.setEstado(Alerta.Estado.ENVIADA);
        a.prePersist();
        assertEquals(Alerta.Estado.ENVIADA, a.getEstado()); // no sobrescribir
        assertNotNull(a.getCreatedAt());
    }

    // ── Todos los valores de Canal ───────────────────────────────────────────
    @Test
    void canal_TodosLosValores_DebenEstarDefinidos() {
        assertEquals("EMAIL", Alerta.Canal.EMAIL.name());
        assertEquals("SMS", Alerta.Canal.SMS.name());
        assertEquals("PUSH", Alerta.Canal.PUSH.name());
        assertEquals(3, Alerta.Canal.values().length);
    }

    // ── Todos los valores de Estado ──────────────────────────────────────────
    @Test
    void estado_TodosLosValores_DebenEstarDefinidos() {
        assertEquals("ENVIADA",   Alerta.Estado.ENVIADA.name());
        assertEquals("FALLIDA",   Alerta.Estado.FALLIDA.name());
        assertEquals("PENDIENTE", Alerta.Estado.PENDIENTE.name());
        assertEquals("ASIGNADA",  Alerta.Estado.ASIGNADA.name());
        assertEquals("RESUELTA",  Alerta.Estado.RESUELTA.name());
        assertEquals(5, Alerta.Estado.values().length);
    }

    // ── equals / hashCode (Lombok @Data) ────────────────────────────────────
    @Test
    void dosAlertasConMismoId_DebenSerIguales() {
        Alerta a1 = new Alerta();
        a1.setId(1L);
        a1.setTitulo("X");

        Alerta a2 = new Alerta();
        a2.setId(1L);
        a2.setTitulo("X");

        assertEquals(a1, a2);
        assertEquals(a1.hashCode(), a2.hashCode());
    }

    @Test
    void dosAlertasConDistintoId_NoDbenSerIguales() {
        Alerta a1 = new Alerta();
        a1.setId(1L);
        Alerta a2 = new Alerta();
        a2.setId(2L);
        assertNotEquals(a1, a2);
    }

    // ── toString no lanza excepción ──────────────────────────────────────────
    @Test
    void toString_NoDebeLanzarExcepcion() {
        Alerta a = new Alerta();
        a.setId(1L);
        a.setTitulo("Test toString");
        assertDoesNotThrow(() -> a.toString());
        assertTrue(a.toString().contains("Test toString"));
    }
}

