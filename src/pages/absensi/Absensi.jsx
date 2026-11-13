import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";
import repo from "../../utils/repo";

export default function Absensi() {
  // =====================================================
  // REF
  // =====================================================
  const scannerRef = useRef(null);
  const startingRef = useRef(false);
  const mountedRef = useRef(false);
  const processingRef = useRef(false);
  const lastQrRef = useRef("");
  const resetQrTimerRef = useRef(null);
  const initTimerRef = useRef(null);
  const initIdRef = useRef(0);

  // =====================================================
  // STATE
  // =====================================================
  const [time, setTime] = useState(new Date());
  const [scanTime, setScanTime] = useState("");
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Deteksi tema browser/OS secara otomatis (default mengikuti browser)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Dengarkan perubahan tema browser/OS secara real-time
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // =====================================================
  // EFFECT: LIVE CLOCK
  // =====================================================
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // =====================================================
  // HELPER & NORMALISASI DATA
  // =====================================================
  const getSafeValue = (value, fallback = "-") => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "object") {
      if (value.nis !== undefined) return getSafeValue(value.nis, fallback);
      if (value.nama !== undefined) return getSafeValue(value.nama, fallback);
      if (value.name !== undefined) return getSafeValue(value.name, fallback);
      if (value.kode !== undefined) return getSafeValue(value.kode, fallback);
      if (value.nama_kelas !== undefined)
        return getSafeValue(value.nama_kelas, fallback);
      if (value.status !== undefined)
        return getSafeValue(value.status, fallback);
      if (value.jam !== undefined) return getSafeValue(value.jam, fallback);
      return fallback;
    }
    return fallback;
  };

  const normalizeSiswa = (data) => {
    if (!data || typeof data !== "object") return null;

    const siswaData =
      data.siswa && typeof data.siswa === "object" ? data.siswa : data;

    let foto = null;
    if (typeof siswaData.foto === "string") {
      foto = siswaData.foto;
    } else if (siswaData.foto && typeof siswaData.foto === "object") {
      foto =
        siswaData.foto.url ||
        siswaData.foto.path ||
        siswaData.foto.foto ||
        null;
    }

    const nama = getSafeValue(
      siswaData.nama || siswaData.name,
      "Nama tidak tersedia",
    );
    const nis = getSafeValue(siswaData.nis, "-");

    let kelas = "-";
    if (siswaData.kelas !== undefined) {
      kelas = getSafeValue(siswaData.kelas, "-");
    } else if (siswaData.nama_kelas !== undefined) {
      kelas = getSafeValue(siswaData.nama_kelas, "-");
    } else if (siswaData.siswa_kelas !== undefined) {
      kelas = getSafeValue(siswaData.siswa_kelas, "-");
    }

    let status = getSafeValue(siswaData.status, "");
    if (status === "-" || status === "") {
      status = getSafeValue(siswaData.status_kehadiran, "");
    }
    if (status === "-" || status === "") {
      status = "HADIR";
    }

    let jam = getSafeValue(siswaData.jam, "");
    if (jam === "-" || jam === "") {
      jam = getSafeValue(siswaData.waktu, "");
    }

    return { nama, nis, kelas, status, jam, foto };
  };

  // =====================================================
  // RESET LOCK SCANNER
  // =====================================================
  const resetScannerLock = () => {
    processingRef.current = false;
    lastQrRef.current = "";
  };

  // =====================================================
  // PROSES ABSENSI
  // =====================================================
  const prosesAbsensi = async (qr) => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      setMessage("");
      setCameraError("");

      const dataQr = { nis: qr };
      const response = await fetch(`${repo}api/absensi`, {
        method: "POST",
        body: JSON.stringify(dataQr),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (!mountedRef.current) return;

      const responseData = response.data;
      let data = responseData?.data;
      if (!data && responseData && typeof responseData === "object") {
        data = responseData;
      }

      const siswaData = normalizeSiswa(data);
      if (!siswaData) {
        throw new Error(response.message || "Data siswa tidak valid");
      }

      if (response.success === true) {
        setSiswa(response.data);
        setScanTime(
          new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        );
      }

      setMessage(responseData?.message || "Absensi berhasil dicatat");
      setMessageType("success");

      await Swal.fire({
        icon: "success",
        title: "Absensi Berhasil",
        text:
          responseData?.message ||
          `Kehadiran ${siswaData.nama} telah berhasil disimpan.`,
        background: isDark ? "#0f172a" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
        iconColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: false,
      });
    } catch (error) {
      if (!mountedRef.current) return;

      setSiswa(null);
      let errorMessage = "Absensi gagal diproses.";

      if (error.response) {
        const responseError = error.response.data;
        errorMessage =
          responseError?.message || responseError?.error || "Absensi gagal.";
      } else if (error.request) {
        errorMessage = "Server tidak dapat dihubungi.";
      } else {
        errorMessage = error.message || "Terjadi kesalahan sistem.";
      }

      setMessage(errorMessage);
      setMessageType("error");

      await Swal.fire({
        icon: "error",
        title: "Pemindaian Gagal",
        text: errorMessage,
        background: isDark ? "#0f172a" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
        iconColor: "#f43f5e",
        confirmButtonText: "Scan Ulang",
        confirmButtonColor: "#4f46e5",
        allowOutsideClick: false,
      });
    } finally {
      setLoading(false);

      if (resetQrTimerRef.current) {
        clearTimeout(resetQrTimerRef.current);
      }

      resetQrTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        processingRef.current = false;
        lastQrRef.current = "";
      }, 600);
    }
  };

  // =====================================================
  // HANDLE QR SCAN
  // =====================================================
  const handleScan = (decodedText) => {
    if (!mountedRef.current || !decodedText || processingRef.current) return;
    if (lastQrRef.current === decodedText) return;

    processingRef.current = true;
    lastQrRef.current = decodedText;
    prosesAbsensi(decodedText);
  };

  // =====================================================
  // STOP & START CAMERA
  // =====================================================
  const stopCamera = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (error) {
      console.warn("STOP CAMERA ERROR:", error);
    } finally {
      try {
        scanner.clear();
      } catch (error) {
        console.warn("CLEAR CAMERA ERROR:", error);
      }

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      if (mountedRef.current) {
        setCameraActive(false);
      }
    }
  };

  const startCamera = async () => {
    if (!mountedRef.current || scannerRef.current || startingRef.current)
      return;

    const reader = document.getElementById("reader");
    if (!reader) return;

    startingRef.current = true;
    const currentInitId = ++initIdRef.current;

    try {
      setCameraError("");
      const cameras = await Html5Qrcode.getCameras();

      if (!mountedRef.current || currentInitId !== initIdRef.current) return;
      if (!cameras || cameras.length === 0) {
        throw new Error("Perangkat kamera tidak ditemukan.");
      }

      let selectedCamera = cameras[0];
      const backCamera = cameras.find((camera) => {
        const label = camera.label?.toLowerCase() || "";
        return (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment")
        );
      });

      if (backCamera) {
        selectedCamera = backCamera;
      }

      if (!mountedRef.current || currentInitId !== initIdRef.current) return;

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera.id,
        {
          fps: 12,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          disableFlip: false,
        },
        (decodedText) => handleScan(decodedText),
        () => {},
      );

      if (!mountedRef.current || currentInitId !== initIdRef.current) {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
        if (scannerRef.current === scanner) scannerRef.current = null;
        return;
      }

      setCameraActive(true);
      setCameraError("");
    } catch (error) {
      const scanner = scannerRef.current;
      if (scanner) {
        try {
          if (scanner.isScanning) await scanner.stop();
        } catch (e) {}
        try {
          scanner.clear();
        } catch (e) {}
      }
      scannerRef.current = null;

      if (mountedRef.current) {
        setCameraActive(false);
        let errorMessage = "Kamera tidak dapat diakses.";
        if (error?.name === "NotAllowedError") {
          errorMessage =
            "Izin akses kamera ditolak. Silakan aktifkan izin kamera pada pengaturan browser Anda.";
        } else if (error?.name === "NotFoundError") {
          errorMessage = "Perangkat keras kamera tidak terdeteksi.";
        } else if (error?.name === "NotReadableError") {
          errorMessage = "Kamera sedang digunakan oleh aplikasi lain.";
        } else if (error?.message) {
          errorMessage = error.message;
        }
        setCameraError(errorMessage);
      }
    } finally {
      startingRef.current = false;
    }
  };

  const retryCamera = async () => {
    if (!mountedRef.current) return;
    setCameraError("");
    setCameraActive(false);
    await stopCamera();
    setTimeout(() => {
      if (mountedRef.current) startCamera();
    }, 300);
  };

  const scanLagi = () => {
    setSiswa(null);
    setScanTime("");
    setMessage("");
    setMessageType("success");
    setCameraError("");
    setLoading(false);
    resetScannerLock();
  };

  // =====================================================
  // USE EFFECT LIFECYCLE
  // =====================================================
  useEffect(() => {
    mountedRef.current = true;

    initTimerRef.current = setTimeout(() => {
      if (mountedRef.current) startCamera();
    }, 500);

    return () => {
      mountedRef.current = false;
      initIdRef.current++;

      if (initTimerRef.current) clearTimeout(initTimerRef.current);
      if (resetQrTimerRef.current) clearTimeout(resetQrTimerRef.current);

      processingRef.current = false;
      lastQrRef.current = "";
      startingRef.current = false;

      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner) {
        try {
          if (scanner.isScanning) {
            scanner
              .stop()
              .catch(() => {})
              .finally(() => {
                try {
                  scanner.clear();
                } catch (e) {}
              });
          } else {
            try {
              scanner.clear();
            } catch (e) {}
          }
        } catch (e) {}
      }
    };
  }, []);

  // Format Tanggal Indonesia
  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300 selection:bg-indigo-500/30 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Animasi Laser Scanner Custom */}
      <style>{`
        @keyframes scanLaser {
          0%, 100% { top: 8%; opacity: 0.4; }
          50% { top: 90%; opacity: 1; }
        }
        .animate-scan-laser {
          animation: scanLaser 2.4s ease-in-out infinite;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 1rem;
        }
      `}</style>

      {/* Ambient Glow Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] ${
            isDark ? "bg-indigo-600/15" : "bg-indigo-400/20"
          }`}
        />
        <div
          className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-[120px] ${
            isDark ? "bg-violet-600/10" : "bg-violet-400/15"
          }`}
        />
      </div>

      {/* HEADER */}
      <header
        className={`backdrop-blur-xl border-b sticky top-0 z-30 transition-colors duration-300 ${
          isDark
            ? "bg-slate-900/75 border-slate-800/80"
            : "bg-white/80 border-slate-200/80 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/15 shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-base sm:text-lg font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Sistem Absensi Digital
                </h1>
                <span
                  className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                    isDark
                      ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/25"
                      : "bg-indigo-50 text-indigo-600 border-indigo-200"
                  }`}
                >
                  QR Kiosk
                </span>
              </div>
              <p
                className={`text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Pindai QR Code pada kartu identitas siswa
              </p>
            </div>
          </div>

          {/* Right Status, Theme Toggle & Clock */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span
                className={`text-[11px] font-medium ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {formattedDate}
              </span>
              <span
                className={`text-base font-bold font-mono tracking-wider tabular-nums ${
                  isDark ? "text-slate-100" : "text-slate-800"
                }`}
              >
                {time.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            <div
              className={`h-8 w-px hidden md:block ${
                isDark ? "bg-slate-800" : "bg-slate-200"
              }`}
            />

            {/* Status Kamera */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                cameraActive
                  ? isDark
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : isDark
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/25"
                    : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {cameraActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    cameraActive ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              </span>
              <span className="hidden sm:inline">
                {cameraActive ? "Kamera Siap" : "Kamera Off"}
              </span>
            </div>

            {/* Tombol Toggle Light / Dark Mode */}
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? "bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {isDark ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* KOLOM KIRI: KAMERA PEMINDAI (7 Kolom) */}
          <div
            className={`lg:col-span-7 backdrop-blur-2xl rounded-3xl border p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 ${
              isDark
                ? "bg-slate-900/60 border-slate-800/90 shadow-2xl"
                : "bg-white/90 border-slate-200/90 shadow-xl shadow-slate-200/50"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`text-base sm:text-lg font-semibold flex items-center gap-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Area Pemindaian
                </h2>
                <p
                  className={`text-xs mt-0.5 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Arahkan QR Code tepat di tengah kotak bidik kamera
                </p>
              </div>

              {/* Jam versi Mobile */}
              <div className="md:hidden text-right">
                <span className="text-xs font-mono font-bold text-indigo-500 tabular-nums">
                  {time.toLocaleTimeString("id-ID")}
                </span>
              </div>
            </div>

            {/* Viewport Kamera */}
            <div
              className={`relative w-full overflow-hidden rounded-2xl aspect-square sm:aspect-[4/3] flex items-center justify-center border shadow-inner ${
                isDark
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-900 border-slate-300"
              }`}
            >
              <div id="reader" className="w-full h-full" />

              {/* Viewfinder Overlay & Animasi Laser */}
              {cameraActive && !loading && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-2xl shadow-[0_0_0_9999px_rgba(2,6,23,0.5)]">
                    <div className="absolute -top-0.5 -left-0.5 w-9 h-9 border-t-[3px] border-l-[3px] border-indigo-400 rounded-tl-2xl drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <div className="absolute -top-0.5 -right-0.5 w-9 h-9 border-t-[3px] border-r-[3px] border-indigo-400 rounded-tr-2xl drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <div className="absolute -bottom-0.5 -left-0.5 w-9 h-9 border-b-[3px] border-l-[3px] border-indigo-400 rounded-bl-2xl drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-9 h-9 border-b-[3px] border-r-[3px] border-indigo-400 rounded-br-2xl drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />

                    {/* Garis Laser Pemindai */}
                    <div className="animate-scan-laser absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_2px_rgba(99,102,241,0.8)]" />
                  </div>
                </div>
              )}

              {/* Placeholder jika kamera sedang inisialisasi */}
              {!cameraActive && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-slate-300 p-6 text-center">
                  <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
                  <p className="text-xs font-medium">
                    Menginisialisasi perangkat kamera...
                  </p>
                </div>
              )}
            </div>

            {/* Alert Error Kamera */}
            {cameraError && (
              <div
                className={`mt-4 p-4 rounded-2xl border flex items-start gap-3.5 ${
                  isDark
                    ? "bg-rose-500/10 border-rose-500/25"
                    : "bg-rose-50 border-rose-200"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isDark
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4
                    className={`text-sm font-semibold ${
                      isDark ? "text-rose-200" : "text-rose-800"
                    }`}
                  >
                    Kamera Tidak Tersedia
                  </h4>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isDark ? "text-rose-300/90" : "text-rose-600"
                    }`}
                  >
                    {cameraError}
                  </p>
                  <button
                    type="button"
                    onClick={retryCamera}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white text-xs font-semibold transition shadow-sm"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Hubungkan Ulang Kamera
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN: PANEL STATUS & HASIL ABSENSI (5 Kolom) */}
          <div
            className={`lg:col-span-5 backdrop-blur-2xl rounded-3xl border p-5 sm:p-6 flex flex-col justify-between min-h-[480px] transition-colors duration-300 ${
              isDark
                ? "bg-slate-900/60 border-slate-800/90 shadow-2xl"
                : "bg-white/90 border-slate-200/90 shadow-xl shadow-slate-200/50"
            }`}
          >
            {/* STATE 1: IDLE / MENUNGGU SCAN */}
            {!siswa && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-5 border shadow-inner transition-colors ${
                    messageType === "error"
                      ? isDark
                        ? "bg-rose-500/10 border-rose-500/25 text-rose-400"
                        : "bg-rose-50 border-rose-200 text-rose-600"
                      : isDark
                        ? "bg-slate-800/80 border-slate-700/80 text-indigo-400"
                        : "bg-indigo-50 border-indigo-100 text-indigo-600"
                  }`}
                >
                  {messageType === "error" ? (
                    <svg
                      className="w-9 h-9"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-9 h-9"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                  )}
                </div>

                <h3
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {messageType === "error"
                    ? "QR Code Tidak Valid"
                    : "Siap Memindai Kartu"}
                </h3>
                <p
                  className={`text-xs sm:text-sm max-w-xs mt-2 leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {messageType === "error"
                    ? message ||
                      "Data siswa tidak ditemukan dalam sistem. Pastikan kartu pelajar dalam kondisi jelas."
                    : "Dekatkan QR Code pada kartu pelajar ke arah kamera untuk mencatat kehadiran secara otomatis."}
                </p>

                {/* Petunjuk Singkat */}
                <div
                  className={`mt-8 w-full max-w-xs pt-5 border-t flex items-center justify-center gap-6 text-[11px] ${
                    isDark
                      ? "border-slate-800/80 text-slate-500"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Cahaya Cukup
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Jarak ±15–25 cm
                  </span>
                </div>
              </div>
            )}

            {/* STATE 2: LOADING VERIFIKASI */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="relative flex items-center justify-center w-16 h-16 mb-5">
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin" />
                  <svg
                    className="w-6 h-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-base font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Memverifikasi Identitas
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Menyinkronkan data kehadiran ke server...
                </p>
              </div>
            )}

            {/* STATE 3: HASIL DATA SISWA */}
            {siswa && !loading && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Header Konfirmasi */}
                  <div
                    className={`flex items-center justify-between p-3.5 rounded-2xl border mb-6 ${
                      isDark
                        ? "bg-emerald-500/10 border-emerald-500/25"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4
                          className={`text-xs font-bold uppercase tracking-wider ${
                            isDark ? "text-emerald-400" : "text-emerald-700"
                          }`}
                        >
                          Kehadiran Tercatat
                        </h4>
                        <p
                          className={`text-xs mt-0.5 ${
                            isDark ? "text-emerald-200/80" : "text-emerald-600"
                          }`}
                        >
                          Data berhasil disimpan ke sistem
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kartu Profil Siswa */}
                  <div
                    className={`p-4 rounded-2xl border mb-4 ${
                      isDark
                        ? "bg-slate-950/60 border-slate-800/90"
                        : "bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border shadow-sm shrink-0 flex items-center justify-center ${
                          isDark
                            ? "bg-slate-800 border-slate-700 text-slate-400"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}
                      >
                        {siswa.image_profile ? (
                          <img
                            src={repo + siswa.image_profile}
                            alt={siswa.name || siswa.nama}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <svg
                            className="w-9 h-9"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border mb-1.5 ${
                            isDark
                              ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/25"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200"
                          }`}
                        >
                          NIS: {siswa.nis}
                        </span>
                        <h3
                          className={`text-base sm:text-lg font-bold truncate ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {siswa.name || siswa.nama}
                        </h3>
                        <p
                          className={`text-xs truncate mt-0.5 ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {siswa.nama_kelas || siswa.kelas}
                          {siswa.jurusan ? ` • ${siswa.jurusan}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detail Metrik Kehadiran */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark
                          ? "bg-slate-950/60 border-slate-800/90"
                          : "bg-slate-50 border-slate-200/80"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-medium uppercase tracking-wider block ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Status
                      </span>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span
                          className={`text-sm font-bold ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          Hadir
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark
                          ? "bg-slate-950/60 border-slate-800/90"
                          : "bg-slate-50 border-slate-200/80"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-medium uppercase tracking-wider block ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Waktu Masuk
                      </span>
                      <span
                        className={`mt-1.5 block text-sm font-bold font-mono tabular-nums ${
                          isDark ? "text-slate-100" : "text-slate-800"
                        }`}
                      >
                        {scanTime || time.toLocaleTimeString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {message && (
                    <div
                      className={`px-3.5 py-2.5 rounded-xl border text-xs text-center ${
                        isDark
                          ? "bg-slate-800/40 border-slate-800 text-slate-300"
                          : "bg-slate-100/80 border-slate-200 text-slate-600"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                </div>

                {/* Tombol Aksi */}
                <button
                  type="button"
                  onClick={scanLagi}
                  className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 ring-1 ring-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Scan Siswa Berikutnya
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
