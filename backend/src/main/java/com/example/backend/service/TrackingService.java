package com.example.backend.service;

import com.example.backend.model.ProductRecord;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TrackingService {
    private final Path filePath;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;

    public TrackingService() {
        this(Path.of("barcodes.csv"));
    }

    public TrackingService(Path filePath) {
        this.filePath = filePath;
    }

    public synchronized void appendRecord(ProductRecord record) throws IOException {
        if (!Files.exists(filePath)) {
            Files.createFile(filePath);
            Files.writeString(filePath, "barcode,duration,timestamp\n", StandardOpenOption.APPEND);
        }
        String line = String.format("%s,%d,%s%n", record.barcode(), record.duration(), formatter.format(record.timestamp()));
        Files.writeString(filePath, line, StandardOpenOption.APPEND);
    }

    public List<String> getAllLines() throws IOException {
        if (!Files.exists(filePath)) {
            return List.of();
        }
        return Files.readAllLines(filePath);
    }

    public Path getFilePath() {
        return filePath;
    }
}
