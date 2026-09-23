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

function UpdateDataSiswa() {
  const { nis } = useParams();
  const navigate = useNavigate();

  const [siswa, setSiswa] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [nama, setNama] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [email, setEmail] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [noHP, setNoHP] = useState("");
  const [alamat, setAlamat] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState({});

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const inputClass = (field) => `
    w-full
    rounded-xl
    border
    bg-white
    px-3.5
    py-3
    text-sm
    text-slate-700
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    focus:ring-2
    dark:bg-slate-800
    dark:text-slate-100
    dark:placeholder:text-slate-500
    ${
      error[field]
        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-500/20"
        : "border-slate-200 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-700 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
    }
  `;

  // =========================================================
  // GET DATA SISWA
  // =========================================================

  const getDataSiswaById = useCallback(async () => {
    try {
      setFetching(true);

      const response = await api.get(`siswa/${nis}`);
      const data = response?.data?.data;

      if (!data) {
        throw new Error("Data siswa tidak ditemukan.");
      }

      setSiswa(data);

      setNama(data.nama || data.name || "");

      // -------------------------------------------------------
      // TEMPAT TANGGAL LAHIR
      // -------------------------------------------------------

      const ttl = data.tempat_tanggal_lahir || "";

      if (ttl.includes(",")) {
        const [tempat, ...tanggal] = ttl.split(",");

        setTempatLahir(tempat.trim());
        setTanggalLahir(tanggal.join(",").trim());
      } else {
        setTempatLahir(ttl.trim());
        setTanggalLahir("");
      }

      setEmail(data.email || "");
      setJenisKelamin(data.jenis_kelamin || "");
      setNoHP(data.no_hp || "");
      setAlamat(data.alamat || "");
    } catch (err) {
      console.error("Gagal mengambil data siswa:", err);

      const isDarkMode = document.documentElement.classList.contains("dark");

      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Data siswa tidak dapat dimuat.",
        confirmButtonText: "Kembali",
        confirmButtonColor: "#0ea5e9",
        background: isDarkMode ? "#0f172a" : "#ffffff",
        color: isDarkMode ? "#e2e8f0" : "#334155",
      });

      navigate("/siswa");
    } finally {
      setFetching(false);
    }
  }, [nis, navigate]);

  useEffect(() => {
    getDataSiswaById();
  }, [getDataSiswaById]);

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

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

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================================================
  // CLEAN OBJECT URL
  // =========================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =========================================================
  // UPDATE DATA
  // =========================================================

  const updateData = async (e) => {
    e.preventDefault();

    setError({});

    // -------------------------------------------------------
    // VALIDASI FRONTEND
    // -------------------------------------------------------

    const validationError = {};

    if (!nama.trim()) {
      validationError.nama = "Nama lengkap wajib diisi.";
    }

    if (!tempatLahir.trim()) {
      validationError.tempat_tanggal_lahir = "Tempat lahir wajib diisi.";
    }

    if (!tanggalLahir.trim()) {
      validationError.tempat_tanggal_lahir = "Tanggal lahir wajib diisi.";
    }

    if (Object.keys(validationError).length > 0) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("nama", nama.trim());

    // Backend tetap menerima satu field
    formData.append("ttl", `${tempatLahir.trim()}, ${tanggalLahir.trim()}`);

    formData.append("email", email.trim());
    formData.append("jenis_kelamin", jenisKelamin);
    formData.append("no_hp", noHP.trim());
    formData.append("alamat", alamat.trim());

    if (image) {
      formData.append("image_profile", image);
    }

    console.log(formData);

    try {
      const response = await api.patch(`siswa/${nis}`, formData);

      if (response.status === 200 || response?.data?.status === 200) {
        const isDarkMode = document.documentElement.classList.contains("dark");

        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data siswa berhasil diperbarui.",
          confirmButtonText: "OK",
          confirmButtonColor: "#0ea5e9",
          background: isDarkMode ? "#0f172a" : "#ffffff",
          color: isDarkMode ? "#e2e8f0" : "#334155",
        });

        navigate("/siswa");
      }
    } catch (err) {
      console.log("update siswa", err.response);
      console.error("Gagal memperbarui data siswa:", err);

      const message = err?.response?.data?.data;

      if (typeof message === "object" && message !== null) {
        setError(message);
      } else {
        setError({
          general: message || "Data siswa gagal diperbarui. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING DATA
  // =========================================================

  if (fetching) {
    return (
      <Main>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center">
              <div
                className="
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-slate-200
                  border-t-sky-500
                  dark:border-slate-700
                  dark:border-t-sky-500
                "
              />

              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                Memuat data siswa...
              </p>
            </div>
          </div>
        </div>
      </Main>
    );
  }

  // =========================================================
  // MAIN VIEW
  // =========================================================

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
                    <span>Siswa</span>

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

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Update Data Siswa
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Perbarui informasi profil dan data siswa.
                  </p>
                </div>

                {/* Tombol Kembali */}

                <button
                  type="button"
                  onClick={() => navigate("/siswa")}
                  className="
                    inline-flex
                    w-fit
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-slate-300
                    hover:bg-slate-50
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                    dark:hover:border-slate-600
                    dark:hover:bg-slate-800
                    dark:hover:text-slate-100
                  "
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

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              {/* Card Header */}

              <div
                className="
                  border-b
                  border-slate-100
                  bg-white
                  px-6
                  py-5
                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-sky-50
                      text-sky-600
                      dark:bg-sky-950/50
                      dark:text-sky-400
                    "
                  >
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
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      Informasi Siswa
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Silakan perbarui informasi siswa yang diperlukan.
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FORM
              ================================================== */}

              <form onSubmit={updateData}>
                <div className="space-y-8 p-6">
                  {/* General Error */}

                  {error.general && (
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-rose-200
                        bg-rose-50
                        px-4
                        py-3
                        dark:border-rose-900/60
                        dark:bg-rose-950/30
                      "
                    >
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
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Identitas Siswa
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Informasi dasar siswa.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* NIS */}

                      <div>
                        <InputLabel htmlFor="nis">NIS</InputLabel>

                        <input
                          type="text"
                          id="nis"
                          value={siswa.nis || nis || ""}
                          readOnly
                          className="
                            w-full
                            cursor-not-allowed
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-100
                            px-3.5
                            py-3
                            text-sm
                            font-medium
                            text-slate-500
                            outline-none
                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-slate-400
                          "
                        />

                        <ErrorMessage message={error.nis} />
                      </div>

                      {/* Nama */}

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
                          className={inputClass("nama")}
                        />

                        <ErrorMessage message={error.nama} />
                      </div>

                      {/* Tempat & Tanggal Lahir */}

                      <div>
                        <InputLabel required>Tempat, Tanggal Lahir</InputLabel>

                        <div
                          className={`
                            flex
                            overflow-hidden
                            rounded-xl
                            border
                            bg-white
                            transition-all
                            duration-200
                            focus-within:ring-2
                            dark:bg-slate-800
                            ${
                              error.tempat_tanggal_lahir
                                ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100 dark:border-rose-500 dark:focus-within:border-rose-400 dark:focus-within:ring-rose-500/20"
                                : "border-slate-200 focus-within:border-sky-500 focus-within:ring-sky-100 dark:border-slate-700 dark:focus-within:border-sky-500 dark:focus-within:ring-sky-500/20"
                            }
                          `}
                        >
                          <input
                            type="text"
                            id="tempat_lahir"
                            value={tempatLahir}
                            onChange={(e) => setTempatLahir(e.target.value)}
                            placeholder="Tempat lahir"
                            className="
                              min-w-0
                              flex-1
                              border-0
                              bg-transparent
                              px-3.5
                              py-3
                              text-sm
                              text-slate-700
                              outline-none
                              placeholder:text-slate-400
                              dark:text-slate-100
                              dark:placeholder:text-slate-500
                            "
                          />

                          <div
                            className="
                              flex
                              items-center
                              justify-center
                              border-x
                              border-slate-200
                              bg-slate-50
                              px-3
                              text-sm
                              font-bold
                              text-slate-400
                              dark:border-slate-700
                              dark:bg-slate-900
                              dark:text-slate-500
                            "
                          >
                            ,
                          </div>

                          <input
                            type="text"
                            id="tanggal_lahir"
                            value={tanggalLahir}
                            onChange={(e) => setTanggalLahir(e.target.value)}
                            placeholder="Tanggal lahir"
                            className="
                              min-w-0
                              flex-1
                              border-0
                              bg-transparent
                              px-3.5
                              py-3
                              text-sm
                              text-slate-700
                              outline-none
                              placeholder:text-slate-400
                              dark:text-slate-100
                              dark:placeholder:text-slate-500
                            "
                          />
                        </div>

                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                          Contoh:{" "}
                          <span className="font-medium">
                            Biak, 28 Oktober 2025
                          </span>
                        </p>

                        <ErrorMessage message={error.tempat_tanggal_lahir} />
                      </div>

                      {/* Email */}

                      <div>
                        <InputLabel htmlFor="email">Email</InputLabel>

                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contoh@email.com"
                          className={inputClass("email")}
                        />

                        <ErrorMessage message={error.email} />
                      </div>

                      {/* Jenis Kelamin */}

                      <div>
                        <InputLabel>Jenis Kelamin</InputLabel>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {/* Laki-laki */}

                          <label
                            className={`
                              flex
                              cursor-pointer
                              items-center
                              gap-3
                              rounded-xl
                              border
                              px-4
                              py-3
                              transition-all
                              duration-200
                              ${
                                jenisKelamin === "Laki-laki"
                                  ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm dark:border-sky-500 dark:bg-sky-950/50 dark:text-sky-300"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
                              }
                            `}
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

                          {/* Perempuan */}

                          <label
                            className={`
                              flex
                              cursor-pointer
                              items-center
                              gap-3
                              rounded-xl
                              border
                              px-4
                              py-3
                              transition-all
                              duration-200
                              ${
                                jenisKelamin === "Perempuan"
                                  ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm dark:border-sky-500 dark:bg-sky-950/50 dark:text-sky-300"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="jenis_kelamin"
                              value="Perempuan"
                              checked={jenisKelamin === "Perempuan"}
                              onChange={(e) => setJenisKelamin(e.target.value)}
                              className="h-4 w-4 accent-sky-500"
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
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Kontak & Alamat
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Informasi kontak dan alamat tempat tinggal siswa.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* No HP */}

                      <div>
                        <InputLabel htmlFor="no_hp">No. Handphone</InputLabel>

                        <input
                          type="tel"
                          id="no_hp"
                          value={noHP}
                          onChange={(e) => setNoHP(e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          className={inputClass("no_hp")}
                        />

                        <ErrorMessage message={error.no_hp} />
                      </div>

                      {/* Alamat */}

                      <div>
                        <InputLabel htmlFor="alamat">Alamat</InputLabel>

                        <textarea
                          id="alamat"
                          rows={5}
                          value={alamat}
                          onChange={(e) => setAlamat(e.target.value)}
                          placeholder="Masukkan alamat lengkap"
                          className={`
                            w-full
                            resize-none
                            rounded-xl
                            border
                            bg-white
                            px-3.5
                            py-3
                            text-sm
                            text-slate-700
                            outline-none
                            transition-all
                            placeholder:text-slate-400
                            focus:ring-2
                            dark:bg-slate-800
                            dark:text-slate-100
                            dark:placeholder:text-slate-500
                            ${
                              error.alamat
                                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-500/20"
                                : "border-slate-200 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-700 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                            }
                          `}
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
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Foto Profil
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Ganti foto profil siswa jika diperlukan.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">
                      {/* Preview */}

                      <div
                        className="
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          shadow-sm
                          dark:border-slate-700
                          dark:bg-slate-800
                        "
                      >
                        <div className="aspect-square">
                          {imagePreview || siswa.image_profile ? (
                            <img
                              src={
                                imagePreview ||
                                `${repoimages}${siswa.image_profile}`
                              }
                              alt="Foto profil siswa"
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

                      {/* Upload */}

                      <div className="flex flex-col justify-center">
                        <InputLabel htmlFor="image_profile">
                          Pilih Foto Baru
                        </InputLabel>

                        <input
                          type="file"
                          id="image_profile"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={onImageUpload}
                          className="
                            block
                            w-full
                            cursor-pointer
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-sm
                            text-slate-600
                            file:mr-4
                            file:cursor-pointer
                            file:border-0
                            file:border-r
                            file:border-slate-200
                            file:bg-slate-50
                            file:px-4
                            file:py-3
                            file:text-sm
                            file:font-semibold
                            file:text-slate-700
                            hover:file:bg-slate-100
                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-slate-300
                            dark:file:border-slate-700
                            dark:file:bg-slate-700
                            dark:file:text-slate-200
                            dark:hover:file:bg-slate-600
                          "
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

                <div
                  className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-slate-100
                    bg-slate-50/70
                    px-6
                    py-5
                    sm:flex-row
                    sm:justify-end
                    dark:border-slate-700
                    dark:bg-slate-800/60
                  "
                >
                  {/* Batal */}

                  <button
                    type="button"
                    onClick={() => navigate("/siswa")}
                    disabled={loading}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-slate-600
                      shadow-sm
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-300
                      dark:hover:bg-slate-700
                      dark:hover:text-slate-100
                    "
                  >
                    Batal
                  </button>

                  {/* Simpan */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-sky-500
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-sky-600
                      hover:shadow-md
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
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

export default UpdateDataSiswa;
