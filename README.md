# 🚗 Ford Ürün Takip Sistemi

Ford Fabrikasında tekerlek montaj hattında ürün takibi için geliştirilmiş web uygulaması.

## 📋 Proje Açıklaması

Bu sistem, operatörlerin barkod okuyucu ile ürün takibini otomatikleştirir ve gerçek zamanlı süre takibi yapar. Her ürün için optimal süre 135 saniye olarak belirlenmiştir.

### 🎯 Ana Özellikler

- **Gerçek Zamanlı Timer**: Barkod okutulduğu andan itibaren süre takibi
- **Optimal Süre Uyarısı**: 135 saniye yaklaştığında ve aşıldığında görsel uyarı
- **Otomatik Kayıt**: Yeni barkod okutulduğunda önceki ürün süresi otomatik kaydedilir
- **Günlük İstatistikler**: Toplam ürün sayısı, ortalama süre, optimal/gecikme sayıları
- **CSV Export**: Tüm veriler CSV formatında indirilebilir
- **CSV Düzenleme**: CSV formatını yeniden oluşturma özelliği

## 🛠️ Teknoloji Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Maven**

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Java 17 veya üzeri
- Node.js 16 veya üzeri
- Maven 3.6+

### 1. Backend Kurulumu

```bash
cd backend

# Maven dependencies'leri indir
mvn clean install

# Uygulamayı çalıştır
mvn spring-boot:run
```

Backend `http://localhost:8080` adresinde çalışacak.

### 2. Frontend Kurulumu

```bash
cd Proje-Frontend/forddeneme

# Dependencies'leri indir
npm install

# Development server'ı başlat
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacak.

## 📡 API Endpoints

### Barkod İşlemleri

- **POST** `/api/barcodes` - Yeni barkod kaydı ekle
- **GET** `/api/barcodes/list` - Tüm kayıtları listele
- **GET** `/api/barcodes/count` - Toplam ürün sayısını getir
- **GET** `/api/barcodes/stats` - Günlük istatistikleri getir
- **GET** `/api/barcodes/last` - Son kaydedilen ürünü getir
- **GET** `/api/barcodes` - CSV dosyasını indir
- **POST** `/api/barcodes/recreate-csv` - CSV dosyasını yeniden oluştur

### Örnek API Kullanımı

```bash
# Barkod ekle
curl -X POST http://localhost:8080/api/barcodes \
  -H "Content-Type: application/json" \
  -d '{"barcode":"12345","duration":120,"timestamp":"2024-01-01T10:00:00Z"}'

# İstatistikleri getir
curl http://localhost:8080/api/barcodes/stats

# Toplam sayıyı getir
curl http://localhost:8080/api/barcodes/count

# CSV dosyasını yeniden oluştur
curl -X POST http://localhost:8080/api/barcodes/recreate-csv
```

## 🎮 Kullanım

1. **Barkod Okutma**: Barkod okuyucu ile barkod okutun veya manuel olarak yazın
2. **Timer Takibi**: Süre otomatik olarak başlar ve gerçek zamanlı güncellenir
3. **Yeni Ürün**: Yeni barkod okutulduğunda önceki ürün otomatik kaydedilir
4. **İstatistikler**: Sağ panelde günlük istatistikleri görüntüleyin
5. **CSV İşlemleri**: 
   - **CSV İndir**: Mevcut verileri CSV olarak indirin
   - **CSV Düzenle**: CSV formatını yeniden oluşturun

## 🎨 UI Özellikleri

- **Responsive Design**: Mobil ve masaüstü uyumlu
- **Renk Kodları**: 
  - 🟢 Yeşil: Optimal süre içinde
  - 🟡 Sarı: Optimal süreye yakın
  - 🔴 Kırmızı: Optimal süre aşıldı
- **Modern Arayüz**: Tailwind CSS ile şık tasarım
- **Gerçek Zamanlı Güncelleme**: Otomatik veri yenileme

## 📊 Veri Yapısı

### ProductRecord
```java
public record ProductRecord(
    String barcode,    // Barkod numarası
    long duration,     // İşlem süresi (saniye)
    Instant timestamp  // Zaman damgası
) {}
```

### CSV Format
```csv
Barkod,Süre (sn),Zaman Damgası
12345,120,2024-01-01T10:00:00Z
67890,140,2024-01-01T10:05:00Z
```

**Önemli**: CSV dosyası UTF-8 encoding ile kaydedilir ve Excel'de doğru şekilde açılır.

## 🔧 Geliştirme

### Backend Geliştirme
```bash
cd backend
mvn spring-boot:run
```

### Frontend Geliştirme
```bash
cd Proje-Frontend/forddeneme
npm run dev
```

### Test Çalıştırma
```bash
# Backend testleri
cd backend
mvn test

# Frontend testleri
cd Proje-Frontend/forddeneme
npm test
```

## 📝 Notlar

- Backend varsayılan olarak 8080 portunda çalışır
- Frontend varsayılan olarak 5173 portunda çalışır
- CORS ayarları sadece localhost için yapılandırılmıştır
- Veriler `barcodes.csv` dosyasında saklanır
- Optimal süre 135 saniye olarak sabit kodlanmıştır
- CSV dosyası UTF-8 encoding ile kaydedilir

## 🚨 Sorun Giderme

### Backend Başlatılamıyor
- Java 17+ yüklü olduğundan emin olun
- Port 8080'in boş olduğunu kontrol edin
- Maven dependencies'lerin indirildiğini kontrol edin

### Frontend Bağlantı Hatası
- Backend'in çalıştığından emin olun
- CORS ayarlarını kontrol edin
- Network sekmesinde hata mesajlarını inceleyin

### Veri Kaydedilmiyor
- Backend loglarını kontrol edin
- CSV dosyası yazma izinlerini kontrol edin
- Disk alanının yeterli olduğundan emin olun

### CSV Format Sorunu
- **CSV Düzenle** butonuna tıklayın
- Dosyayı Excel'de açarken UTF-8 encoding seçin
- Virgül delimiter olarak ayarlayın

## 📞 Destek

Proje ile ilgili sorularınız için geliştirici ekibi ile iletişime geçin.

---

**Ford Ürün Takip Sistemi v1.0** - Spring Boot + React 
