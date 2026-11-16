import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileCheck2,
  UserCheck,
  ShieldCheck,
  MapPin,
  Award,
  CalendarClock,
} from "lucide-react";
import api from "../../../utils/repositories"; // Sesuaikan path repository Anda
import Main from "./components/Main";

// Varian animasi untuk kontainer & item (Stagger effect)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function StatusSeleksi() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [calonSiswa, setCalonSiswa] = useState({});
  const [pendaftaran, setPendaftaran] = useState({});
  const [sudahLaporDiri, setSudahLaporDiri] = useState(false);

  // ============================================================
  // USERNAME & FETCH DATA (Sesuai DashboardPPDB)
  // ============================================================
  const getUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) return null;
    try {
      return JSON.parse(storedUsername);
    } catch {
      return storedUsername;
    }
  };

  const getUserData = useCallback(async () => {
    const username = getUsername();
    if (!username) {
      setLoading(false);
      navigate("/ppdb/login", { replace: true });
      return;
    }
    try {
      let response = await api.get(`ppdb/user/${username}`, {
        withCredentials: true,
      });
      setUser(response.data.data || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [navigate]);

  const getPendaftaran = useCallback(async () => {
    const username = getUsername();
    if (!username) {
      setLoading(false);
      navigate("/ppdb/login", { replace: true });
      return;
    }
    try {
      let response = await api.get(`ppdb/pendaftaran/${username}`, {
        withCredentials: true,
      });
      setPendaftaran(response.data.data || {});
    } catch (error) {
      console.error("Error fetching pendaftaran data:", error);
    }
  }, [navigate]);

  const getDataCalonSiswa = useCallback(async () => {
    const username = getUsername();
    if (!username) {
      setLoading(false);
      navigate("/ppdb/login", { replace: true });
      return;
    }
    try {
      setLoading(true);
      let response = await api.get(`ppdb/data-siswa/${username}`, {
        withCredentials: true,
      });
      setCalonSiswa(response.data.data || {});
    } catch (error) {
      console.error("Error fetching calon siswa data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getDataCalonSiswa();
    getUserData();
    getPendaftaran();
  }, [getUserData, getDataCalonSiswa, getPendaftaran]);

  // ============================================================
  // LOGIKA STATUS & TAHAPAN DINAMIS (Persis DashboardPPDB)
  // ============================================================
  const hasDataSiswa = Boolean(
    calonSiswa &&
    typeof calonSiswa === "object" &&
    Object.keys(calonSiswa).length > 0,
  );

  const statusBerkasBackend = (
    calonSiswa.status_berkas ||
    calonSiswa.status ||
    ""
  ).toLowerCase();

  const isVerifikasiPanitiaCompleted =
    hasDataSiswa &&
    (pendaftaran?.status_verifikasi === "Diverifikasi" ||
      statusBerkasBackend.includes("diterima") ||
      statusBerkasBackend.includes("selesai") ||
      statusBerkasBackend.includes("verified") ||
      calonSiswa.verifikasi_panitia_status === "completed");

  const getStepStatus = (stepName) => {
    if (stepName === "Pendaftaran Akun") {
      return "completed";
    }

    if (stepName === "Pengisian Biodata & Berkas") {
      return hasDataSiswa ? "completed" : "current";
    }

    if (stepName === "Verifikasi Berkas Panitia") {
      if (!hasDataSiswa) return "upcoming";
      if (isVerifikasiPanitiaCompleted) {
        return "completed";
      }
      return "current";
    }

    if (stepName === "Tes Seleksi / Wawancara") {
      if (!isVerifikasiPanitiaCompleted) return "upcoming";

      if (
        statusBerkasBackend.includes("lulus tes") ||
        statusBerkasBackend.includes("wawancara selesai")
      ) {
        return "completed";
      }

      return "current";
    }

    if (stepName === "Pengumuman Hasil Akhir") {
      const isTesSeleksiCompleted =
        statusBerkasBackend.includes("lulus tes") ||
        statusBerkasBackend.includes("wawancara selesai");

      if (!isTesSeleksiCompleted) return "upcoming";

      if (
        statusBerkasBackend.includes("diterima") ||
        statusBerkasBackend.includes("lulus")
      ) {
        return "completed";
      }
      return "upcoming";
    }

    return "upcoming";
  };

  const stepsList = [
    { title: "Pendaftaran Akun", status: getStepStatus("Pendaftaran Akun") },
    {
      title: "Pengisian Biodata & Berkas",
      status: getStepStatus("Pengisian Biodata & Berkas"),
    },
    {
      title: "Verifikasi Berkas Panitia",
      status: getStepStatus("Verifikasi Berkas Panitia"),
    },
    {
      title: "Tes Seleksi / Wawancara",
      status: getStepStatus("Tes Seleksi / Wawancara"),
    },
    {
      title: "Pengumuman Hasil Akhir",
      status: getStepStatus("Pengumuman Hasil Akhir"),
    },
  ];

  const completedCount = stepsList.filter(
    (s) => s.status === "completed",
  ).length;
  const currentStageIndicator = Math.min(
    completedCount + (stepsList.some((s) => s.status === "current") ? 1 : 0),
    5,
  );

  const isDiterima =
    statusBerkasBackend.includes("diterima") ||
    statusBerkasBackend.includes("lulus") ||
    pendaftaran?.status_verifikasi === "Diverifikasi";

  const isDitolak =
    statusBerkasBackend.includes("ditolak") ||
    statusBerkasBackend.includes("tidak lolos");

  return (
    <Main>
      {" "}
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
        {/* Header / Hero */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-12 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Portal Pengumuman Status Seleksi PPDB
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Cek Status Kelulusan Anda
            </h1>
          </motion.div>
        </section>

        {/* Main Container */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 space-y-6">
          {/* KARTU 1: TAHAPAN PENDAFTARAN PPDB DENGAN ANIMASI STAGGER */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tahapan Pendaftaran PPDB
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Tahap {currentStageIndicator} dari 5
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
            >
              {stepsList.map((step, idx) => {
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "current";

                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`p-4 rounded-2xl border flex flex-col items-center text-center justify-between gap-3 transition-colors ${
                      isCurrent
                        ? "bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/10 shadow-xs"
                        : isCompleted
                          ? "bg-emerald-50/30 border-emerald-300"
                          : "bg-slate-50/50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-xs"
                          : isCurrent
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4 animate-spin" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold leading-snug ${isCurrent ? "text-blue-700 font-bold" : "text-slate-800"}`}
                    >
                      {step.title}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* KARTU 2: STATUS HASIL SELEKSI */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
          >
            {/* Banner Status Header */}
            <div
              className={`px-6 py-5 flex items-center gap-3.5 ${
                isDiterima
                  ? "bg-emerald-600 text-white"
                  : isDitolak
                    ? "bg-rose-600 text-white"
                    : "bg-amber-500 text-white"
              }`}
            >
              {isDiterima && <CheckCircle2 className="w-8 h-8 shrink-0" />}
              {isDitolak && <XCircle className="w-8 h-8 shrink-0" />}
              {!isDiterima && !isDitolak && (
                <Clock className="w-8 h-8 shrink-0" />
              )}
              <div>
                <p className="text-xs uppercase tracking-wider opacity-90 font-medium">
                  Status Hasil Seleksi
                </p>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  {isDiterima
                    ? "SELAMAT! ANDA DINYATAKAN DITERIMA"
                    : isDitolak
                      ? "BELUM LOLOS SELEKSI TAHAP INI"
                      : "BERKAS DALAM PROSES VERIFIKASI"}
                </h2>
              </div>
            </div>

            {/* Detail Informasi Siswa */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">
                    No. Pendaftaran / NISN
                  </span>
                  <span className="font-bold text-slate-900 text-base">
                    {loading ? "Loading..." : user.username || "PPDB-2026-001"}{" "}
                    / {calonSiswa.nisn || "0098765432"}
                    {console.log(calonSiswa)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">
                    Nama Lengkap
                  </span>
                  <span className="font-bold text-slate-900 text-base">
                    {loading
                      ? "Loading..."
                      : user.nama_lengkap || "Ahmad Rizky Pratama"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">
                    Sekolah Tujuan & Jalur
                  </span>
                  <span className="font-bold text-blue-700 flex items-center gap-1.5 mt-0.5 text-sm sm:text-base">
                    <Award className="w-4 h-4 shrink-0" />
                    {calonSiswa.sekolah_tujuan || "SMA Negeri 1"} — Jalur{" "}
                    {calonSiswa.jalur_pendaftaran || "Zonasi"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">
                    Asal Sekolah
                  </span>
                  <span className="font-semibold text-slate-800 text-base">
                    {calonSiswa.sekolah_asal || "SMP Negeri 2"}
                  </span>
                </div>
              </div>

              {/* Keterangan Skor / Jarak */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">
                    Keterangan Skor / Pemeringkatan
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {pendaftaran?.keterangan_skor ||
                      "Jarak Domisili & Verifikasi Berkas Sesuai Ketentuan Zonasi"}
                  </p>
                </div>
              </div>

              {/* Catatan Panitia */}
              <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 leading-relaxed">
                <strong className="text-slate-800">Catatan Panitia: </strong>
                {pendaftaran?.catatan_verifikasi ||
                  "Seluruh berkas persyaratan telah diperiksa dan disesuaikan dengan ketentuan panitia seleksi."}
              </div>

              {/* Tombol Cetak / Unduh Bukti */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / Unduh Bukti Kelulusan
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* KARTU 3: INFORMASI DAFTAR ULANG (Khusus jika Diterima) */}
          {isDiterima && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2.5 text-emerald-700">
                <CalendarClock className="w-6 h-6" />
                <h3 className="font-bold text-base sm:text-lg">
                  Informasi Daftar Ulang (Lapor Diri)
                </h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 font-medium">
                <strong>Batas Akhir Lapor Diri:</strong> 30 Mei 2026, Pukul
                23.59 WIT. Peserta yang tidak melakukan lapor diri dianggap
                mengundurkan diri.
              </div>

              <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800">
                  Dokumen Persyaratan Wajib yang Dibawa ke Sekolah:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Scan & Fotokopi Ijazah / SKL Asli</li>
                  <li>Kartu Keluarga (KK) Asli & Fotokopi</li>
                  <li>Akta Kelahiran & KTP Orang Tua / Wali</li>
                  <li>Pas Foto berwarna terbaru latar belakang merah/biru</li>
                </ul>
              </div>

              {sudahLaporDiri ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5 shrink-0" />
                  Konfirmasi Lapor Diri Online Berhasil Tercatat!
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => setSudahLaporDiri(true)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileCheck2 className="w-5 h-5" />
                  Konfirmasi Lapor Diri Online Sekarang
                </motion.button>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </Main>
  );
}
