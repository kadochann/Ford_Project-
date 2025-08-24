# Backend service

This Spring Boot module provides REST endpoints for saving and retrieving scanned barcodes.

## Endpoints
- `POST /api/barcodes`
  - Request body: `{"barcode": "string", "duration": number, "timestamp": "ISO-8601"}`
  - Appends the record to a CSV file on disk.
- `GET /api/barcodes`
  - Returns the accumulated records as a CSV file download.
- `GET /api/barcodes/list`
  - Returns the raw CSV lines as JSON for quick inspection.

## Building
```bash
mvn -q test    # run unit tests
mvn spring-boot:run  # start the server on port 8080
```

## `pom.xml`
The [`pom.xml`](pom.xml) defines the project dependencies and build plugins. Spring Boot
brings in a web server and test support so no extra setup is required. Maven reads this file to
download libraries, compile sources and execute the application.
