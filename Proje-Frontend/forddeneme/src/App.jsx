import { useState, useEffect } from "react";

// Helper function to determine timer color based on elapsed time
const computeTimerColor = (elapsed, optimalTime) => {
  if (elapsed >= optimalTime) {
    return "text-red-600";
  } else if (elapsed > optimalTime * 0.8) {
    return "text-orange-500";
  } else {
    return "text-green-600";
  }
};

/**
 * A custom modal component to display messages instead of using alert().
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.message - The message to display.
 * @param {() => void} props.onClose - Function to call when the modal is closed.
 * @param {string} props.type - The type of modal ("success", "error", "info").
 */
const Modal = ({ title, message, onClose, type }) => {
  let modalClasses = "";
  let iconComponent = null;

  // SVG icons, since lucide-react import fails in this environment
  const CheckSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600"><polyline points="20 6 9 17 4 12"/></svg>;
  const XSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x text-red-600"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
  const AlertTriangleSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle text-blue-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
  const CloseXSVG = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x text-gray-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

  switch (type) {
    case "success":
      modalClasses = "bg-green-50 border-green-200 text-green-800";
      iconComponent = CheckSVG;
      break;
    case "error":
      modalClasses = "bg-red-50 border-red-200 text-red-800";
      iconComponent = XSVG;
      break;
    default:
      modalClasses = "bg-blue-50 border-blue-200 text-blue-800";
      iconComponent = AlertTriangleSVG;
      break;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-xl max-w-sm w-full border ${modalClasses}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            {iconComponent}
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
            {CloseXSVG}
          </button>
        </div>
        <p className="text-sm">{message}</p>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [barcode, setBarcode] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const optimalTime = 135; // seconds; timer turns red when this value is exceeded

  // Add CDN links for Tailwind CSS and Google Fonts
  useEffect(() => {
    const tailwindScriptId = 'tailwind-cdn';
    if (!document.getElementById(tailwindScriptId)) {
        const script = document.createElement('script');
        script.id = tailwindScriptId;
        script.src = "https://cdn.tailwindcss.com";
        document.head.appendChild(script);
    }
    const interLinkId = 'inter-font';
    if (!document.getElementById(interLinkId)) {
      const link = document.createElement('link');
      link.id = interLinkId;
      link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    document.body.style.fontFamily = "'Inter', sans-serif";
  }, []);

  // Function to fetch total product count from the backend
  const fetchTotalCount = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/barcodes/count');
      if (response.ok) {
        const data = await response.json();
        setCount(data.totalCount);
      } else {
        throw new Error(`Server response was not ok: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Failed to fetch total count:', err);
      setError("Sunucuya bağlanılamadı. Veriler yerel olarak gösteriliyor.");
      setCount(150); // Fallback dummy data
    }
  };

  // Function to fetch daily statistics from the backend
  const fetchDailyStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/barcodes/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error(`Server response was not ok: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setError("Sunucuya bağlanılamadı. Veriler yerel olarak gösteriliyor.");
      setStats({
        totalProducts: 150,
        averageDuration: 120,
        optimalTimeCount: 130,
        overTimeCount: 20,
        todayDate: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
      });
    }
  };

  // Function to recreate the CSV file via backend API
  const recreateCsvFile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch('http://localhost:8080/api/barcodes/recreate-csv', {
        method: 'POST'
      });
      
      if (response.ok) {
        setShowSuccessModal(true);
        await Promise.all([fetchTotalCount(), fetchDailyStats()]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to recreate CSV file');
      }
    } catch (err) {
      setError(`CSV Error: ${err.message}. Sunucuya erişim sağlanamadı. Lütfen arka ucu kontrol edin.`);
      console.error('CSV recreation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download the CSV file from the backend
  const downloadCsv = async () => {
    try {
      setError("");
      const response = await fetch('http://localhost:8080/api/barcodes');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ford_barcodes.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download CSV file');
      }
    } catch (err) {
      setError(`İndirme Hatası: ${err.message}. Sunucuya erişim sağlanamadı. Lütfen arka ucu kontrol edin.`);
      console.error('CSV download error:', err);
    }
  };

  useEffect(() => {
    fetchTotalCount();
    fetchDailyStats();
  }, []);

  useEffect(() => {
    let timer;
    if (startTime) {
      timer = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  const handleBarcodeRead = async (newBarcode) => {
    if (!newBarcode.trim()) {
      setError("Barkod boş olamaz!");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      if (startTime && barcode) {
        const previousRecord = {
          barcode: barcode,
          duration: elapsed,
          timestamp: new Date().toISOString()
        };
        const response = await fetch('http://localhost:8080/api/barcodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(previousRecord)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save previous product');
        }
        console.log("Previous product duration saved:", elapsed, "sec");
      }
      setBarcode(newBarcode);
      setStartTime(Date.now());
      setElapsed(0);
      await Promise.all([fetchTotalCount(), fetchDailyStats()]);
    } catch (err) {
      setError(`Hata: ${err.message}. Lütfen sunucu bağlantınızı kontrol edin.`);
      console.error('Barcode processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimerColor = () => computeTimerColor(elapsed, optimalTime);

  const getTimerMessage = () => {
    if (elapsed === 0) return "Başlayın";
    if (elapsed < optimalTime * 0.8) return "Çok iyi!";
    if (elapsed < optimalTime) return "Dikkat!";
    return "Süre aşıldı!";
  };

  // SVG icons for buttons
  const SignalSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-signal mr-2"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 20V4"/></svg>;
  const ListSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list mr-2"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
  const CloudDownloadSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-download mr-2"><path d="M4 14.5V14a4 4 0 0 1 7.24-2.83"/><path d="M16.5 19.5A5.5 5.5 0 0 0 18 10h-1.26a8 8 0 1 0-16.3 0"/><path d="m12 16 2-2 2 2"/><line x1="12" x2="12" y1="14" y2="22"/></svg>;
  const RotateCcwSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw mr-2"><path d="M3 12a9 9 0 1 0 9-9.5V3"/><path d="M3 12a9 9 0 1 0 9 9.5V21"/><path d="M3 12h-.5"/><path d="M12 21v-.5"/><path d="M12 3v-.5"/><path d="M21 12h.5"/></svg>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      {/* Topbar: Centered Title */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Ford Ürün Takip Sistemi
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Barcode Input Section - Centered Card */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Barkod Okutma
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Barkod okuyucu ile tarayın..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleBarcodeRead(e.target.value.trim());
                    e.target.value = "";
                  }
                }}
                disabled={isLoading}
                autoFocus
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 text-center"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center mt-3">
              Enter tuşuna basarak işlemi başlatın
            </p>
          </div>
        </div>

        {/* Active Product and Timer Info - Separate Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Aktif Ürün Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Barcode and Count */}
              <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Barkod</p>
                <p className="text-lg font-bold text-blue-600 break-all">{barcode || "Yok"}</p>
              </div>

              {/* Timer and Total Count */}
              <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Geçen Süre</p>
                <div className={`mb-2 text-4xl font-bold ${getTimerColor()}`}>
                  {elapsed} <span className="text-sm">sn</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">Optimal: {optimalTime} sn</p>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getTimerColor().replace('text-', 'bg-').replace('-600', '-100')} ${getTimerColor()}`}>
                  {getTimerMessage()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Statistics - Centered Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Günlük İstatistikler
            </h2>
            
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Toplam Ürün</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Ortalama Süre</p>
                  <p className="text-xl font-bold text-blue-600">{stats.averageDuration} sn</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Optimal Sürede</p>
                  <p className="text-xl font-bold text-green-600">{stats.optimalTimeCount}</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Süre Aşımı</p>
                  <p className="text-xl font-bold text-red-600">{stats.overTimeCount}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm">İstatistikler yükleniyor...</p>
              </div>
            )}
            
            {stats && (
              <div className="text-center text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded">
                {stats.todayDate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Sistem Operations - Centered Buttons */}
      <div className="bg-white shadow-inner border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Sistem İşlemleri
          </h3>
          <div className="flex flex-wrap justify-center space-x-2 md:space-x-4">
            <button
              onClick={() => fetchTotalCount()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center mb-2 md:mb-0"
            >
              {SignalSVG} Güncelle
            </button>
            <button
              onClick={() => fetchDailyStats()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center mb-2 md:mb-0"
            >
              {ListSVG} İstatistik
            </button>
            <button
              onClick={downloadCsv}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center mb-2 md:mb-0"
            >
              {CloudDownloadSVG} CSV İndir
            </button>
            <button
              onClick={recreateCsvFile}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center"
            >
              {RotateCcwSVG} CSV Düzenle
            </button>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">İşleniyor...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal
          title="Başarılı!"
          message="CSV dosyası başarıyla yeniden oluşturuldu!"
          onClose={() => setShowSuccessModal(false)}
          type="success"
        />
      )}
    </div>
  );
}

export default App;