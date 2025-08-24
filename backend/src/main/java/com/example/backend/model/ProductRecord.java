package com.example.backend.model;

import java.time.Instant;

public record ProductRecord(String barcode, long duration, Instant timestamp) {
}
