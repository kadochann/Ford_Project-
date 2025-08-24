package com.example.backend.controller;

import com.example.backend.model.ProductRecord;
import com.example.backend.service.TrackingService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/barcodes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BarcodeController {
    private final TrackingService service;

    public BarcodeController(TrackingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> addBarcode(@RequestBody ProductRecord record) {
        try {
            // Validasyon
            if (record.barcode() == null || record.barcode().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Barkod boş olamaz"));
            }
            
            if (record.duration() < 0) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Süre negatif olamaz"));
            }

            service.appendRecord(record);
            return ResponseEntity.ok(Map.of("message", "Barkod başarıyla kaydedildi"));
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Veri kaydedilemedi: " + e.getMessage()));
        }
    }

    @GetMapping(produces = "text/csv")
    public ResponseEntity<Resource> downloadCsv() throws IOException {
        Path file = service.getFilePath();
        if (!Files.exists(file)) {
            return ResponseEntity.noContent().build();
        }
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(file));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ford_barcodes.csv")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=utf-8")
                .contentLength(resource.contentLength())
                .body(resource);
    }

    @GetMapping("/list")
    public ResponseEntity<List<String>> listLines() {
        try {
            List<String> lines = service.getAllLines();
            return ResponseEntity.ok(lines);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDailyStats() {
        try {
            Map<String, Object> stats = service.getDailyStats();
            return ResponseEntity.ok(stats);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "İstatistikler alınamadı"));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getTotalCount() {
        try {
            List<String> lines = service.getAllLines();
            int count = Math.max(0, lines.size() - 1); // CSV başlığı hariç
            return ResponseEntity.ok(Map.of("totalCount", count));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/recreate-csv")
    public ResponseEntity<Map<String, String>> recreateCsvFile() {
        try {
            service.recreateCsvFile();
            return ResponseEntity.ok(Map.of("message", "CSV dosyası yeniden oluşturuldu"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "CSV dosyası yeniden oluşturulamadı: " + e.getMessage()));
        }
    }
}
