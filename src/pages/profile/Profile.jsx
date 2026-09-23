import { useEffect, useState } from "react";

import Main from "../../components/Main/Main";

import Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";

import api from "../../utils/repositories";

import repoimages from "../../utils/repoimages";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [name, setName] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [noHP, setNoHP] = useState("");
  const [alamat, setAlamat] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");

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

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const updateTheme = () => {
      setIsDarkMode(
        html.classList.contains("dark") || body.classList.contains("dark"),
      );
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * ============================================================
   * AMBIL DATA PROFILE
   * ============================================================
   */
  const userProfile = async () => {
    const dataUser = localStorage.getItem("username");

    if (!dataUser) {
      setLoadingProfile(false);
      return;
    }

    let username;

    try {
      username = JSON.parse(dataUser);
    } catch {
      username = dataUser;
    }

    try {
      setLoadingProfile(true);

      const response = await api.get(`guru/${username}`, {
        withCredentials: true,
      });

      const data = response?.data?.data || response?.data || {};

      setUser(data);

      setName(data.nama || data.name || "");
      setJenisKelamin(data.jenis_kelamin || "");
      setNoHP(data.no_hp || "");
      setAlamat(data.alamat || "");
    } catch (error) {
      console.error("Gagal mengambil data profile:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Data profile tidak dapat dimuat.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    userProfile();
  }, []);

  /*
   * ============================================================
   * UPLOAD FOTO
   * ============================================================
   */
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

  /*
   * ============================================================
   * UPDATE PROFILE
   * ============================================================
   */
  const updateProfile = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!jenisKelamin) {
      setError("Jenis kelamin wajib dipilih.");
      return;
    }

    if (!noHP.trim()) {
      setError("Nomor handphone wajib diisi.");
      return;
    }

    if (!alamat.trim()) {
      setError("Alamat wajib diisi.");
      return;
    }

    const data = localStorage.getItem("username");
    const username = data.replace(/"/g, "");

    const formData = new FormData();

    formData.append("name", name);
    formData.append("jenis_kelamin", jenisKelamin);
    formData.append("no_hp", noHP);
    formData.append("alamat", alamat);

    if (image) {
      formData.append("image_profile", image);
    }

    try {
      setLoading(true);

      await api.patch(`guru/${username}`, formData);

      const templateModal = withReactContent(Swal).mixin({
        customClass: {
          confirmButton:
            "rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white cursor-pointer",
        },

        buttonsStyling: false,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,

        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      await templateModal.fire({
        icon: "success",
        title: "Profile berhasil diperbarui",
      });

      await userProfile();

      setImage(null);
      setImagePreview("");
    } catch (error) {
      console.error("Gagal update profile:", error);

      const status = error?.response?.status;

      if (status === 403) {
        setError(
          "File yang dimasukkan bukan gambar atau ukurannya melebihi 2 MB.",
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan profile.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * LOADING PROFILE
   * ============================================================
   */
  if (loadingProfile) {
    return (
      <Main>
        <div
          className={`min-h-screen pt-20 transition-colors lg:ml-64 ${
            isDarkMode ? "bg-slate-950" : "bg-slate-100"
          }`}
        >
          <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6">
                <div
                  className={`h-7 w-32 animate-pulse rounded-lg ${
                    isDarkMode ? "bg-slate-800" : "bg-slate-200"
                  }`}
                />

                <div
                  className={`mt-2 h-4 w-56 animate-pulse rounded ${
                    isDarkMode ? "bg-slate-800" : "bg-slate-200"
                  }`}
                />
              </div>

              <div
                className={`overflow-hidden rounded-2xl border shadow-sm ${
                  isDarkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="grid lg:grid-cols-[350px_1fr]">
                  <div className="flex min-h-[400px] items-center justify-center bg-blue-600 p-8">
                    <div className="flex flex-col items-center">
                      <div className="h-40 w-40 animate-pulse rounded-full bg-white/20" />

                      <div className="mt-5 h-5 w-40 animate-pulse rounded bg-white/20" />

                      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-white/20" />
                    </div>
                  </div>

                  <div className="space-y-5 p-6 sm:p-8 lg:p-10">
                    <div
                      className={`h-6 w-48 animate-pulse rounded ${
                        isDarkMode ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />

                    <div
                      className={`h-11 w-full animate-pulse rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />

                    <div
                      className={`h-11 w-full animate-pulse rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />

                    <div
                      className={`h-11 w-full animate-pulse rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />

                    <div
                      className={`h-32 w-full animate-pulse rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>
    );
  }

  /*
   * ============================================================
   * PROFILE
   * ============================================================
   */
  return (
    <Main>
      <div
        className={`min-h-screen pt-20 transition-colors lg:ml-64 ${
          isDarkMode ? "bg-slate-950" : "bg-slate-100"
        }`}
      >
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* PAGE HEADER */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>

                <div>
                  <h1
                    className={`text-xl font-bold sm:text-2xl ${
                      isDarkMode ? "text-slate-100" : "text-slate-800"
                    }`}
                  >
                    Profile
                  </h1>

                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Kelola informasi profile Anda
                  </p>
                </div>
              </div>
            </div>

            {/* MAIN CARD */}
            <div
              className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
                isDarkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="grid lg:grid-cols-[350px_minmax(0,1fr)]">
                {/* PROFILE SIDEBAR */}
                <div className="relative overflow-hidden bg-blue-600 p-6 sm:p-8 lg:p-10">
                  {/* Decoration */}
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

                  <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/10" />

                  <div className="relative flex h-full flex-col items-center justify-center text-center">
                    {/* FOTO */}
                    <div className="rounded-full bg-white p-2 shadow-xl">
                      <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-slate-100 sm:h-40 sm:w-40">
                        {user?.image_profile ? (
                          <img
                            src={`${repoimages}${user.image_profile}`}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-20 w-20 text-slate-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* NAMA */}
                    <h2 className="mt-6 text-lg font-bold text-white">
                      {user?.nama || user?.name || "-"}
                    </h2>

                    {/* NIP */}
                    <p className="mt-1 text-sm text-blue-100">
                      NIP. {user?.nip || "-"}
                    </p>

                    {/* STATUS */}
                    <div className="mt-8 w-full max-w-xs rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                            />
                          </svg>
                        </div>

                        <div>
                          <p className="text-xs text-blue-100">Status</p>

                          <p className="text-sm font-semibold text-white">
                            Guru
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORM */}
                <div className="min-w-0 p-5 sm:p-7 lg:p-10">
                  <div className="mb-7">
                    <h2
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-slate-100" : "text-slate-800"
                      }`}
                    >
                      Informasi Profile
                    </h2>

                    <p
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Perbarui informasi pribadi Anda melalui form berikut.
                    </p>
                  </div>

                  <form onSubmit={updateProfile} className="space-y-5">
                    {/* NIP */}
                    <div>
                      <label
                        htmlFor="nip"
                        className={`mb-2 block text-sm font-semibold ${
                          isDarkMode ? "text-slate-200" : "text-slate-700"
                        }`}
                      >
                        NIP
                      </label>

                      <input
                        id="nip"
                        type="text"
                        readOnly
                        value={user?.nip || ""}
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-800 text-slate-400"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      />
                    </div>

                    {/* NAMA */}
                    <div>
                      <label
                        htmlFor="nama"
                        className={`mb-2 block text-sm font-semibold ${
                          isDarkMode ? "text-slate-200" : "text-slate-700"
                        }`}
                      >
                        Nama Lengkap
                      </label>

                      <input
                        id="nama"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
                            : "border-slate-200 bg-white text-slate-700 shadow-sm placeholder:text-slate-400"
                        }`}
                      />
                    </div>

                    {/* JENIS KELAMIN */}
                    <div>
                      <label
                        className={`mb-3 block text-sm font-semibold ${
                          isDarkMode ? "text-slate-200" : "text-slate-700"
                        }`}
                      >
                        Jenis Kelamin
                      </label>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                            jenisKelamin === "Laki-laki"
                              ? isDarkMode
                                ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/10"
                                : "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                              : isDarkMode
                                ? "border-slate-700 bg-slate-800 hover:border-blue-500"
                                : "border-slate-200 hover:border-blue-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="jenis_kelamin"
                            value="Laki-laki"
                            checked={jenisKelamin === "Laki-laki"}
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            className="h-4 w-4 accent-blue-600"
                          />

                          <span
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            Laki-laki
                          </span>
                        </label>

                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                            jenisKelamin === "Perempuan"
                              ? isDarkMode
                                ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/10"
                                : "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                              : isDarkMode
                                ? "border-slate-700 bg-slate-800 hover:border-blue-500"
                                : "border-slate-200 hover:border-blue-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="jenis_kelamin"
                            value="Perempuan"
                            checked={jenisKelamin === "Perempuan"}
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            className="h-4 w-4 accent-blue-600"
                          />

                          <span
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            Perempuan
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* NO HP */}
                    <div>
                      <label
                        htmlFor="no_hp"
                        className={`mb-2 block text-sm font-semibold ${
                          isDarkMode ? "text-slate-200" : "text-slate-700"
                        }`}
                      >
                        No. Handphone
                      </label>

                      <input
                        id="no_hp"
                        type="tel"
                        value={noHP}
                        onChange={(e) => setNoHP(e.target.value)}
                        placeholder="Masukkan nomor handphone"
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
                            : "border-slate-200 bg-white text-slate-700 shadow-sm placeholder:text-slate-400"
                        }`}
                      />
                    </div>

                    {/* ALAMAT */}
                    <div>
                      <label
                        htmlFor="alamat"
                        className={`mb-2 block text-sm font-semibold ${
                          isDarkMode ? "text-slate-200" : "text-slate-700"
                        }`}
                      >
                        Alamat
                      </label>

                      <textarea
                        id="alamat"
                        rows="4"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Masukkan alamat lengkap"
                        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
                            : "border-slate-200 bg-white text-slate-700 shadow-sm placeholder:text-slate-400"
                        }`}
                      />
                    </div>

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
                          {imagePreview || user?.image_profile ? (
                            <img
                              src={
                                imagePreview ||
                                `${repoimages}${user.image_profile}`
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
                                  isDarkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                                }`}
                              >
                                Belum ada foto
                              </p>

                              <p
                                className={`mt-1 text-xs ${
                                  isDarkMode
                                    ? "text-slate-500"
                                    : "text-slate-400"
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

                    {/* BUTTON */}
                    <div
                      className={`flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end ${
                        isDarkMode ? "border-slate-800" : "border-slate-100"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={loading}
                        onClick={userProfile}
                        className={`rounded-xl border px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Reset
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? (
                          <>
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
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                              />
                            </svg>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 3v5h6V3M9 17h6"
                              />
                            </svg>
                            Simpan Perubahan
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Profile;
