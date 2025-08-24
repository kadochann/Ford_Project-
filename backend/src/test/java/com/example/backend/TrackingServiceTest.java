package com.example.backend;

import com.example.backend.model.ProductRecord;
import com.example.backend.service.TrackingService;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TrackingServiceTest {

    @Test
    void appendsRecordsToCsv() throws IOException {
        Path temp = Files.createTempFile("records", ".csv");
        TrackingService service = new TrackingService(temp);
        ProductRecord record = new ProductRecord("ABC", 123L, Instant.parse("2024-01-01T00:00:00Z"));
        service.appendRecord(record);
        List<String> lines = Files.readAllLines(temp);
        assertEquals("barcode,duration,timestamp", lines.get(0));
        assertTrue(lines.get(1).startsWith("ABC,123"));
    }
}
