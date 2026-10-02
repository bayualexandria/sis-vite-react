import { useCallback, useEffect, useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

import Main from "../../../components/Main/Main";
import repo from "../../../utils/repo";
import repoimages from "../../../utils/repoimages";
import api from "../../../utils/repositories";

const SwalReact = withReactContent(Swal);

/* ============================================================
   ICON
============================================================ */

function SchoolIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 21h18M4.5 21V10.5L12 5l7.5 5.5V21M8 21v-7h3v7m2 0v-7h3v7M3 10.5l9-7 9 7"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372a1.5 1.5 0 0 0-1.014-1.421l-4.423-1.474a1.5 1.5 0 0 0-1.68.548l-.97 1.293a12.04 12.04 0 0 1-5.508-5.508l1.293-.97a1.5 1.5 0 0 0 .548-1.68L8.472 4.493A1.5 1.5 0 0 0 7.051 3.48H5.25A2.25 2.25 0 0 0 3 5.73v1.02Z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );
}

function AccreditationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 12.75 2.25 2.25L15 11.25M12 3l2.5 1.5 2.9-.1.9 2.75 2.1 2-.9 2.75.9 2.75-2.1 2-.9 2.75-2.9-.1L12 21l-2.5-1.5-2.9.1-.9-2.75-2.1-2 .9-2.75-.9-2.75 2.1-2 .9-2.75 2.9.1L12 3Z"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3v5h8V3M7 21v-6h10v6"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="h-5 w-5 animate-spin"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364-2.121 2.121M7.757 16.243l-2.121 2.121m0-12.728 2.121 2.121m8.486 8.486 2.121 2.121"
      />
    </svg>
  );
}

/* ============================================================
   FORM FIELD
============================================================ */

function FormField({ label, id, children, required = false }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {children}
    </div>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700 dark:text-slate-200">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Spinner />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Memuat data sekolah
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SWEET ALERT THEME
============================================================ */

function getSwalTheme() {
  const isDark = document.documentElement.classList.contains("dark");

  return {
    background: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#334155",
  };
}

/* ============================================================
   SEKOLAH
============================================================ */

export default function Sekolah() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [namaSekolah, setNamaSekolah] = useState("");
  const [akreditasi, setAkreditasi] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [alamat, setAlamat] = useState("");

  /*
   * ============================================================
   * DARK MODE
   * ============================================================
   */
  const getDarkMode = () => {
    return (
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark")
    );
  };
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode);

  const onImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Format gambar tidak valid. Gunakan PNG, JPG, JPEG, atau WEBP.");

      e.target.value = "";

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 2 MB.");

      e.target.value = "";

      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  /* ==========================================================
     AMBIL DATA SEKOLAH
  ========================================================== */

  const userProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${repo}api/profile-sekolah`);

      const data = response?.data?.data;

      if (!data) {
        throw new Error("Data profile sekolah tidak ditemukan.");
      }

      setSekolah(data);

      setNamaSekolah(data.nama_sekolah ?? "");
      setAkreditasi(data.akreditasi ?? "");
      setNoTelp(data.no_telp ?? "");
      setAlamat(data.alamat_sekolah ?? data.alamat ?? "");
    } catch (error) {
      console.error("Gagal mengambil data sekolah:", error);

      const theme = getSwalTheme();

      await SwalReact.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Data sekolah gagal dimuat.",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#2563eb",
        background: theme.background,
        color: theme.color,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    userProfile();
    const html = document.documentElement;
    const body = document.body;
    const updateTheme = () => {
      setIsDarkMode(
        html.classList.contains("dark") || body.classList.contains("dark"),
      );
    };

    updateTheme();
  }, [userProfile]);

  /* ==========================================================
     UPDATE PROFILE SEKOLAH
  ========================================================== */

  const updateProfileSekolah = async (e) => {
    e.preventDefault();

    const theme = getSwalTheme();

    if (!namaSekolah.trim()) {
      await SwalReact.fire({
        icon: "warning",
        title: "Nama sekolah belum diisi",
        text: "Silakan masukkan nama sekolah terlebih dahulu.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#2563eb",
        background: theme.background,
        color: theme.color,
      });

      return;
    }

    if (!akreditasi) {
      await SwalReact.fire({
        icon: "warning",
        title: "Akreditasi belum dipilih",
        text: "Silakan pilih akreditasi sekolah.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#2563eb",
        background: theme.background,
        color: theme.color,
      });

      return;
    }

    const formData = new FormData();
    formData.append("nama_sekolah", namaSekolah);
    formData.append("akreditasi", akreditasi);
    formData.append("no_telp", noTelp);
    formData.append("alamat", alamat);
    // ketika tidak upload gambar, maka tidak perlu mengirim field image_profile
    if (image) {
      formData.append("image_profile", image);
    }

    try {
      setSaving(true);

      const response = await api.patch(`profile-sekolah`, formData);

      setSekolah((prev) => ({
        ...prev,
        nama_sekolah: namaSekolah.trim(),
        akreditasi,
        no_telp: noTelp.trim(),
        image_profile:
          response?.data?.data?.image_profile || prev.image_profile,
        alamat_sekolah: alamat.trim(),
      }));

      await SwalReact.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profile sekolah berhasil diperbarui.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
        background: theme.background,
        color: theme.color,
      });
    } catch (error) {
      console.error("Gagal memperbarui profile sekolah:", error);

      await SwalReact.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text:
          error?.message ||
          "Terjadi kesalahan saat memperbarui profile sekolah.",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#2563eb",
        background: theme.background,
        color: theme.color,
      });
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <Main>
        <div className="min-h-screen bg-slate-100 pt-20 transition-colors dark:bg-slate-950 lg:ml-64">
          <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
            <LoadingState />
          </div>
        </div>
      </Main>
    );
  }

  /* ==========================================================
     DATA DISPLAY
  ========================================================== */

  const nama = sekolah?.nama_sekolah || namaSekolah || "Nama Sekolah";

  const imageProfile = sekolah?.image_profile
    ? `${repoimages}${sekolah.image_profile}`
    : logoFallback;

  const alamatSekolah =
    sekolah?.alamat_sekolah || sekolah?.alamat || alamat || "-";

  return (
    <Main>
      <div className="min-h-screen bg-slate-100 pt-20 transition-colors dark:bg-slate-950 lg:ml-64">
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          {/* ==================================================
              HEADER PAGE
          ================================================== */}

          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <SchoolIcon />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Profile Sekolah
                </h1>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Kelola informasi dan identitas sekolah
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              MAIN CARD
          ================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
            <div className="grid lg:grid-cols-[340px_minmax(0,1fr)]">
              {/* ==================================================
                  LEFT PROFILE
              ================================================== */}

              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 lg:p-10">
                {/* Decorative */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5" />

                <div className="relative flex h-full flex-col">
                  {/* Badge */}
                  <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />

                    <span className="text-xs font-semibold text-white">
                      Informasi Sekolah
                    </span>
                  </div>

                  {/* Logo */}
                  <div className="flex justify-center">
                    <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/20 bg-white p-4 shadow-2xl sm:h-40 sm:w-40">
                      <img
                        src={imageProfile}
                        alt={nama}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = logoFallback;
                        }}
                      />
                    </div>
                  </div>

                  {/* School Name */}
                  <div className="mt-6 text-center">
                    <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                      {nama}
                    </h2>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                      <AccreditationIcon />

                      <span className="text-sm font-semibold text-white">
                        Akreditasi {sekolah?.akreditasi || akreditasi || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Information */}
                  <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                    {/* Telepon */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                        <PhoneIcon />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-100/70">
                          Telepon
                        </p>

                        <p className="mt-1 text-sm font-medium text-white">
                          {sekolah?.no_telp || noTelp || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Alamat */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                        <LocationIcon />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-100/70">
                          Alamat
                        </p>

                        <p className="mt-1 text-sm font-medium leading-relaxed text-white">
                          {alamatSekolah}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  RIGHT FORM
              ================================================== */}

              <div className="bg-white p-5 dark:bg-slate-900 sm:p-7 lg:p-10">
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                    Pengaturan Profile
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                    Informasi Dasar Sekolah
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Perbarui informasi sekolah yang akan digunakan pada sistem.
                  </p>
                </div>

                <form onSubmit={updateProfileSekolah} className="space-y-6">
                  {/* Nama */}
                  <FormField id="nama_sekolah" label="Nama Sekolah" required>
                    <input
                      id="nama_sekolah"
                      name="nama_sekolah"
                      type="text"
                      value={namaSekolah}
                      onChange={(e) => setNamaSekolah(e.target.value)}
                      placeholder="Masukkan nama sekolah"
                      className="
                        w-full rounded-xl
                        border border-slate-200
                        bg-white px-4 py-3
                        text-sm font-medium text-slate-700
                        outline-none transition
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-blue-500
                        focus:ring-4 focus:ring-blue-500/10

                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-100
                        dark:placeholder:text-slate-500
                        dark:hover:border-slate-600
                      "
                    />
                  </FormField>

                  {/* Akreditasi */}
                  <FormField id="akreditasi" label="Akreditasi" required>
                    <div className="relative">
                      <select
                        id="akreditasi"
                        name="akreditasi"
                        value={akreditasi}
                        onChange={(e) => setAkreditasi(e.target.value)}
                        className="
                          w-full appearance-none rounded-xl
                          border border-slate-200
                          bg-white px-4 py-3 pr-10
                          text-sm font-medium text-slate-700
                          outline-none transition
                          hover:border-slate-300
                          focus:border-blue-500
                          focus:ring-4 focus:ring-blue-500/10

                          dark:border-slate-700
                          dark:bg-slate-800
                          dark:text-slate-100
                          dark:hover:border-slate-600
                        "
                      >
                        <option value="">Pilih akreditasi</option>

                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>

                        <option value="Belum Terakreditasi">
                          Belum Terakreditasi
                        </option>
                      </select>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </FormField>

                  {/* Telepon */}
                  <FormField id="no_telp" label="Nomor Telepon">
                    <input
                      id="no_telp"
                      name="no_telp"
                      type="tel"
                      value={noTelp}
                      onChange={(e) => setNoTelp(e.target.value)}
                      placeholder="Masukkan nomor telepon sekolah"
                      className="
                        w-full rounded-xl
                        border border-slate-200
                        bg-white px-4 py-3
                        text-sm font-medium text-slate-700
                        outline-none transition
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-blue-500
                        focus:ring-4 focus:ring-blue-500/10

                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-100
                        dark:placeholder:text-slate-500
                        dark:hover:border-slate-600
                      "
                    />
                  </FormField>

                  {/* Image Profile */}
                  {/* FOTO PROFILE */}
                  <div>
                    <label
                      htmlFor="image_profile"
                      className={`mb-2 block text-sm font-semibold ${
                        isDarkMode ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      Foto Profile
                    </label>

                    <div
                      className={`overflow-hidden rounded-xl border ${
                        isDarkMode
                          ? "border-slate-700 bg-slate-800"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex min-h-52 items-center justify-center p-4">
                        {imagePreview || sekolah?.image_profile ? (
                          <img
                            src={
                              imagePreview ||
                              `${repoimages}${sekolah.image_profile}`
                            }
                            alt="Preview profile"
                            className="max-h-64 max-w-full rounded-xl object-contain shadow-sm"
                          />
                        ) : (
                          <div className="py-8 text-center">
                            <div
                              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                                isDarkMode
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-blue-50 text-blue-500"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 16.5V7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z"
                                />

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-4.5-4.5L7 20"
                                />
                              </svg>
                            </div>

                            <p
                              className={`mt-3 text-sm font-medium ${
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              Belum ada foto
                            </p>

                            <p
                              className={`mt-1 text-xs ${
                                isDarkMode ? "text-slate-500" : "text-slate-400"
                              }`}
                            >
                              PNG, JPG, JPEG atau WEBP · Maksimal 2 MB
                            </p>
                          </div>
                        )}
                      </div>

                      <div
                        className={`border-t p-4 ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-900"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <input
                          id="image_profile"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={onImageUpload}
                          className={`block w-full text-sm ${
                            isDarkMode
                              ? "text-slate-400 file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                              : "text-slate-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          } file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold`}
                        />
                      </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                      <div
                        className={`mt-3 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                          isDarkMode
                            ? "border-rose-900/60 bg-rose-950/40 text-rose-400"
                            : "border-rose-100 bg-rose-50 text-rose-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-0.5 h-5 w-5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12V15z"
                          />
                        </svg>

                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  {/* Alamat */}
                  <FormField id="alamat" label="Alamat Sekolah">
                    <textarea
                      id="alamat"
                      name="alamat"
                      rows={5}
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Masukkan alamat lengkap sekolah"
                      className="
                        w-full resize-none rounded-xl
                        border border-slate-200
                        bg-white px-4 py-3
                        text-sm font-medium
                        leading-relaxed text-slate-700
                        outline-none transition
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-blue-500
                        focus:ring-4 focus:ring-blue-500/10

                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-100
                        dark:placeholder:text-slate-500
                        dark:hover:border-slate-600
                      "
                    />
                  </FormField>

                  {/* ==================================================
                      BUTTON
                  ================================================== */}

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-700 sm:flex-row sm:justify-end">
                    {/* Reset */}
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setNamaSekolah(sekolah?.nama_sekolah || "");

                        setAkreditasi(sekolah?.akreditasi || "");

                        setNoTelp(sekolah?.no_telp || "");

                        setAlamat(
                          sekolah?.alamat_sekolah || sekolah?.alamat || "",
                        );
                      }}
                      className="
                        rounded-xl
                        border border-slate-200
                        bg-white px-5 py-3
                        text-sm font-semibold
                        text-slate-600
                        transition
                        hover:bg-slate-50
                        hover:text-slate-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-300
                        dark:hover:bg-slate-700
                        dark:hover:text-slate-100
                      "
                    >
                      Reset
                    </button>

                    {/* Simpan */}
                    <button
                      type="submit"
                      disabled={saving}
                      className="
                        inline-flex items-center
                        justify-center gap-2
                        rounded-xl
                        bg-blue-600
                        px-6 py-3
                        text-sm font-bold
                        text-white
                        shadow-lg
                        shadow-blue-600/20
                        transition
                        hover:bg-blue-700
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {saving ? (
                        <>
                          <Spinner />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <SaveIcon />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* ==================================================
              INFORMATION FOOTER
          ================================================== */}

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <InfoItem icon={<SchoolIcon />} label="Nama Sekolah" value={nama} />

            <InfoItem
              icon={<PhoneIcon />}
              label="Nomor Telepon"
              value={sekolah?.no_telp || noTelp || "-"}
            />

            <InfoItem
              icon={<AccreditationIcon />}
              label="Akreditasi"
              value={sekolah?.akreditasi || akreditasi || "-"}
            />
          </div>
        </div>
      </div>
    </Main>
  );
}

/* ============================================================
   FALLBACK LOGO
============================================================ */

const logoFallback =
  "https://ui-avatars.com/api/?name=Sekolah&background=eff6ff&color=2563eb&size=256";
