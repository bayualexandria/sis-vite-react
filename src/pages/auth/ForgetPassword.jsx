import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

import logo from "../../assets/images/logo-pendidikan.png";
import api from "../../utils/repositories";

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

function ForgetPassword() {
  const [user] = useState(localStorage.getItem("username"));

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const forgetPassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");

    const emailValue = email.trim();

    // Validasi email kosong
    if (!emailValue) {
      setMessage("Email wajib diisi.");
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      setMessage("Format email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "auth/forgot-password",
        {
          email: emailValue,
        },
        {
          withCredentials: true,
        },
      );

      const responseData = response?.data;

      console.log("Forgot password response:", responseData);

      if (response?.status === 503 || responseData?.status === 503) {
        toast.fire({
          icon: "error",
          title: "Server sedang dalam perbaikan.",
          text: "Silakan coba kembali beberapa saat lagi.",
        });

        return;
      }

      if (response?.status === 401 || responseData?.status === 401) {
        setMessage(
          responseData?.message ||
            "Email tidak ditemukan atau tidak dapat diproses.",
        );

        return;
      }

      if (response?.status === 403 || responseData?.status === 403) {
        toast.fire({
          icon: "error",
          title: responseData?.message || "Permintaan tidak diizinkan.",
        });

        return;
      }

      if (response?.status >= 200 && response?.status < 300) {
        await toast.fire({
          icon: "success",
          title:
            responseData?.message ||
            "Link reset password telah dikirim ke email Anda.",
        });

        setEmail("");

        return;
      }

      toast.fire({
        icon: "error",
        title: responseData?.message || "Permintaan reset password gagal.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);

      const responseData = error?.response?.data;

      if (
        error?.code === "ERR_NETWORK" ||
        error?.message === "Failed to fetch"
      ) {
        toast.fire({
          icon: "error",
          title: "Koneksi ke server terputus.",
          text: "Mohon periksa koneksi internet atau hubungi administrator server.",
        });

        return;
      }

      if (error?.response?.status === 503) {
        toast.fire({
          icon: "error",
          title: "Server sedang dalam perbaikan.",
          text: "Silakan coba kembali beberapa saat lagi.",
        });

        return;
      }

      setMessage(
        responseData?.message || "Terjadi kesalahan. Silakan coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="flex min-h-screen w-full">
        {/* =====================================================
            LEFT SIDE - BRANDING
        ====================================================== */}
        <div className="relative hidden overflow-hidden bg-linear-to-br from-sky-500 via-sky-600 to-cyan-700 lg:flex lg:w-[55%]">
          {/* Decorative circles */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10" />

          <div className="absolute right-20 top-24 h-20 w-20 rounded-full bg-white/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
                <img
                  src={logo}
                  alt="Logo Pendidikan"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-white/80">
                  Sistem Informasi
                </p>

                <h1 className="text-lg font-bold text-white">Sekolah</h1>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 0h10.5a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18.75v-6A2.25 2.25 0 016.75 10.5z"
                  />
                </svg>
                Pemulihan Akun
              </div>

              <h2 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Lupa password?
                <br />
                Jangan khawatir.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-sky-50/90">
                Masukkan alamat email yang terdaftar pada akun Anda. Kami akan
                mengirimkan instruksi untuk membuat password baru.
              </p>

              {/* Information */}
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-5 w-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.02M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </div>

                <p className="text-sm leading-6 text-white/80">
                  Pastikan email yang Anda masukkan masih aktif agar instruksi
                  pemulihan dapat diterima.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>© {new Date().getFullYear()} Sistem Informasi Sekolah</span>

              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                Aman & Terintegrasi
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE - FORM
        ====================================================== */}
        <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:w-[45%] lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex flex-col items-center lg:hidden">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-md ring-1 ring-slate-100">
                <img
                  src={logo}
                  alt="Logo Pendidikan"
                  className="h-full w-full object-contain"
                />
              </div>

              <h1 className="text-xl font-bold text-slate-800">
                Sistem Informasi Sekolah
              </h1>

              <p className="mt-1 text-sm text-slate-500">Pemulihan Akun</p>
            </div>

            {/* Card */}
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 sm:p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 012.25 6.993V6.75"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                  Reset Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Masukkan email akun Anda untuk mendapatkan link reset
                  password.
                </p>
              </div>

              {/* Error */}
              {message && (
                <div className="mb-5">
                  <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="mt-0.5 h-5 w-5 shrink-0 text-rose-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>

                    <span className="text-sm font-medium text-rose-600">
                      {message}
                    </span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={forgetPassword} noValidate className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email
                    <span className="ml-1 text-rose-500">*</span>
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 012.25 6.993V6.75"
                        />
                      </svg>
                    </div>

                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);

                        if (message) {
                          setMessage("");
                        }
                      }}
                      autoComplete="email"
                      placeholder="contoh@email.com"
                      disabled={loading}
                      className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        message
                          ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                          : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                      }`}
                    />
                  </div>

                  <ErrorMessage message={message} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 outline-none transition-all duration-200 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-500/25 focus:ring-4 focus:ring-sky-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5 animate-spin"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>

                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Link Reset Password</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-7 border-t border-slate-100 pt-6">
                <Link
                  to="/login"
                  className="group flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Kembali ke halaman login
                </Link>
              </div>
            </div>

            {/* Bottom Text */}
            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Pastikan Anda memiliki akses ke email yang terdaftar pada akun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
