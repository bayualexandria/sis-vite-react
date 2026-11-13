import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Info,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../utils/repositories";

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

export default function App() {
  // Form State
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    nomorHp: "",
    password: "",
    konfirmasiPassword: "",
  });

  // State untuk menyimpan pesan error pada masing-masing field
  const [errors, setErrors] = useState({
    namaLengkap: "",
    email: "",
    nomorHp: "",
    password: "",
    konfirmasiPassword: "",
    general: "",
  });

  // Password Visibility Controls
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Typewriter Auto-Fill State
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: idle, 1: nama, 2: email, 3: phone, 4: pass, 5: confirm, 6: done
  const [activeFieldHint, setActiveFieldHint] = useState("");

  // Target Values for Auto-Typewriter
  const targetData = {
    namaLengkap: "Budi Santoso",
    email: "ortu.budi@gmail.com",
    nomorHp: "081298765432",
    password: "Password123!",
    konfirmasiPassword: "Password123!",
  };

  const timerRef = useRef(null);

  // Handle manual input change & bersihkan error pada field yang diketik
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isAutoTyping) {
      setIsAutoTyping(false); // Cancel auto-type jika user mengetik manual
    }

    setFormData({ ...formData, [name]: value });

    // Hapus pesan error khusus field yang sedang diubah
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  // Typewriter Logic Sequence
  useEffect(() => {
    if (!isAutoTyping) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const typeField = (field, targetText, nextStep, hintMessage) => {
      setActiveFieldHint(hintMessage);
      let currentLength = formData[field].length;

      if (currentLength < targetText.length) {
        timerRef.current = setTimeout(
          () => {
            setFormData((prev) => ({
              ...prev,
              [field]: targetText.slice(0, currentLength + 1),
            }));
          },
          60 + Math.random() * 40,
        );
      } else {
        timerRef.current = setTimeout(() => {
          setActiveStep(nextStep);
        }, 500);
      }
    };

    switch (activeStep) {
      case 1:
        typeField(
          "namaLengkap",
          targetData.namaLengkap,
          2,
          "Mengisi Nama Lengkap Calon Siswa...",
        );
        break;
      case 2:
        typeField(
          "email",
          targetData.email,
          3,
          "Mengisi Email Orang Tua / Wali...",
        );
        break;
      case 3:
        typeField(
          "nomorHp",
          targetData.nomorHp,
          4,
          "Mengisi Nomor WhatsApp Orang Tua / Wali...",
        );
        break;
      case 4:
        typeField(
          "password",
          targetData.password,
          5,
          "Mengisi Kata Sandi Akun...",
        );
        break;
      case 5:
        typeField(
          "konfirmasiPassword",
          targetData.konfirmasiPassword,
          6,
          "Mengonfirmasi Kata Sandi...",
        );
        break;
      case 6:
        setActiveFieldHint("Formulir Siap Dikirim! 🔥");
        setIsAutoTyping(false);
        break;
      default:
        break;
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAutoTyping, activeStep, formData]);

  // Start / Restart Auto Typewriter Demo
  const startAutoType = () => {
    setErrors({
      namaLengkap: "",
      email: "",
      nomorHp: "",
      password: "",
      konfirmasiPassword: "",
      general: "",
    });
    setFormData({
      namaLengkap: "",
      email: "",
      nomorHp: "",
      password: "",
      konfirmasiPassword: "",
    });
    setActiveStep(1);
    setIsAutoTyping(true);
  };

  // Reset Form
  const resetForm = () => {
    setIsAutoTyping(false);
    setActiveStep(0);
    setActiveFieldHint("");
    setErrors({
      namaLengkap: "",
      email: "",
      nomorHp: "",
      password: "",
      konfirmasiPassword: "",
      general: "",
    });
    setFormData({
      namaLengkap: "",
      email: "",
      nomorHp: "",
      password: "",
      konfirmasiPassword: "",
    });
  };

  // Validasi Form Sisi Client
  const validateForm = () => {
    let newErrors = {
      namaLengkap: "",
      email: "",
      nomorHp: "",
      password: "",
      konfirmasiPassword: "",
      general: "",
    };
    let isValid = true;

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama lengkap siswa wajib diisi.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email orang tua/wali wajib diisi.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid (contoh: ortu@gmail.com).";
      isValid = false;
    }

    if (!formData.nomorHp.trim()) {
      newErrors.nomorHp = "Nomor WhatsApp/HP wajib diisi.";
      isValid = false;
    } else if (formData.nomorHp.length < 9) {
      newErrors.nomorHp = "Nomor WhatsApp minimal 9 digit angka.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Kata sandi wajib diisi.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Kata sandi minimal 8 karakter.";
      isValid = false;
    }

    if (!formData.konfirmasiPassword) {
      newErrors.konfirmasiPassword = "Konfirmasi kata sandi wajib diisi.";
      isValid = false;
    } else if (formData.password !== formData.konfirmasiPassword) {
      newErrors.konfirmasiPassword = "Konfirmasi kata sandi tidak cocok.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Jalankan validasi lokal terlebih dahulu
    if (!validateForm()) return;

    setIsLoading(true);

    // Menggunakan FormData agar sesuai dengan backend yang meminta multipart/form-data
    const dataForm = new FormData();
    dataForm.append("nama_lengkap", formData.namaLengkap);
    dataForm.append("email", formData.email);
    dataForm.append("nomor_hp", formData.nomorHp);
    dataForm.append("password", formData.password);
    dataForm.append("konfirmasi_password", formData.konfirmasiPassword);

    try {
      // Axios atau fetch repository wrapper akan otomatis mengatur header 'multipart/form-data'
      // ketika mendeteksi objek instance FormData()
      let response = await api.post(`auth/ppdb/register`, dataForm);
      setIsLoading(false);

      // SweetAlert2 Tampilan Berhasil
      toast.fire({
        icon: "success",
        title: response?.data?.message || "Username atau password tidak valid.",
      });

      resetForm();
    } catch (error) {
      setIsLoading(false);
      console.error("Error during registration:", error.response || error);

      const errData = error.response?.data;

      if (errData && typeof errData === "object") {
        setErrors((prev) => ({
          ...prev,
          namaLengkap: errData.nama_lengkap || errData.namaLengkap || "",
          email: errData.email || "",
          nomorHp: errData.nomor_hp || errData.nomorHp || "",
          password: errData.password || "",
          konfirmasiPassword:
            errData.konfirmasi_password || errData.konfirmasiPassword || "",
          general:
            errData.message ||
            errData.error ||
            "Gagal mendaftar, periksa kembali inputan Anda.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            error.message ||
            "Terjadi kesalahan pada server atau koneksi terputus.",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-100 font-sans overflow-hidden">
      {/* ================= SISI KIRI: Showcase & Floating Icons ================= */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden text-white select-none"
      >
        {/* Background Decorative Glowing Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"
        />

        {/* Floating Interactive Badges */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-14 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 z-20"
        >
          <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-md">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">Akun Calon Siswa</p>
            <p className="text-blue-200">Terintegrasi Data Dapodik</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -4, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-24 right-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 z-20"
        >
          <div className="p-2.5 bg-blue-500 rounded-xl text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">Verifikasi Terjamin</p>
            <p className="text-blue-200">Koneksi Enkripsi SSL 256-bit</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, 10, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-1/2 right-6 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center gap-2.5 z-20"
        >
          <BadgeCheck className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-medium text-white">
            Terakreditasi A Resmi
          </span>
        </motion.div>

        {/* Brand Header */}
        <div className="flex items-center gap-3.5 z-10">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
          >
            <GraduationCap className="w-8 h-8 text-blue-300" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">PPDB Online</h1>
            <p className="text-xs text-blue-200 font-medium">
              Sistem Penerimaan Peserta Didik Baru
            </p>
          </div>
        </div>

        {/* Main Banner Message */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="z-10 my-auto space-y-6 max-w-md"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Pendaftaran Akun 2026/2027
            </span>
            <h2 className="text-4xl font-extrabold mt-4 leading-tight tracking-tight">
              Bergabunglah Menjadi Bagian Dari Generasi Unggul.
            </h2>
            <p className="text-blue-100/80 mt-3 text-sm leading-relaxed">
              Daftarkan diri Anda dengan cepat dan mudah. Gunakan data email dan
              nomor WhatsApp orang tua/wali untuk verifikasi notifikasi seleksi.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            {[
              "Data Nama Siswa disesuaikan dengan Ijazah/Akte",
              "Nomor WhatsApp Ortu aktif untuk pengumuman hasil",
              "Keamanan kata sandi dan berkas pendaftaran terjaga",
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
        <div className="z-10 text-xs text-blue-300/70 flex justify-between items-center">
          <span>&copy; 2026 Panitia PPDB Nasional</span>
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Portal Resmi
          </span>
        </div>
      </motion.div>

      {/* ================= SISI KANAN: Form & Typewriter Auto Demo ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-5 bg-white p-7 sm:p-9 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 my-auto relative"
        >
          {/* Typewriter Demo Control Bar */}
          <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isAutoTyping ? "bg-emerald-400" : "bg-blue-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isAutoTyping ? "bg-emerald-500" : "bg-blue-600"
                  }`}
                ></span>
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {isAutoTyping ? "Demo Mengetik Aktif" : "Mode Demo Auto-Isi"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {!isAutoTyping ? (
                <button
                  onClick={startAutoType}
                  type="button"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="Mulai animasi mengetik otomatis"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ketik Otomatis</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAutoTyping(false)}
                  type="button"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="Hentikan sementara"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Jeda</span>
                </button>
              )}

              <button
                onClick={resetForm}
                type="button"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
                title="Bersihkan Form"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner Error Umum (jika ada error server global) */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errors.general}</span>
            </motion.div>
          )}

          {/* Active Auto-Typing Hint Banner */}
          <AnimatePresence>
            {activeFieldHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3.5 py-2 bg-indigo-600 text-white text-xs rounded-xl flex items-center justify-between font-medium shadow-sm">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                    {activeFieldHint}
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                    Demo
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">PPDB Online</h1>
              <p className="text-xs text-slate-500">Tahun Ajaran 2026/2027</p>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Buat Akun Baru 🚀
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Isi formulir untuk mendaftarkan akun PPDB calon siswa.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. NAMA LENGKAP SISWA */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                  Siswa
                </span>
              </div>
              <div className="relative">
                <span
                  className={`absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none ${
                    errors.namaLengkap ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.namaLengkap
                      ? "border-red-400 bg-red-50/20 focus:ring-red-400/20 focus:border-red-500"
                      : activeStep === 1
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                        : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                  }`}
                />
                {isAutoTyping && activeStep === 1 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-blue-600 animate-pulse rounded-sm" />
                )}
              </div>
              {errors.namaLengkap ? (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.namaLengkap}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Sesuai ijazah SMP/MTS atau Akta Kelahiran.
                </p>
              )}
            </div>

            {/* 2. EMAIL ORANG TUA / WALI */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Ortu / Wali <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                  Email Orang Tua
                </span>
              </div>
              <div className="relative">
                <span
                  className={`absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none ${
                    errors.email ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Contoh: ortu.budi@gmail.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-400 bg-red-50/20 focus:ring-red-400/20 focus:border-red-500"
                      : activeStep === 2
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                        : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                  }`}
                />
                {isAutoTyping && activeStep === 2 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-blue-600 animate-pulse rounded-sm" />
                )}
              </div>
              {errors.email ? (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.email}
                </p>
              ) : (
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  Boleh menggunakan email aktif milik orang tua/wali.
                </p>
              )}
            </div>

            {/* 3. NOMOR WHATSAPP ORANG TUA / WALI */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  No. WhatsApp / HP Ortu <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  WA Orang Tua
                </span>
              </div>
              <div className="relative">
                <span
                  className={`absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none ${
                    errors.nomorHp ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  name="nomorHp"
                  value={formData.nomorHp}
                  onChange={handleChange}
                  placeholder="Contoh: 081298765432"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.nomorHp
                      ? "border-red-400 bg-red-50/20 focus:ring-red-400/20 focus:border-red-500"
                      : activeStep === 3
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                        : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                  }`}
                />
                {isAutoTyping && activeStep === 3 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-blue-600 animate-pulse rounded-sm" />
                )}
              </div>
              {errors.nomorHp ? (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.nomorHp}
                </p>
              ) : (
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  Guna menerima notifikasi bukti kelulusan & verifikasi.
                </p>
              )}
            </div>

            {/* 4. KATA SANDI */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span
                  className={`absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none ${
                    errors.password ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 Karakter"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-400 bg-red-50/20 focus:ring-red-400/20 focus:border-red-500"
                      : activeStep === 4
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                        : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* 5. KONFIRMASI KATA SANDI */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span
                  className={`absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none ${
                    errors.konfirmasiPassword
                      ? "text-red-400"
                      : "text-slate-400"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="konfirmasiPassword"
                  value={formData.konfirmasiPassword}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.konfirmasiPassword
                      ? "border-red-400 bg-red-50/20 focus:ring-red-400/20 focus:border-red-500"
                      : activeStep === 5
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                        : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.konfirmasiPassword && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.konfirmasiPassword}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON WITH GLOW PULSE ANIMATION */}
            <motion.button
              animate={{
                boxShadow: [
                  "0px 6px 15px rgba(37, 99, 235, 0.2)",
                  "0px 8px 25px rgba(37, 99, 235, 0.45)",
                  "0px 6px 15px rgba(37, 99, 235, 0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer pt-3 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Daftar Akun PPDB Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Redirection Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs sm:text-sm text-slate-600">
              Sudah memiliki akun pendaftaran?{" "}
              <Link
                to="/ppdb/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline underline-offset-2"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
