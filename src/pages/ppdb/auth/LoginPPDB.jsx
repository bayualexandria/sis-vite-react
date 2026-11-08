import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  FileText,
  Award,
  ShieldCheck,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import api from "../../../utils/repositories";
import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toastElement) => {
    toastElement.onmouseenter = Swal.stopTimer;
    toastElement.onmouseleave = Swal.resumeTimer;
  },
});

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-3.5 w-3.5 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>

      {message}
    </p>
  );
};

export default function LoginPPDB() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const [user, setUser] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response = await api.post("auth/ppdb/login", {
        username: email,
        password: password,
      });

      setIsLoading(false);
      console.log("Login response:", response.data);
      localStorage.setItem("is_logged_in_ppdb", "true");
      localStorage.setItem("username", JSON.stringify(email.trim()));
      setUser(true);
    } catch (error) {
      console.log("Login error:", error.response.data);

      if (error.response.data.status === 401) {
        setIsLoading(false);
        setError(error.response.data.message || "Email atau kata sandi salah.");
      }
      if (error.response.data.status === 403) {
        setIsLoading(false);
        toast.fire({
          icon: "error",
          title:
            error.response.data.message || "Akun Anda tidak memiliki akses.",
        });

        return;
      } else {
        setError(
          error.response.data.message || "Terjadi kesalahan saat login.",
        );
        setIsLoading(false);
      }
    }
  };

  if (user) {
    return <Navigate to="/ppdb/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans overflow-hidden">
      {/* BAGIAN KIRI: Ilustrasi & Animasi Icon Bergerak */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-12 flex-col justify-between relative overflow-hidden text-white"
      >
        {/* Background Decorative Circles dengan Animasi Bergerak */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Floating Animated Badge Icons di Sisi Kiri */}
        {/* Icon 1: Dokumen / Berkas */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-16 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 z-20"
        >
          <div className="p-2 bg-blue-500 rounded-xl text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">Verifikasi Berkas</p>
            <p className="text-blue-200">100% Online & Aman</p>
          </div>
        </motion.div>

        {/* Icon 2: Penghargaan / Prestasi */}
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-28 right-12 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 z-20"
        >
          <div className="p-2 bg-emerald-500 rounded-xl text-white">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">Jalur Prestasi</p>
            <p className="text-blue-200">Akademik & Non-Akademik</p>
          </div>
        </motion.div>

        {/* Icon 3: Keamanan / Akreditasi */}
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-1/2 right-8 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center gap-2 z-20"
        >
          <ShieldCheck className="w-5 h-5 text-indigo-300" />
          <span className="text-xs font-medium text-white">
            Terakreditasi A
          </span>
        </motion.div>

        {/* Logo / Header Brand */}
        <div className="flex items-center gap-3 z-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
          >
            <GraduationCap className="w-8 h-8 text-blue-300" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">PPDB Online</h1>
            <p className="text-xs text-blue-200">
              Sistem Penerimaan Peserta Didik Baru
            </p>
          </div>
        </div>

        {/* Center Content dengan Efek Floating */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="z-10 my-auto space-y-6 max-w-md"
        >
          <div>
            <span className="px-3 py-1 bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              Tahun Ajaran 2026/2027
            </span>
            <h2 className="text-4xl font-extrabold mt-4 leading-tight">
              Mulai Langkah Awal Masa Depan Cerah Bersama Kami.
            </h2>
            <p className="text-blue-100/80 mt-3 text-sm leading-relaxed">
              Daftarkan diri Anda dengan mudah melalui portal terintegrasi.
              Pantau status seleksi secara real-time kapan saja dan di mana
              saja.
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-3 pt-2">
            {[
              "Pendaftaran jalur Zonasi, Prestasi & Afirmasi",
              "Verifikasi berkas secara online dan transparan",
              "Pengumuman hasil seleksi langsung via portal",
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-sm text-blue-100"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="z-10 text-xs text-blue-300/70">
          &copy; 2026 Panitia PPDB Nasional. All rights reserved.
        </div>
      </motion.div>

      {/* BAGIAN KANAN: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">PPDB Online</h1>
              <p className="text-xs text-slate-500">Tahun Ajaran 2026/2027</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Selamat Datang! 👋
            </h2>
            <p className="text-sm text-slate-500">
              Masukkan no. registrasi dan kata sandi akun calon siswa Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                No. Registrasi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="No. Registrasi"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
              <ErrorMessage message={error.username} />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <a
                  href="#forgot"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Lupa sandi?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
              <ErrorMessage message={error.password} />
            </div>

            {/* Submit Button */}
            <motion.button
              animate={{
                boxShadow: [
                  "0px 10px 20px rgba(37, 99, 235, 0.2)",
                  "0px 10px 25px rgba(37, 99, 235, 0.4)",
                  "0px 10px 20px rgba(37, 99, 235, 0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Prompt */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Belum punya akun pendaftaran?{" "}
              <Link
                to="/ppdb/register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
