package cl.sifire.alertas.dto;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests para UsuarioDTO.
 * Cubre: constructor vacío, getter/setter, equals, hashCode, toString.
 * Ubicar en: src/test/java/cl/sifire/alertas/dto/UsuarioDTOTest.java
 */
class UsuarioDTOTest {

    @Test
    void constructorVacio_DebeCrearInstanciaConIdNull() {
        UsuarioDTO dto = new UsuarioDTO();
        assertNull(dto.getId());
    }

    @Test
    void setter_DebeAsignarId() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(42L);
        assertEquals(42L, dto.getId());
    }

    @Test
    void getter_DespuesDeSetId_DebeRetornarMismoValor() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(100L);
        assertEquals(100L, dto.getId());
    }

    @Test
    void equals_DosDTOsConMismoId_DebenSerIguales() {
        UsuarioDTO dto1 = new UsuarioDTO();
        dto1.setId(1L);
        UsuarioDTO dto2 = new UsuarioDTO();
        dto2.setId(1L);
        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void equals_DosDTOsConDistintoId_NoDbenSerIguales() {
        UsuarioDTO dto1 = new UsuarioDTO();
        dto1.setId(1L);
        UsuarioDTO dto2 = new UsuarioDTO();
        dto2.setId(2L);
        assertNotEquals(dto1, dto2);
    }

    @Test
    void equals_ConMismaInstancia_DebeRetornarTrue() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(5L);
        assertEquals(dto, dto);
    }

    @Test
    void equals_ConNull_DebeRetornarFalse() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(5L);
        assertNotEquals(null, dto);
    }

    @Test
    void hashCode_ConIdNull_NoDebebLanzarExcepcion() {
        UsuarioDTO dto = new UsuarioDTO();
        assertDoesNotThrow(() -> dto.hashCode());
    }

    @Test
    void toString_DebeContenerElId() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(7L);
        String result = dto.toString();
        assertNotNull(result);
        assertTrue(result.contains("7"));
    }

    @Test
    void idCero_DebeSerDistintoDe_idNull() {
        UsuarioDTO dto1 = new UsuarioDTO();
        dto1.setId(0L);
        UsuarioDTO dto2 = new UsuarioDTO();
        dto2.setId(null);
        assertNotEquals(dto1, dto2);
    }
}
