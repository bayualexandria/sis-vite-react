import { useState } from "react";
import { Modal } from "@mui/material";
import api from "../../../utils/repositories";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ErrorMessage = ({ children }) => {
  if (!children) return null;

  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-500 dark:text-rose-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="size-3.5 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>

      <span>{children}</span>
    </p>
  );
};

const templateModalSuccess = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-3 py-1.5 cursor-pointer",
    cancelButton:
      "bg-rose-500 font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-3 py-1.5 cursor-pointer",
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

const FieldLabel = ({ htmlFor, children, required = false }) => {
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

function AddDataSiswa(props) {
  const [open, setOpen] = useState(false);

  const [nis, setNIS] = useState("");
  const [nama, setNama] = useState("");

  // TTL dipisahkan untuk kebutuhan tampilan form
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");

  const [email, setEmail] = useState("");
  const [noHP, setNoHP] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [alamat, setAlamat] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setError({});
  };

  const handleClose = () => {
    if (loading) return;

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNIS("");
    setNama("");
    setTempatLahir("");
    setTanggalLahir("");
    setEmail("");
    setNoHP("");
    setJenisKelamin("");
    setAlamat("");
    setError({});
  };

  const inputClass = (field) => `
    w-full
    rounded-xl
    border
    ${
      error[field]
        ? `
          border-rose-400
          bg-rose-50/40
          focus:border-rose-500
          focus:ring-rose-500/15
          dark:border-rose-500/70
          dark:bg-rose-950/20
          dark:focus:border-rose-400
          dark:focus:ring-rose-500/15
        `
        : `
          border-slate-200
          bg-white
          focus:border-sky-500
          focus:ring-sky-500/15
          dark:border-slate-700
          dark:bg-slate-800/70
          dark:focus:border-sky-500
          dark:focus:ring-sky-500/15
        `
    }
    px-3.5
    py-2.5
    text-sm
    text-slate-700
    placeholder:text-slate-400
    outline-none
    shadow-sm
    transition-all
    duration-200
    hover:border-slate-300
    focus:ring-4
    dark:text-slate-100
    dark:placeholder:text-slate-500
    dark:hover:border-slate-600
  `;

  const saveSiswa = async (e) => {
    e.preventDefault();

    setError({});

    const validationError = {};

    if (!nis.trim()) {
      validationError.nis = "No. Induk Siswa wajib diisi.";
    }

    if (!nama.trim()) {
      validationError.nama = "Nama lengkap wajib diisi.";
    }

    if (!tempatLahir.trim()) {
      validationError.tempat_lahir = "Tempat lahir wajib diisi.";
    }

    if (!tanggalLahir.trim()) {
      validationError.tanggal_lahir = "Tanggal lahir wajib diisi.";
    }

    if (!email.trim()) {
      validationError.email = "Email wajib diisi.";
    }

    if (!jenisKelamin) {
      validationError.jenis_kelamin = "Jenis kelamin wajib dipilih.";
    }

    if (!noHP.trim()) {
      validationError.no_hp = "No. Handphone wajib diisi.";
    }

    if (!alamat.trim()) {
      validationError.alamat = "Alamat wajib diisi.";
    }

    if (Object.keys(validationError).length > 0) {
      setError(validationError);
      return;
    }

    /*
     * Backend tetap menggunakan key "ttl".
     *
     * Contoh:
     * tempatLahir  = Biak
     * tanggalLahir = 28 Oktober 2025
     *
     * Hasil:
     * ttl = "Biak, 28 Oktober 2025"
     */
    const data = {
      nis: nis.trim(),
      nama: nama.trim(),
      ttl: `${tempatLahir.trim()}, ${tanggalLahir.trim()}`,
      email: email.trim(),
      no_hp: noHP.trim(),
      jenis_kelamin: jenisKelamin,
      alamat: alamat.trim(),
    };

    setLoading(true);

    try {
      let response = await api.post("siswa/", data);

      setLoading(false);
      setOpen(false);
      resetForm();
      await templateModalSuccess.fire({
        icon: "success",
        title: response?.data?.message || "Data guru berhasil ditambahkan",
      });

      if (props?.dataSiswa) {
        await props.dataSiswa();
      }
    } catch (err) {
      console.error("Gagal menyimpan data siswa:", err);
      console.log(err.response);

      setError({
        general: err.response.data.message,
      });

      setLoading(false);
    }
  };

  return (
    <>
      {/* =========================
          BUTTON TAMBAH DATA
      ========================== */}
      <button
        type="button"
        onClick={handleOpen}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-sky-500
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-lg
          shadow-sky-500/20
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-sky-600
          hover:shadow-xl
          hover:shadow-sky-500/25
          focus:outline-none
          focus:ring-4
          focus:ring-sky-500/20
          active:translate-y-0
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>

        <span>Tambah Data</span>
      </button>

      {/* =========================
          MODAL
      ========================== */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-tambah-siswa"
        aria-describedby="modal-tambah-siswa-description"
      >
        <div
          className="
            absolute
            left-1/2
            top-1/2
            flex
            max-h-[92vh]
            w-[calc(100%-2rem)]
            max-w-xl
            -translate-x-1/2
            -translate-y-1/2
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            shadow-slate-900/20
            outline-none
            dark:border-slate-700
            dark:bg-slate-900
            dark:shadow-black/40
            sm:w-[calc(100%-3rem)]
          "
        >
          {/* =========================
              HEADER
          ========================== */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-200
              bg-white
              px-5
              py-4
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-sky-50
                  text-sky-600
                  dark:bg-sky-500/10
                  dark:text-sky-400
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-.603-.105-1.17-.3-1.69m.3 1.69a9.09 9.09 0 0 1-3.75.801 9.09 9.09 0 0 1-3.75-.801m7.5 0a24.43 24.43 0 0 0-7.5 0m7.5 0v-.003c0-.603-.105-1.17-.3-1.69M12 12.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25Z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <h2
                  id="modal-tambah-siswa"
                  className="
                    truncate
                    text-base
                    font-bold
                    text-slate-800
                    dark:text-white
                  "
                >
                  Tambah Data Siswa
                </h2>

                <p
                  id="modal-tambah-siswa-description"
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Lengkapi informasi siswa dengan benar.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              aria-label="Tutup"
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-600
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:text-slate-500
                dark:hover:bg-slate-800
                dark:hover:text-slate-300
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* =========================
              FORM BODY
          ========================== */}
          <div
            className="
              overflow-y-auto
              bg-slate-50/60
              px-5
              py-5
              dark:bg-slate-950/50
            "
          >
            <form onSubmit={saveSiswa} className="space-y-5">
              {/* GENERAL ERROR */}
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
                    text-sm
                    text-rose-700
                    dark:border-rose-900/60
                    dark:bg-rose-950/30
                    dark:text-rose-300
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="mt-0.5 size-5 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>

                  <span>{error.general}</span>
                </div>
              )}

              {/* =========================
                  DATA IDENTITAS
              ========================== */}
              <section
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  shadow-sm
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <div className="mb-5">
                  <h3
                    className="
                      text-sm
                      font-bold
                      text-slate-800
                      dark:text-slate-100
                    "
                  >
                    Data Identitas
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Masukkan identitas dasar siswa.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* NIS */}
                  <div>
                    <FieldLabel htmlFor="nis" required>
                      No. Induk Siswa
                    </FieldLabel>

                    <input
                      id="nis"
                      name="nis"
                      type="text"
                      value={nis}
                      onChange={(e) => setNIS(e.target.value)}
                      placeholder="Masukkan nomor induk siswa"
                      autoComplete="off"
                      className={inputClass("nis")}
                    />

                    <ErrorMessage>{error.nis}</ErrorMessage>
                  </div>

                  {/* NAMA */}
                  <div>
                    <FieldLabel htmlFor="nama" required>
                      Nama Lengkap
                    </FieldLabel>

                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama lengkap siswa"
                      autoComplete="name"
                      className={inputClass("nama")}
                    />

                    <ErrorMessage>{error.nama}</ErrorMessage>
                  </div>

                  {/* TTL */}
                  <div>
                    <FieldLabel htmlFor="tempat_lahir" required>
                      Tempat, Tanggal Lahir
                    </FieldLabel>

                    <div
                      className="
                        flex
                        items-stretch
                        gap-2
                      "
                    >
                      {/* TEMPAT LAHIR */}
                      <div className="min-w-0 flex-1">
                        <input
                          id="tempat_lahir"
                          name="tempat_lahir"
                          type="text"
                          value={tempatLahir}
                          onChange={(e) => setTempatLahir(e.target.value)}
                          placeholder="Tempat lahir"
                          autoComplete="off"
                          className={inputClass("tempat_lahir")}
                        />
                      </div>

                      {/* COMMA */}
                      <div
                        className="
                          flex
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          text-lg
                          font-bold
                          text-slate-400
                          dark:text-slate-500
                        "
                        aria-hidden="true"
                      >
                        ,
                      </div>

                      {/* TANGGAL LAHIR */}
                      <div className="min-w-0 flex-1">
                        <input
                          id="tanggal_lahir"
                          name="tanggal_lahir"
                          type="text"
                          value={tanggalLahir}
                          onChange={(e) => setTanggalLahir(e.target.value)}
                          placeholder="Tanggal lahir"
                          autoComplete="off"
                          className={inputClass("tanggal_lahir")}
                        />
                      </div>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                      Contoh:{" "}
                      <span className="font-medium">Biak, 28 Oktober 2025</span>
                    </p>

                    <ErrorMessage>{error.tempat_lahir}</ErrorMessage>
                    <ErrorMessage>{error.tanggal_lahir}</ErrorMessage>
                    <ErrorMessage>{error.tempat_tanggal_lahir}</ErrorMessage>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <FieldLabel htmlFor="email" required>
                      Email
                    </FieldLabel>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      autoComplete="email"
                      className={inputClass("email")}
                    />

                    <ErrorMessage>{error.email}</ErrorMessage>
                  </div>

                  {/* JENIS KELAMIN */}
                  <div>
                    <FieldLabel required>Jenis Kelamin</FieldLabel>

                    <div className="grid grid-cols-2 gap-3">
                      {/* LAKI-LAKI */}
                      <button
                        type="button"
                        onClick={() => setJenisKelamin("Laki-laki")}
                        className={`
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-left
                          transition-all
                          duration-200
                          ${
                            jenisKelamin === "Laki-laki"
                              ? `
                                border-sky-500
                                bg-sky-50
                                text-sky-700
                                shadow-sm
                                dark:border-sky-500
                                dark:bg-sky-500/10
                                dark:text-sky-300
                              `
                              : `
                                border-slate-200
                                bg-white
                                text-slate-600
                                hover:border-slate-300
                                hover:bg-slate-50
                                dark:border-slate-700
                                dark:bg-slate-800/60
                                dark:text-slate-300
                                dark:hover:border-slate-600
                                dark:hover:bg-slate-800
                              `
                          }
                        `}
                      >
                        <span
                          className={`
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            ${
                              jenisKelamin === "Laki-laki"
                                ? "bg-sky-500 text-white"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                            }
                          `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6.75h.008v.008h-.008V6.75ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                            />
                          </svg>
                        </span>

                        <span className="text-sm font-semibold">Laki-laki</span>
                      </button>

                      {/* PEREMPUAN */}
                      <button
                        type="button"
                        onClick={() => setJenisKelamin("Perempuan")}
                        className={`
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-left
                          transition-all
                          duration-200
                          ${
                            jenisKelamin === "Perempuan"
                              ? `
                                border-pink-500
                                bg-pink-50
                                text-pink-700
                                shadow-sm
                                dark:border-pink-500
                                dark:bg-pink-500/10
                                dark:text-pink-300
                              `
                              : `
                                border-slate-200
                                bg-white
                                text-slate-600
                                hover:border-slate-300
                                hover:bg-slate-50
                                dark:border-slate-700
                                dark:bg-slate-800/60
                                dark:text-slate-300
                                dark:hover:border-slate-600
                                dark:hover:bg-slate-800
                              `
                          }
                        `}
                      >
                        <span
                          className={`
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            ${
                              jenisKelamin === "Perempuan"
                                ? "bg-pink-500 text-white"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                            }
                          `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM12 15.75v4.5m-2.25-2.25h4.5"
                            />
                          </svg>
                        </span>

                        <span className="text-sm font-semibold">Perempuan</span>
                      </button>
                    </div>

                    <ErrorMessage>{error.jenis_kelamin}</ErrorMessage>
                  </div>
                </div>
              </section>

              {/* =========================
                  KONTAK
              ========================== */}
              <section
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  shadow-sm
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <div className="mb-5">
                  <h3
                    className="
                      text-sm
                      font-bold
                      text-slate-800
                      dark:text-slate-100
                    "
                  >
                    Informasi Kontak
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Lengkapi informasi kontak dan alamat siswa.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* NO HP */}
                  <div>
                    <FieldLabel htmlFor="no_hp" required>
                      No. Handphone
                    </FieldLabel>

                    <input
                      id="no_hp"
                      name="no_hp"
                      type="tel"
                      value={noHP}
                      onChange={(e) => setNoHP(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      autoComplete="tel"
                      className={inputClass("no_hp")}
                    />

                    <ErrorMessage>{error.no_hp}</ErrorMessage>
                  </div>

                  {/* ALAMAT */}
                  <div>
                    <FieldLabel htmlFor="alamat" required>
                      Alamat
                    </FieldLabel>

                    <textarea
                      id="alamat"
                      name="alamat"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Masukkan alamat lengkap siswa"
                      rows={4}
                      className={`
                        ${inputClass("alamat")}
                        resize-none
                      `}
                    />

                    <ErrorMessage>{error.alamat}</ErrorMessage>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* =========================
              FOOTER
          ========================== */}
          <div
            className="
              flex
              flex-col-reverse
              gap-2
              border-t
              border-slate-200
              bg-white
              px-5
              py-4
              sm:flex-row
              sm:justify-end
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
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
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-300
                dark:hover:border-slate-600
                dark:hover:bg-slate-700
                dark:hover:text-white
              "
            >
              Batal
            </button>

            <button
              type="submit"
              form=""
              disabled={loading}
              onClick={(e) => {
                const form = e.currentTarget
                  .closest("div")
                  ?.previousElementSibling?.querySelector("form");

                if (form) {
                  form.requestSubmit();
                }
              }}
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
                shadow-lg
                shadow-sky-500/20
                transition-all
                duration-200
                hover:bg-sky-600
                hover:shadow-xl
                hover:shadow-sky-500/25
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <svg
                    className="size-4 animate-spin"
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4Z"
                    />
                  </svg>

                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>

                  <span>Simpan Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddDataSiswa;
