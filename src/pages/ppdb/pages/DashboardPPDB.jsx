import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Bell,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Menu,
  Sparkles,
} from "lucide-react";
import Main from "./components/Main";
import api from "../../../utils/repositories";

export default function DashboardPPDB() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [calonSiswa, setCalonSiswa] = useState({});

  // ============================================================
  // USERNAME & FETCH DATA
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
  }, [getUserData, getDataCalonSiswa]);

  // ============================================================
  // LOGIKA STATUS DINAMIS BERDASARKAN DATA `calonSiswa`
  // ============================================================

  // Cek apakah data calon siswa sudah ada (objek tidak kosong)
  const hasDataSiswa = Boolean(
    calonSiswa &&
    typeof calonSiswa === "object" &&
    Object.keys(calonSiswa).length > 0,
  );

  // Status berkas dari backend (misal: "Verifikasi Berkas", "Diterima", "Pending", dll)
  const statusBerkasBackend = (
    calonSiswa.status_berkas ||
    calonSiswa.status ||
    ""
  ).toLowerCase();

  const getStepStatus = (stepName) => {
    if (stepName === "Pendaftaran Akun") {
      return "completed";
    }

    if (stepName === "Pengisian Biodata & Berkas") {
      // Jika data siswa sudah ada dari API, otomatis completed
      return hasDataSiswa ? "completed" : "current";
    }

    if (stepName === "Verifikasi Berkas Panitia") {
      if (!hasDataSiswa) return "upcoming";
      // Jika status backend sudah selesai/diterima/verified
      if (
        statusBerkasBackend.includes("diterima") ||
        statusBerkasBackend.includes("selesai") ||
        statusBerkasBackend.includes("verified") ||
        calonSiswa.verifikasi_panitia_status === "completed"
      ) {
        return "completed";
      }
      return "current"; // Masih dalam tahap verifikasi
    }

    if (stepName === "Tes Seleksi / Wawancara") {
      if (!hasDataSiswa) return "upcoming";
      if (
        statusBerkasBackend.includes("lulus tes") ||
        statusBerkasBackend.includes("wawancara selesai")
      ) {
        return "completed";
      }
      return statusBerkasBackend.includes("tes") ? "current" : "upcoming";
    }

    if (stepName === "Pengumuman Hasil Akhir") {
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

  // Kalkulasi data statistik tampilan
  const studentData = {
    jalur: calonSiswa.jalur_pendaftaran || "Jalur Reguler / Prestasi",
    status: hasDataSiswa
      ? calonSiswa.status_berkas || "Verifikasi Berkas"
      : "Belum Mengisi Biodata",
    progres: hasDataSiswa ? calonSiswa.progres || 65 : 30,
  };

  // Tahapan Pendaftaran Dinamis
  const timelineSteps = [
    {
      title: "Pendaftaran Akun",
      status: getStepStatus("Pendaftaran Akun"),
      date: "10 Mei 2026",
    },
    {
      title: "Pengisian Biodata & Berkas",
      status: getStepStatus("Pengisian Biodata & Berkas"),
      date: "12 Mei 2026",
    },
    {
      title: "Verifikasi Berkas Panitia",
      status: getStepStatus("Verifikasi Berkas Panitia"),
      date: "14 - 18 Mei 2026",
    },
    {
      title: "Tes Seleksi / Wawancara",
      status: getStepStatus("Tes Seleksi / Wawancara"),
      date: "22 Mei 2026",
    },
    {
      title: "Pengumuman Hasil Akhir",
      status: getStepStatus("Pengumuman Hasil Akhir"),
      date: "30 Mei 2026",
    },
  ];

  return (
    <Main>
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dashboard Utama
              </h2>
              <p className="text-xs text-slate-500">Tahun Ajaran 2026/2027</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          {/* BANNER WELCOME */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10"
          >
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-semibold rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Selamat Datang Kembali
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                Halo, {loading ? "Loading..." : user.nama_lengkap || "User"}! 👋
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                {hasDataSiswa
                  ? "Berkas pendaftaran Anda saat ini sedang dalam proses pemeriksaan oleh panitia PPDB. Pastikan untuk mengecek pengumuman secara berkala."
                  : "Silakan lengkapi biodata dan unggah berkas pendaftaran Anda untuk melanjutkan proses seleksi."}
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </motion.div>

          {/* GRID KARTU STATISTIK & STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Pendaftaran */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status Berkas
                </span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                  {studentData.status}
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  {hasDataSiswa
                    ? "Sedang ditinjau oleh panitia seleksi daerah."
                    : "Menunggu pengisian data mandiri."}
                </p>
              </div>
            </motion.div>

            {/* Jalur Pendaftaran */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Jalur PPDB
                </span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {studentData.jalur}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Nomor: {loading ? "Loading..." : user.username || "N/A"}
                </p>
              </div>
            </motion.div>

            {/* Progres Pendaftaran */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Progres Kelengkapan
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {studentData.progres}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${studentData.progres}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-blue-600 h-full rounded-full"
                />
              </div>
              <p className="text-xs text-slate-500">
                {hasDataSiswa
                  ? "Langkah berikutnya: Verifikasi / Tes Seleksi"
                  : "Langkah berikutnya: Isi Biodata & Berkas"}
              </p>
            </motion.div>
          </div>

          {/* MAIN SECTION: TIMELINE & QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TIMELINE ALUR PENDAFTARAN */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Alur Pendaftaran PPDB
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tahapan seleksi calon peserta didik
                  </p>
                </div>
              </div>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";

                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Circle Dot Indicator */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                          isCompleted
                            ? "border-emerald-500 text-emerald-500"
                            : isCurrent
                              ? "border-blue-600 text-blue-600 ring-4 ring-blue-50"
                              : "border-slate-300 text-slate-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                        ) : (
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isCurrent
                                ? "bg-blue-600 animate-ping"
                                : "bg-transparent"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content Detail */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-semibold ${
                              isCurrent
                                ? "text-blue-600 font-bold"
                                : "text-slate-800"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">
                            {step.date}
                          </span>
                        </div>
                        {isCurrent && (
                          <p className="text-xs text-slate-500 mt-1 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                            {step.title === "Pengisian Biodata & Berkas"
                              ? "Silakan lengkapi formulir biodata dan berkas pendaftaran Anda."
                              : "Berkas Anda sedang dalam proses verifikasi tim administratif."}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK ACTIONS & PENGUMUMAN */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900">
                  Kartu Peserta
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cetak kartu tanda peserta PPDB sebagai syarat mengikuti tes
                  seleksi offline/online.
                </p>
                <button className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
                  <Download className="w-4 h-4" />
                  <span>Unduh Kartu Ujian (PDF)</span>
                </button>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/80 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Informasi Penting
                  </h4>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Batas akhir perbaikan berkas pendaftaran adalah tanggal{" "}
                  <strong>18 Mei 2026</strong> jam 23:59 WIB.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Main>
  );
}
