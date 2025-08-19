import './App.css'

import { useState, useEffect } from "react";

function BarcodeApp() {
  const [barcode, setBarcode] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [count, setCount] = useState(0);
  const optimalTime = 135; // saniye

  // Timer güncellemesi
  useEffect(() => {
    let timer;
    if (startTime) {
      timer = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  // Barkod okutma fonksiyonu
  const handleBarcodeRead = (newBarcode) => {
    // Eğer bir önceki ürün çalışıyorsa onun süresini kaydediyoruz
    if (startTime) {
      console.log("Önceki ürün süresi:", elapsed, "sn");
      // Burada backend'e POST atabilirsiniz:
      // fetch("/api/barcode", { method: "POST", body: JSON.stringify({ barcode: newBarcode, duration: elapsed }) })
    }

    // Yeni ürün için sayaç sıfırlama
    setBarcode(newBarcode);
    setStartTime(Date.now());
    setElapsed(0);
    setCount((prev) => prev + 1);
  };

  // Uyarı rengi (yeşil / sarı / kırmızı)
  const getTimerColor = () => {
    if (elapsed < optimalTime * 0.8) return "text-green-600";
    if (elapsed < optimalTime) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Ürün Takip Sistemi</h1>

      <input
        type="text"
        placeholder="Barkod okutun..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleBarcodeRead(e.target.value);
            e.target.value = "";
          }
        }}
        autoFocus
        className="border p-2"
      />

      <div className="mt-4">
        <p>Aktif Barkod: <b>{barcode || "Yok"}</b></p>
        <p className={getTimerColor()}>Geçen Süre: {elapsed} sn</p>
        <p>Toplam Ürün: {count}</p>
      </div>
    </div>
  );
}

export default BarcodeApp;

