import { useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Main from "../../components/Main/Main";

import repoimages from "../../utils/repoimages";

import Swal from "sweetalert2";

import api from "../../utils/repositories";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
      {message}
    </p>
  );
};

const InputLabel = ({ htmlFor, children, required = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
    >
      {children}

      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
};

function UpdateDataGuru() {
  const { nip } = useParams();
  const navigate = useNavigate();

  const [guru, setGuru] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [noHP, setNoHP] = useState("");
  const [alamat, setAlamat] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState({});

  /*
  =========================================================
  GET DATA GURU
  =========================================================
  */

  const getDataGuruById = useCallback(async () => {
    try {
      setFetching(true);

      const response = await api.get(`guru/${nip}`);

      const data = response?.data?.data;

      if (!data) {
        throw new Error("Data guru tidak ditemukan.");
      }

      setGuru(data);

      setNama(data.nama || data.name || "");
      setEmail(data.email || "");
      setJenisKelamin(data.jenis_kelamin || "");
      setNoHP(data.no_hp || "");
      setAlamat(data.alamat || "");
    } catch (err) {
      console.error("Gagal mengambil data guru:", err);

      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: err?.response?.data?.message || "Data guru tidak dapat dimuat.",
        confirmButtonText: "Kembali",
        confirmButtonColor: "#0ea5e9",
      });

      navigate("/guru");
    } finally {
      setFetching(false);
    }
  }, [nip, navigate]);

  useEffect(() => {
    getDataGuruById();
  }, [getDataGuruById]);

  /*
  =========================================================
  IMAGE UPLOAD
  =========================================================
  */

  const onImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError((prev) => ({
        ...prev,
        image_profile: "File yang dipilih harus berupa gambar.",
      }));

      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError((prev) => ({
        ...prev,
        image_profile: "Ukuran gambar maksimal 2 MB.",
      }));

      e.target.value = "";
      return;
    }

    setError((prev) => ({
      ...prev,
      image_profile: "",
    }));

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /*
  =========================================================
  BERSIHKAN OBJECT URL
  =========================================================
  */

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /*
  =========================================================
  UPDATE DATA
  =========================================================
  */

  const updateData = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError({});

    const formData = new FormData();

    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("jenis_kelamin", jenisKelamin);
    formData.append("no_hp", noHP);
    formData.append("alamat", alamat);

    if (image) {
      formData.append("image_profile", image);
    }

    try {
      const response = await api.patch(`guru/${nip}`, formData);

      if (response.status === 200 || response?.data?.status === 200) {
         const isDarkMode = document.documentElement.classList.contains("dark");
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data guru berhasil diperbarui.",
          confirmButtonText: "OK",
          confirmButtonColor: "#0ea5e9",
          background: isDarkMode ? "#0f172a" : "#ffffff",
          color: isDarkMode ? "#e2e8f0" : "#334155",
        });

        navigate("/guru");
      }
    } catch (err) {
      console.error("Gagal memperbarui data guru:", err);

      const message = err?.response?.data?.message;

      if (typeof message === "object" && message !== null) {
        setError(message);
      } else {
        setError({
          general: message || "Data guru gagal diperbarui. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  LOADING DATA
  =========================================================
  */

  if (fetching) {
    return (
      <Main>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />

              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                Memuat data guru...
              </p>
            </div>
          </div>
        </div>
      </Main>
    );
  }

  /*
  =========================================================
  MAIN VIEW
  =========================================================
  */

  return (
    <Main>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="grid grid-cols-6">
          <div className="col-span-5 col-start-2 overflow-y-auto p-5 lg:p-7">
            {/* =================================================
                HEADER
            ================================================== */}

            <div className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                    <span>Guru</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>

                    <span className="text-slate-600 dark:text-slate-300">
                      Update Data
                    </span>
                  </div>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                    Update Data Guru
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Perbarui informasi profil dan data guru.
                  </p>
                </div>

                {/* Tombol kembali */}

                <button
                  type="button"
                  onClick={() => navigate("/guru")}
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
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
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>
                  Kembali
                </button>
              </div>
            </div>

            {/* =================================================
                MAIN CARD
            ================================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              {/* Card Header */}

              <div className="border-b border-slate-100 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232 18.768 8.768M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-white">
                      Informasi Guru
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Silakan perbarui informasi yang diperlukan.
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FORM
              ================================================== */}

              <form onSubmit={updateData}>
                <div className="space-y-8 p-6">
                  {/* GENERAL ERROR */}

                  {error.general && (
                    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-900/60 dark:bg-rose-950/40">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="mt-0.5 h-5 w-5 shrink-0 text-rose-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.29 3.86 2.82 17.25A1.875 1.875 0 0 0 4.45 20h15.1a1.875 1.875 0 0 0 1.63-2.75L13.71 3.86a1.875 1.875 0 0 0-3.42 0Z"
                        />
                      </svg>

                      <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                        {error.general}
                      </p>
                    </div>
                  )}

                  {/* =================================================
                      IDENTITAS
                  ================================================== */}

                  <section>
                    <div className="mb-5 border-b border-slate-100 pb-3 dark:border-slate-700">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Identitas Guru
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Informasi dasar guru.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* NIP */}

                      <div>
                        <InputLabel htmlFor="nip">NIP</InputLabel>

                        <input
                          type="text"
                          id="nip"
                          value={guru.nip || nip || ""}
                          readOnly
                          className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
                        />
                      </div>

                      {/* NAMA */}

                      <div>
                        <InputLabel htmlFor="nama" required>
                          Nama Lengkap
                        </InputLabel>

                        <input
                          type="text"
                          id="nama"
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                            error.nama
                              ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40"
                              : "border-slate-200 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-700 dark:focus:border-sky-400 dark:focus:ring-sky-900/40"
                          }`}
                        />

                        <ErrorMessage message={error.nama} />
                      </div>

                      {/* EMAIL */}

                      <div>
                        <InputLabel htmlFor="email" required>
                          Email
                        </InputLabel>

                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contoh@email.com"
                          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                            error.email
                              ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40"
                              : "border-slate-200 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-700 dark:focus:border-sky-400 dark:focus:ring-sky-900/40"
                          }`}
                        />

                        <ErrorMessage message={error.email} />
                      </div>

                      {/* JENIS KELAMIN */}

                      <div>
                        <InputLabel>Jenis Kelamin</InputLabel>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {/* LAKI-LAKI */}

                          <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition ${
                              jenisKelamin === "Laki-laki"
                                ? "border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-300"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="jenis_kelamin"
                              value="Laki-laki"
                              checked={jenisKelamin === "Laki-laki"}
                              onChange={(e) => setJenisKelamin(e.target.value)}
                              className="h-4 w-4 accent-sky-500"
                            />

                            <span className="text-sm font-medium">
                              Laki-laki
                            </span>
                          </label>

                          {/* PEREMPUAN */}

                          <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition ${
                              jenisKelamin === "Perempuan"
                                ? "border-pink-500 bg-pink-50 text-pink-700 dark:border-pink-400 dark:bg-pink-950/50 dark:text-pink-300"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="jenis_kelamin"
                              value="Perempuan"
                              checked={jenisKelamin === "Perempuan"}
                              onChange={(e) => setJenisKelamin(e.target.value)}
                              className="h-4 w-4 accent-pink-500"
                            />

                            <span className="text-sm font-medium">
                              Perempuan
                            </span>
                          </label>
                        </div>

                        <ErrorMessage message={error.jenis_kelamin} />
                      </div>
                    </div>
                  </section>

                  {/* =================================================
                      KONTAK
                  ================================================== */}

                  <section>
                    <div className="mb-5 border-b border-slate-100 pb-3 dark:border-slate-700">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Kontak & Alamat
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Informasi kontak dan alamat tempat tinggal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* NO HP */}

                      <div>
                        <InputLabel htmlFor="no_hp">No. Handphone</InputLabel>

                        <input
                          type="tel"
                          id="no_hp"
                          value={noHP}
                          onChange={(e) => setNoHP(e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                            error.no_hp
                              ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40"
                              : "border-slate-200 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-700 dark:focus:border-sky-400 dark:focus:ring-sky-900/40"
                          }`}
                        />

                        <ErrorMessage message={error.no_hp} />
                      </div>

                      {/* ALAMAT */}

                      <div>
                        <InputLabel htmlFor="alamat">Alamat</InputLabel>

                        <textarea
                          id="alamat"
                          rows={5}
                          value={alamat}
                          onChange={(e) => setAlamat(e.target.value)}
                          placeholder="Masukkan alamat lengkap"
                          className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                            error.alamat
                              ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40"
                              : "border-slate-200 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-700 dark:focus:border-sky-400 dark:focus:ring-sky-900/40"
                          }`}
                        />

                        <ErrorMessage message={error.alamat} />
                      </div>
                    </div>
                  </section>

                  {/* =================================================
                      FOTO PROFIL
                  ================================================== */}

                  <section>
                    <div className="mb-5 border-b border-slate-100 pb-3 dark:border-slate-700">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Foto Profil
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Ganti foto profil guru jika diperlukan.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">
                      {/* PREVIEW */}

                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                        <div className="aspect-square">
                          {imagePreview || guru.image_profile ? (
                            <img
                              src={
                                imagePreview ||
                                `${repoimages}${guru.image_profile}`
                              }
                              alt="Foto profil guru"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.2}
                                stroke="currentColor"
                                className="h-20 w-20 text-slate-300 dark:text-slate-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* UPLOAD */}

                      <div className="flex flex-col justify-center">
                        <InputLabel htmlFor="image_profile">
                          Pilih Foto Baru
                        </InputLabel>

                        <input
                          type="file"
                          id="image_profile"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={onImageUpload}
                          className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:file:border-slate-700 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600"
                        />

                        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                          Format JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                        </p>

                        <ErrorMessage message={error.image_profile} />
                      </div>
                    </div>
                  </section>
                </div>

                {/* =================================================
                    FOOTER BUTTON
                ================================================== */}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end dark:border-slate-700 dark:bg-slate-800/50">
                  {/* BATAL */}

                  <button
                    type="button"
                    onClick={() => navigate("/guru")}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Batal
                  </button>

                  {/* SIMPAN */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                          />
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      <>
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
                            d="M5 12h14M12 5l7 7-7 7"
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
    </Main>
  );
}

export default UpdateDataGuru;
