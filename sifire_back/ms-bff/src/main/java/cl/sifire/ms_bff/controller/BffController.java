package cl.sifire.ms_bff.controller;

import cl.sifire.ms_bff.service.BffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// controller del bff, el frontend solo habla con estos endpoints
@RestController
@RequestMapping("/bff")
@CrossOrigin(origins = "*")
public class BffController {

    @Autowired
    private BffService bffService;

    // datos para armar el mapa de incendios en el frontend
    @GetMapping("/mapa")
    public ResponseEntity<Map<String, Object>> getMapa() {
        return ResponseEntity.ok(bffService.getDatosMapa());
    }

    // datos para el dashboard general
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(bffService.getDashboard());
    }
}