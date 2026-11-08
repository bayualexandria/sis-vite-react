import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";
import repo from "../../utils/repo";

export default function Absensi() {
  // =====================================================
  // REF
  // =====================================================

  const scannerRef = useRef(null);
  const [time, setTime] = useState(new Date());

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

  const [siswa, setSiswa] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("success");

  const [cameraActive, setCameraActive] = useState(false);

  const [cameraError, setCameraError] = useState("");

  // =====================================================
  // HELPER
  // =====================================================

  /*
   * Fungsi ini sangat penting.
   *
   * Karena response Go/GORM kadang menghasilkan:
   *
   * nis: "12345"
   *
   * atau:
   *
   * nis: {
   *     nis: "12345"
   * }
   *
   * atau bahkan:
   *
   * nis: {
   *     siswa: {
   *         nis: "12345"
   *     }
   * }
   *
   * Fungsi ini mengambil nilai akhirnya.
   */

  const getSafeValue = (value, fallback = "-") => {
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    if (typeof value === "object") {
      // NIS
      if (value.nis !== undefined) {
        return getSafeValue(value.nis, fallback);
      }

      // Nama
      if (value.nama !== undefined) {
        return getSafeValue(value.nama, fallback);
      }

      // Name
      if (value.name !== undefined) {
        return getSafeValue(value.name, fallback);
      }

      // Kode
      if (value.kode !== undefined) {
        return getSafeValue(value.kode, fallback);
      }

      // Nama kelas
      if (value.nama_kelas !== undefined) {
        return getSafeValue(value.nama_kelas, fallback);
      }

      // Status
      if (value.status !== undefined) {
        return getSafeValue(value.status, fallback);
      }

      // Jam
      if (value.jam !== undefined) {
        return getSafeValue(value.jam, fallback);
      }

      return fallback;
    }

    return fallback;
  };

  // =====================================================
  // NORMALISASI DATA SISWA
  // =====================================================

  const normalizeSiswa = (data) => {
    if (!data || typeof data !== "object") {
      return null;
    }

    /*
     * Kadang API mengembalikan:
     *
     * data.siswa
     *
     * sehingga kita coba ambil siswa
     * jika tersedia.
     */

    const siswaData =
      data.siswa && typeof data.siswa === "object" ? data.siswa : data;

    // =================================================
    // FOTO
    // =================================================

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

    // =================================================
    // NAMA
    // =================================================

    const nama = getSafeValue(siswaData.nama, "Nama tidak tersedia");

    // =================================================
    // NIS
    // =================================================

    const nis = getSafeValue(siswaData.nis, "-");

    // =================================================
    // KELAS
    // =================================================

    let kelas = "-";

    if (siswaData.kelas !== undefined) {
      kelas = getSafeValue(siswaData.kelas, "-");
    } else if (siswaData.nama_kelas !== undefined) {
      kelas = getSafeValue(siswaData.nama_kelas, "-");
    } else if (siswaData.siswa_kelas !== undefined) {
      kelas = getSafeValue(siswaData.siswa_kelas, "-");
    }

    // =================================================
    // STATUS
    // =================================================

    let status = getSafeValue(siswaData.status, "");

    /*
     * Jika backend tidak mengirim status,
     * gunakan status_kehadiran.
     */

    if (status === "-" || status === "") {
      status = getSafeValue(siswaData.status_kehadiran, "");
    }

    if (status === "-" || status === "") {
      status = "HADIR";
    }

    // =================================================
    // JAM
    // =================================================

    let jam = getSafeValue(siswaData.jam, "");

    if (jam === "-" || jam === "") {
      jam = getSafeValue(siswaData.waktu, "");
    }

    if (jam === "-" || jam === "") {
      jam = "--:--:--";
    }

    // =================================================
    // RETURN
    // =================================================

    return {
      nama,
      nis,
      kelas,
      status,
      jam,
      foto,
    };
  };

  // =====================================================
  // RESET LOCK SCANNER
  // =====================================================

  const resetScannerLock = () => {
    processingRef.current = false;

    lastQrRef.current = "";

    console.log("SCANNER LOCK RESET");
  };

  // =====================================================
  // PROSES ABSENSI
  // =====================================================

  const prosesAbsensi = async (qr) => {
    if (!mountedRef.current) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setCameraError("");

      console.log("QR:", qr);
      const dataQr = { nis: qr };

      const response = await fetch(`${repo}api/absensi`, {
        method: "POST",
        body: JSON.stringify(dataQr),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      if (!mountedRef.current) {
        return;
      }

      console.log("RESPONSE API:", response);

      const responseData = response.data;

      let data = responseData?.data;

      if (!data && responseData && typeof responseData === "object") {
        data = responseData;
      }

      const siswaData = normalizeSiswa(data);

      if (!siswaData) {
        throw new Error(response.message);
      }
      if (response.success === true) {
        setSiswa(response.data);
      }

      setMessage(responseData?.message || "Absensi berhasil");

      setMessageType("success");

      // =================================================
      // SWEETALERT BERHASIL
      // =================================================

      await Swal.fire({
        icon: "success",
        title: "Absensi Berhasil",
        text: responseData?.message || "Data absensi berhasil disimpan.",
        timer: 1800,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    } catch (error) {
      if (!mountedRef.current) {
        return;
      }

      console.log("ABSENSI ERROR:", error);

      // =================================================
      // HAPUS DATA SEBELUMNYA
      // =================================================

      setSiswa(null);

      let errorMessage = "Absensi gagal.";

      // =================================================
      // ERROR DARI BACKEND
      // =================================================

      if (error.response) {
        const responseError = error.response.data;

        console.log("ERROR BACKEND:", responseError);

        errorMessage =
          responseError?.message || responseError?.error || "Absensi gagal.";
      }
      // =================================================
      // SERVER TIDAK MERESPON
      // =================================================
      else if (error.request) {
        errorMessage = "Server tidak dapat dihubungi.";
      }
      // =================================================
      // ERROR LAIN
      // =================================================
      else {
        errorMessage = error.message || "Terjadi kesalahan.";
      }

      setMessage(errorMessage);

      setMessageType("error");

      // =================================================
      // SWEETALERT ERROR
      // =================================================

      await Swal.fire({
        icon: "error",
        title: "Absensi Gagal",
        text: errorMessage,
        confirmButtonText: "Scan Lagi",
        confirmButtonColor: "#2563eb",
        allowOutsideClick: false,
      });
    } finally {
      setLoading(false);

      // =================================================
      // BUKA LOCK SCANNER
      // =================================================

      if (resetQrTimerRef.current) {
        clearTimeout(resetQrTimerRef.current);
      }

      resetQrTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }

        processingRef.current = false;

        lastQrRef.current = "";

        console.log("SCANNER SIAP SCAN LAGI");
      }, 500);
    }
  };

  // =====================================================
  // HANDLE QR SCAN
  // =====================================================

  const handleScan = (decodedText) => {
    if (!mountedRef.current) {
      return;
    }

    if (!decodedText) {
      return;
    }

    if (processingRef.current) {
      return;
    }

    if (lastQrRef.current === decodedText) {
      return;
    }

    processingRef.current = true;

    lastQrRef.current = decodedText;

    console.log("QR TERBACA:", decodedText);

    prosesAbsensi(decodedText);
  };

  // =====================================================
  // STOP CAMERA
  // =====================================================

  const stopCamera = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    console.log("STOP CAMERA");

    try {
      if (scanner.isScanning) {
        await scanner.stop();

        console.log("CAMERA STOPPED");
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

  // =====================================================
  // START CAMERA
  // =====================================================

  const startCamera = async () => {
    // =================================================
    // CEK COMPONENT
    // =================================================

    if (!mountedRef.current) {
      return;
    }

    // =================================================
    // SUDAH ADA SCANNER
    // =================================================

    if (scannerRef.current) {
      console.log("SCANNER SUDAH ADA");

      return;
    }

    // =================================================
    // SEDANG START
    // =================================================

    if (startingRef.current) {
      console.log("SCANNER SEDANG START");

      return;
    }

    // =================================================
    // ELEMENT READER
    // =================================================

    const reader = document.getElementById("reader");

    if (!reader) {
      console.error("ELEMENT #reader TIDAK DITEMUKAN");

      return;
    }

    // =================================================
    // LOCK START
    // =================================================

    startingRef.current = true;

    const currentInitId = ++initIdRef.current;

    try {
      setCameraError("");

      console.log("================================");

      console.log("MENCARI CAMERA");

      console.log("================================");

      // =================================================
      // GET CAMERA
      // =================================================

      const cameras = await Html5Qrcode.getCameras();

      // =================================================
      // COMPONENT SUDAH CLEANUP
      // =================================================

      if (!mountedRef.current || currentInitId !== initIdRef.current) {
        return;
      }

      console.log("CAMERA LIST:", cameras);

      if (!cameras || cameras.length === 0) {
        throw new Error("Tidak ada kamera yang ditemukan.");
      }

      // =================================================
      // PILIH CAMERA
      // =================================================

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

      console.log("CAMERA DIPILIH:", selectedCamera);

      // =================================================
      // CEK LAGI
      // =================================================

      if (!mountedRef.current || currentInitId !== initIdRef.current) {
        return;
      }

      // =================================================
      // BUAT SCANNER
      // =================================================

      const scanner = new Html5Qrcode("reader");

      scannerRef.current = scanner;

      console.log("SCANNER OBJECT DIBUAT");

      // =================================================
      // START
      // =================================================

      await scanner.start(
        selectedCamera.id,

        {
          fps: 10,

          qrbox: {
            width: 260,
            height: 260,
          },

          aspectRatio: 1,

          disableFlip: false,
        },

        (decodedText) => {
          handleScan(decodedText);
        },

        () => {
          // QR belum ditemukan.
          // Jangan tampilkan error.
        },
      );

      // =================================================
      // CEK SETELAH START
      // =================================================

      if (!mountedRef.current || currentInitId !== initIdRef.current) {
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }
        } catch (error) {
          console.warn("CLEANUP START ERROR:", error);
        }

        try {
          scanner.clear();
        } catch (error) {
          console.warn("CLEAR ERROR:", error);
        }

        if (scannerRef.current === scanner) {
          scannerRef.current = null;
        }

        return;
      }

      // =================================================
      // CAMERA AKTIF
      // =================================================

      setCameraActive(true);

      setCameraError("");

      console.log("================================");

      console.log("KAMERA AKTIF");

      console.log("================================");
    } catch (error) {
      console.error("================================");

      console.error("CAMERA ERROR:", error);

      console.error("================================");

      const scanner = scannerRef.current;

      if (scanner) {
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }
        } catch (stopError) {
          console.warn("STOP ERROR:", stopError);
        }

        try {
          scanner.clear();
        } catch (clearError) {
          console.warn("CLEAR ERROR:", clearError);
        }
      }

      scannerRef.current = null;

      if (mountedRef.current) {
        setCameraActive(false);

        let errorMessage = "Kamera tidak dapat digunakan.";

        if (error?.name === "NotAllowedError") {
          errorMessage =
            "Izin kamera ditolak. Silakan izinkan kamera pada browser.";
        } else if (error?.name === "NotFoundError") {
          errorMessage = "Kamera tidak ditemukan.";
        } else if (error?.name === "NotReadableError") {
          errorMessage = "Kamera sedang digunakan aplikasi lain.";
        } else if (error?.name === "OverconstrainedError") {
          errorMessage = "Kamera tidak mendukung konfigurasi yang diminta.";
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setCameraError(errorMessage);
      }
    } finally {
      startingRef.current = false;
    }
  };

  // =====================================================
  // RETRY CAMERA
  // =====================================================

  const retryCamera = async () => {
    if (!mountedRef.current) {
      return;
    }

    console.log("RETRY CAMERA");

    setCameraError("");

    setCameraActive(false);

    await stopCamera();

    setTimeout(() => {
      if (mountedRef.current) {
        startCamera();
      }
    }, 300);
  };

  // =====================================================
  // SCAN SISWA BERIKUTNYA
  // =====================================================

  const scanLagi = () => {
    console.log("================================");

    console.log("SCAN SISWA BERIKUTNYA");

    console.log("================================");

    // Hapus hasil siswa
    setSiswa(null);

    // Hapus pesan
    setMessage("");

    setMessageType("success");

    setCameraError("");

    setLoading(false);

    // Reset scanner
    resetScannerLock();

    console.log("SCANNER SIAP MEMBACA QR BERIKUTNYA");
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    time;

    console.log("================================");

    console.log("ABSENSI MOUNT");

    console.log("================================");

    /*
     * Delay sedikit agar React StrictMode
     * tidak membuat kamera ganda.
     */

    initTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        startCamera();
      }
    }, 500);

    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      console.log("================================");

      console.log("CLEANUP ABSENSI");

      console.log("================================");

      mountedRef.current = false;

      // =================================================
      // INVALIDATE INIT
      // =================================================

      initIdRef.current++;

      // =================================================
      // TIMER INIT
      // =================================================

      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);

        initTimerRef.current = null;
      }

      // =================================================
      // TIMER RESET QR
      // =================================================

      if (resetQrTimerRef.current) {
        clearTimeout(resetQrTimerRef.current);

        resetQrTimerRef.current = null;
      }

      // =================================================
      // RESET REF
      // =================================================

      processingRef.current = false;

      lastQrRef.current = "";

      startingRef.current = false;

      // =================================================
      // SCANNER
      // =================================================

      const scanner = scannerRef.current;

      scannerRef.current = null;

      if (scanner) {
        try {
          if (scanner.isScanning) {
            scanner
              .stop()
              .then(() => {
                console.log("CAMERA BERHASIL DIHENTIKAN");
              })
              .catch((error) => {
                console.warn("STOP CAMERA ERROR:", error);
              })
              .finally(() => {
                try {
                  scanner.clear();
                } catch (error) {
                  console.warn("CLEAR CAMERA ERROR:", error);
                }
              });
          } else {
            try {
              scanner.clear();
            } catch (error) {
              console.warn("CLEAR CAMERA ERROR:", error);
            }
          }
        } catch (error) {
          console.warn("CLEANUP CAMERA ERROR:", error);
        }
      }
    };
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">
      {/* =================================================
                HEADER
            ================================================= */}

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* LOGO */}

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
                🪪
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Absensi Siswa
                </h1>

                <p className="text-sm text-slate-500">Scan ID Card siswa</p>
              </div>
            </div>

            {/* STATUS CAMERA */}

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                cameraActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  cameraActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`}
              />

              {cameraActive ? "Kamera Aktif" : "Kamera Tidak Aktif"}
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
                MAIN
            ================================================= */}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* =================================================
                        CAMERA
                    ================================================= */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-800">
                  Scan ID Card
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Arahkan QR Code ID Card ke kamera.
                </p>
              </div>

              {/* CAMERA */}

              <div className="relative overflow-hidden rounded-2xl bg-black min-h-[360px]">
                <div id="reader" className="w-full" />

                {/* SCAN FRAME */}

                {cameraActive && !loading && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />

                      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />

                      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />

                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

                      <div className="absolute left-3 right-3 top-1/2 h-0.5 bg-blue-500 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              {/* CAMERA ERROR */}

              {cameraError && (
                <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200">
                  <div className="flex gap-3">
                    <div className="text-xl">⚠️</div>

                    <div className="flex-1">
                      <p className="font-semibold text-red-700">
                        Kamera bermasalah
                      </p>

                      <p className="text-sm text-red-600 mt-1">{cameraError}</p>

                      <button
                        type="button"
                        onClick={retryCamera}
                        className="mt-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
                      >
                        🔄 Coba Aktifkan Kamera
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
                        HASIL
                    ================================================= */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            {/* =================================================
                            WAITING / ERROR
                        ================================================= */}

            {!siswa && !loading && (
              <div className="min-h-[450px] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-5xl mb-6">
                  {messageType === "error" ? "⚠️" : "🪪"}
                </div>

                <h2 className="text-2xl font-bold text-slate-800">
                  {messageType === "error" ? "Absensi Gagal" : "Menunggu Scan"}
                </h2>

                <p className="text-slate-500 max-w-sm mt-2">
                  {messageType === "error"
                    ? "Silakan scan QR siswa kembali."
                    : "Arahkan QR Code ID Card siswa ke kamera."}
                </p>

                {/* ERROR MESSAGE */}
              </div>
            )}

            {/* =================================================
                            LOADING
                        ================================================= */}

            {loading && (
              <div className="min-h-[450px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

                <h2 className="text-xl font-bold text-slate-800 mt-6">
                  Memproses Absensi
                </h2>

                <p className="text-sm text-slate-500 mt-2">Mohon tunggu...</p>
              </div>
            )}

            {/* =================================================
                            SISWA
                        ================================================= */}

            {siswa && !loading && (
              <div>
                {/* SUCCESS */}

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl text-emerald-600">
                    ✓
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Absensi Berhasil
                    </h2>

                    <p className="text-sm text-emerald-600">
                      Data berhasil disimpan
                    </p>
                  </div>
                </div>

                {/* FOTO */}

                <div className="flex justify-center mb-6">
                  {siswa.image_profile ? (
                    <img
                      src={repo + siswa.image_profile}
                      alt={siswa.name}
                      className="w-36 h-36 object-cover rounded-3xl shadow-xl"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-3xl bg-slate-100 flex items-center justify-center text-6xl">
                      👤
                    </div>
                  )}
                </div>

                {/* NAMA */}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {siswa.name}
                  </h3>

                  <p className="text-slate-500 mt-1">NIS : {siswa.nis}</p>
                </div>

                {/* INFO */}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <p className="text-xs text-slate-400">Kelas</p>

                    <p className="font-semibold text-slate-700 mt-1">
                      {siswa.nama_kelas}|{siswa.jurusan}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50">
                    <p className="text-xs text-emerald-500">Status</p>

                    <p className="font-bold text-emerald-600 mt-1">Hadir</p>
                  </div>
                </div>

                {/* JAM */}

                <div className="mt-3 p-5 rounded-2xl bg-blue-50">
                  <p className="text-xs text-blue-500">Waktu Absensi</p>

                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    {time.toLocaleTimeString()}
                  </p>
                </div>

                {/* MESSAGE */}

                {message && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-sm text-center">
                    {message}
                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={scanLagi}
                  className="w-full mt-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold shadow-lg shadow-blue-200 transition-all"
                >
                  🔄 Scan Siswa Berikutnya
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
