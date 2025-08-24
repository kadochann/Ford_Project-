package com.example.backend.service;

import com.example.backend.model.ProductRecord;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
        try {
            if (!Files.exists(filePath)) {
                Files.createFile(filePath);
            }
            
            // Eğer dosya boşsa başlığı yaz
            if (Files.size(filePath) == 0) {
                String header = "Barkod,Süre (sn),Zaman Damgası\n";
                Files.write(filePath, header.getBytes(StandardCharsets.UTF_8), StandardOpenOption.WRITE);
            }
            
            // CSV satırını oluştur - Türkçe başlıklar ve daha okunabilir format
            String line = String.format("\"%s\",%d,\"%s\"\n", 
                record.barcode(), 
                record.duration(), 
                formatter.format(record.timestamp())
            );
            
            Files.write(filePath, line.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
            
        } catch (IOException e) {
            throw new IOException("Barkod kaydedilemedi: " + e.getMessage(), e);
        }
    }

    public List<String> getAllLines() throws IOException {
        if (!Files.exists(filePath)) {
            return List.of();
        }
        return Files.readAllLines(filePath, StandardCharsets.UTF_8);
    }

    public Path getFilePath() {
        return filePath;
    }

    public Map<String, Object> getDailyStats() throws IOException {
        List<String> lines = getAllLines();
        if (lines.size() <= 1) { // Sadece başlık varsa
            return Map.of(
                "totalProducts", 0,
                "averageDuration", 0.0,
                "optimalTimeCount", 0,
                "overTimeCount", 0,
                "todayDate", LocalDate.now().toString()
            );
        }

        // CSV başlığını atla
        List<String> dataLines = lines.subList(1, lines.size());
        
        int totalProducts = dataLines.size();
        List<Long> durations = new ArrayList<>();
        int optimalTimeCount = 0;
        int overTimeCount = 0;
        final int OPTIMAL_TIME = 135; // saniye

        for (String line : dataLines) {
            try {
                // CSV parsing - tırnak işaretlerini kaldır ve virgülle böl
                String cleanLine = line.replaceAll("\"", "");
                String[] parts = cleanLine.split(",");
                if (parts.length >= 2) {
                    long duration = Long.parseLong(parts[1]);
                    durations.add(duration);
                    
                    if (duration <= OPTIMAL_TIME) {
                        optimalTimeCount++;
                    } else {
                        overTimeCount++;
                    }
                }
            } catch (NumberFormatException e) {
                // Geçersiz satırları atla
                continue;
            }
        }

        double averageDuration = durations.isEmpty() ? 0.0 : 
            durations.stream().mapToLong(Long::longValue).average().orElse(0.0);

        return Map.of(
            "totalProducts", totalProducts,
            "averageDuration", Math.round(averageDuration * 100.0) / 100.0,
            "optimalTimeCount", optimalTimeCount,
            "overTimeCount", overTimeCount,
            "todayDate", LocalDate.now().toString()
        );
    }

    // CSV dosyasını yeniden oluştur (mevcut verileri koruyarak)
    public synchronized void recreateCsvFile() throws IOException {
        List<String> lines = getAllLines();
        if (lines.size() <= 1) return; // Sadece başlık varsa işlem yapma
        
        // Mevcut verileri geçici olarak sakla
        List<String> dataLines = lines.subList(1, lines.size());
        
        // Dosyayı temizle ve yeni başlık yaz
        String header = "Barkod,Süre (sn),Zaman Damgası\n";
        Files.write(filePath, header.getBytes(StandardCharsets.UTF_8), StandardOpenOption.WRITE);
        
        // Verileri yeni formatta yaz
        for (String line : dataLines) {
            try {
                String cleanLine = line.replaceAll("\"", "");
                String[] parts = cleanLine.split(",");
                if (parts.length >= 3) {
                    String barcode = parts[0];
                    String duration = parts[1];
                    String timestamp = parts[2];
                    
                    String newLine = String.format("\"%s\",%s,\"%s\"\n", barcode, duration, timestamp);
                    Files.write(filePath, newLine.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
                }
            } catch (Exception e) {
                // Hatalı satırları atla
                continue;
            }
        }
    }
}
