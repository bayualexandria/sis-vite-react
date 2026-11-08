import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

import logo from "../../assets/images/logo-pendidikan.png";
import LoginViaSocialMedia from "./LoginViaSocialMedia";
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

const InputLabel = ({ htmlFor, children, required = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-slate-700"
    >
      {children}

      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({});
  const [user, setUser] = useState(false);

  const onHandlerSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage({});

    if (!username.trim() || !password) {
      setMessage({
        username: !username.trim() ? "Username wajib diisi." : "",
        password: !password ? "Password wajib diisi." : "",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "auth/login-admin",
        {
          username: username.trim(),
          password,
        },
        {
          withCredentials: true,
        },
      );

      console.log("Login response:", response);

      if (response?.data?.status === 200) {
        localStorage.setItem("username", JSON.stringify(username.trim()));

        localStorage.setItem(
          "id_user",
          JSON.stringify(response?.data?.user?.status_id ?? ""),
        );

        localStorage.setItem("is_logged_in", "true");

        setUser(true);

        return;
      }

      toast.fire({
        icon: "error",
        title: response?.data?.message || "Username atau password tidak valid.",
      });
    } catch (error) {
      console.error("Login error:", error);

      const responseData = error?.response?.data;
      const status = responseData?.status;
      const serverMessage = responseData?.message;

      if (status === 401) {
        if (typeof serverMessage === "object" && serverMessage !== null) {
          setMessage(serverMessage);
        } else {
          setMessage({
            general:
              serverMessage ||
              "Username atau password yang Anda masukkan salah.",
          });
        }

        return;
      }

      if (status === 403) {
        toast.fire({
          icon: "error",
          title:
            typeof serverMessage === "string"
              ? serverMessage
              : "Akun Anda tidak memiliki akses.",
        });

        return;
      }

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

      setMessage({
        general:
          typeof serverMessage === "string"
            ? serverMessage
            : "Login gagal. Silakan coba kembali.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/home" replace />;
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

            {/* Main branding */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Portal Administrasi Sekolah
              </div>

              <h2 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Kelola data sekolah
                <br />
                dengan lebih mudah.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-sky-50/90">
                Akses sistem informasi sekolah untuk mengelola data siswa, guru,
                administrasi, dan berbagai kebutuhan sekolah dalam satu tempat.
              </p>
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
            RIGHT SIDE - LOGIN FORM
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

              <p className="mt-1 text-sm text-slate-500">
                Portal Administrasi Sekolah
              </p>
            </div>

            {/* Login Card */}
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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                  Selamat Datang 👋
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Silakan masuk untuk mengakses sistem informasi sekolah.
                </p>
              </div>

              {/* General Error */}
              {message.general && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="mt-0.5 h-5 w-5 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>

                  <span>{message.general}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={onHandlerSubmit} noValidate className="space-y-5">
                {/* Username */}
                <div>
                  <InputLabel htmlFor="username" required>
                    Username
                  </InputLabel>

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
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);

                        if (message.username || message.general) {
                          setMessage((prev) => ({
                            ...prev,
                            username: "",
                            general: "",
                          }));
                        }
                      }}
                      autoComplete="username"
                      placeholder="Masukkan username"
                      disabled={loading}
                      className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        message.username
                          ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                          : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                      }`}
                    />
                  </div>

                  <ErrorMessage message={message.username} />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <InputLabel htmlFor="password" required>
                      Password
                    </InputLabel>

                    <Link
                      to="/forget-password"
                      className="mb-2 text-xs font-semibold text-sky-500 transition hover:text-sky-600"
                    >
                      Lupa password?
                    </Link>
                  </div>

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
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 0h10.5a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18.75v-6A2.25 2.25 0 016.75 10.5z"
                        />
                      </svg>
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);

                        if (message.password || message.general) {
                          setMessage((prev) => ({
                            ...prev,
                            password: "",
                            general: "",
                          }));
                        }
                      }}
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      disabled={loading}
                      className={`w-full rounded-xl border bg-white py-3 pl-11 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        message.password
                          ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                          : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                      className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition hover:text-sky-500 disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
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
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <ErrorMessage message={message.password} />
                </div>

                {/* Login Button */}
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
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0013.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>

                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Sistem</span>

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

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />

                <span className="text-xs font-medium text-slate-400">
                  atau masuk dengan
                </span>

                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Social Login */}
              <LoginViaSocialMedia />
            </div>

            {/* Bottom Text */}
            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Gunakan akun yang telah terdaftar untuk mengakses sistem informasi
              sekolah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
