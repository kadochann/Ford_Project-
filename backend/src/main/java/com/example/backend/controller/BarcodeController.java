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

@RestController
@RequestMapping("/api/barcodes")
@CrossOrigin
public class BarcodeController {
    private final TrackingService service;

    public BarcodeController(TrackingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> addBarcode(@RequestBody ProductRecord record) throws IOException {
        service.appendRecord(record);
        return ResponseEntity.status(201).build();
    }

    @GetMapping(produces = "text/csv")
    public ResponseEntity<Resource> downloadCsv() throws IOException {
        Path file = service.getFilePath();
        if (!Files.exists(file)) {
            return ResponseEntity.noContent().build();
        }
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(file));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFileName())
                .contentLength(resource.contentLength())
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @GetMapping("/list")
    public List<String> listLines() throws IOException {
        return service.getAllLines();
    }
}
