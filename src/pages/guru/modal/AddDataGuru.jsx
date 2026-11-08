import { useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import api from "../../../utils/repositories";

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

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="mt-1 text-xs font-medium text-rose-500 dark:text-rose-400">
      {message}
    </p>
  );
};

function AddDataSiswa(props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [nip, setNIP] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [noHP, setNoHP] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [alamat, setAlamat] = useState("");
  const [status, setStatus] = useState("");
  const [statusGuru, setGuruStatus] = useState("");

  const handleOpen = () => {
    setError({});
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const resetForm = () => {
    setNIP("");
    setNama("");
    setEmail("");
    setTempatLahir("");
    setTanggalLahir("");
    setPendidikan("");
    setNoHP("");
    setJenisKelamin("");
    setAlamat("");
    setStatus("");
    setGuruStatus("");
    setError({});
  };

  const data = {
    nip,
    nama,
    email,
    ttl:
      tempatLahir && tanggalLahir
        ? `${tempatLahir.trim()}, ${tanggalLahir.trim()}`
        : "",
    pendidikan,
    no_hp: noHP,
    jenis_kelamin: jenisKelamin,
    alamat,
    status_id: status,
    status_guru_id: statusGuru,
  };

  const saveGuru = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError({});

    try {
      const response = await api.post("guru/", data);

      setOpen(false);
      resetForm();

      await templateModalSuccess.fire({
        icon: "success",
        title: response?.data?.message || "Data guru berhasil ditambahkan",
      });

      if (props?.dataGuru) {
        await props.dataGuru();
      }
    } catch (error) {
      console.error("error post guru", error?.response);

      const statusCode = error?.response?.status;
      const responseData = error?.response?.data;

      if (statusCode === 400) {
        setError(responseData?.data || {});
      } else {
        await templateModalSuccess.fire({
          icon: "error",
          title:
            responseData?.message ||
            "Terjadi kesalahan saat menyimpan data guru",
        });

        if (statusCode === 403) {
          setOpen(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 " +
    "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/40";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200";

  return (
    <>
      {/* BUTTON TAMBAH */}
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-emerald-600 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>

        <span>Tambah Data</span>
      </button>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-slate-700 dark:bg-slate-900">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Tambah Data Guru
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Lengkapi informasi guru di bawah ini.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* BODY */}
            <div className="overflow-y-auto px-6 py-5">
              <form onSubmit={saveGuru} className="flex flex-col gap-5">
                {/* NIP & NAMA */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nip" className={labelClass}>
                      NIP
                    </label>

                    <input
                      id="nip"
                      name="nip"
                      type="text"
                      value={nip}
                      onChange={(e) => setNIP(e.target.value)}
                      placeholder="Masukkan NIP"
                      className={inputClass}
                    />

                    <ErrorMessage message={error.nip} />
                  </div>

                  <div>
                    <label htmlFor="nama" className={labelClass}>
                      Nama Lengkap
                    </label>

                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className={inputClass}
                    />

                    <ErrorMessage message={error.nama} />
                  </div>
                </div>

                {/* TEMPAT, TANGGAL LAHIR */}
                <div>
                  <label className={labelClass}>Tempat, Tanggal Lahir</label>
                  <div
                    className={`flex overflow-hidden rounded-lg border bg-white transition-all duration-200 focus-within:ring-4 dark:bg-slate-800 ${
                      error.ttl
                        ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100 dark:border-rose-500 dark:focus-within:border-rose-400 dark:focus-within:ring-rose-500/20"
                        : "border-slate-300 focus-within:border-sky-500 focus-within:ring-sky-100 dark:border-slate-600 dark:focus-within:border-sky-400 dark:focus-within:ring-sky-900/40"
                    }`}
                  >
                    <input
                      type="text"
                      id="tempat_lahir"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      placeholder="Tempat lahir"
                      className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />

                    <div className="flex items-center justify-center border-x border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
                      ,
                    </div>

                    <input
                      type="text"
                      id="tanggal_lahir"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      placeholder="Tanggal lahir (Contoh: 28 Oktober 2025)"
                      className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <ErrorMessage message={error.ttl} />
                </div>

                {/* PENDIDIKAN & STATUS GURU */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pendidikan" className={labelClass}>
                      Pendidikan Terakhir
                    </label>

                    <select
                      id="pendidikan"
                      name="pendidikan"
                      value={pendidikan}
                      onChange={(e) => setPendidikan(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">-- Pilih Pendidikan --</option>

                      {/* SARJANA (S1) */}
                      <optgroup label="--- STRATA 1 (S1) ---">
                        {/* FKIP & Kependidikan */}
                        <option value="S1 Pendidikan Guru PAUD">
                          S1 Pendidikan Guru PAUD (PGPAUD)
                        </option>
                        <option value="S1 Pendidikan Guru SD">
                          S1 Pendidikan Guru SD (PGSD)
                        </option>
                        <option value="S1 Pendidikan Matematika">
                          S1 Pendidikan Matematika
                        </option>
                        <option value="S1 Pendidikan Bahasa Indonesia">
                          S1 Pendidikan Bahasa Indonesia
                        </option>
                        <option value="S1 Pendidikan Bahasa Inggris">
                          S1 Pendidikan Bahasa Inggris
                        </option>
                        <option value="S1 Pendidikan Olahraga">
                          S1 Pendidikan Olahraga (PJKR)
                        </option>
                        <option value="S1 Pendidikan Biologi">
                          S1 Pendidikan Biologi
                        </option>
                        <option value="S1 Pendidikan Fisika">
                          S1 Pendidikan Fisika
                        </option>
                        <option value="S1 Pendidikan Kimia">
                          S1 Pendidikan Kimia
                        </option>
                        <option value="S1 Pendidikan Sejarah">
                          S1 Pendidikan Sejarah
                        </option>
                        <option value="S1 Pendidikan Geografi">
                          S1 Pendidikan Geografi
                        </option>
                        <option value="S1 Pendidikan Ekonomi">
                          S1 Pendidikan Ekonomi
                        </option>
                        <option value="S1 Pendidikan Agama Islam">
                          S1 Pendidikan Agama Islam (PAI)
                        </option>
                        <option value="S1 Pendidikan Pancasila dan Kewarganegaraan">
                          S1 Pendidikan PPKn
                        </option>
                        <option value="S1 Bimbingan Konseling">
                          S1 Bimbingan Konseling (BK)
                        </option>
                        <option value="S1 Pendidikan Seni Musik / Rupa">
                          S1 Pendidikan Seni
                        </option>

                        {/* Teknik & Komputer */}
                        <option value="S1 Teknik Informatika">
                          S1 Teknik Informatika
                        </option>
                        <option value="S1 Sistem Informasi">
                          S1 Sistem Informasi
                        </option>
                        <option value="S1 Teknik Sipil">S1 Teknik Sipil</option>
                        <option value="S1 Teknik Mesin">S1 Teknik Mesin</option>
                        <option value="S1 Teknik Elektro">
                          S1 Teknik Elektro
                        </option>
                        <option value="S1 Teknik Industri">
                          S1 Teknik Industri
                        </option>
                        <option value="S1 Arsitektur">S1 Arsitektur</option>

                        {/* Ekonomi & Bisnis */}
                        <option value="S1 Manajemen">S1 Manajemen</option>
                        <option value="S1 Akuntansi">S1 Akuntansi</option>
                        <option value="S1 Ekonomi Pembangunan">
                          S1 Ekonomi Pembangunan
                        </option>
                        <option value="S1 Bisnis Digital">
                          S1 Bisnis Digital
                        </option>

                        {/* Sosial, Hukum, Psikologi & Hum */}
                        <option value="S1 Ilmu Hukum">S1 Ilmu Hukum</option>
                        <option value="S1 Ilmu Komunikasi">
                          S1 Ilmu Komunikasi
                        </option>
                        <option value="S1 Psikologi">S1 Psikologi</option>
                        <option value="S1 Sastra Inggris">
                          S1 Sastra Inggris
                        </option>

                        {/* Sains Murni */}
                        <option value="S1 Matematika">S1 Matematika</option>
                        <option value="S1 Fisika">S1 Fisika</option>
                        <option value="S1 Kimia">S1 Kimia</option>
                        <option value="S1 Biologi">S1 Biologi</option>
                        <option value="S1 Statistika">S1 Statistika</option>
                      </optgroup>

                      {/* MAGISTER (S2) */}
                      <optgroup label="--- STRATA 2 (S2) ---">
                        {/* Kependidikan & Manajemen Pendidikan */}
                        <option value="S2 Manajemen Pendidikan">
                          S2 Manajemen Pendidikan
                        </option>
                        <option value="S2 Pendidikan Dasar">
                          S2 Pendidikan Dasar
                        </option>
                        <option value="S2 Pendidikan Matematika">
                          S2 Pendidikan Matematika
                        </option>
                        <option value="S2 Pendidikan Bahasa Indonesia">
                          S2 Pendidikan Bahasa Indonesia
                        </option>
                        <option value="S2 Pendidikan Bahasa Inggris">
                          S2 Pendidikan Bahasa Inggris
                        </option>
                        <option value="S2 Teknologi Pembelajaran">
                          S2 Teknologi Pembelajaran
                        </option>
                        <option value="S2 Pendidikan Agama Islam">
                          S2 Pendidikan Agama Islam
                        </option>
                        <option value="S2 Pendidikan Olahraga">
                          S2 Pendidikan Olahraga
                        </option>

                        {/* Non-Kependidikan / Terapan */}
                        <option value="S2 Magister Manajemen">
                          S2 Magister Manajemen (MM)
                        </option>
                        <option value="S2 Magister Akuntansi">
                          S2 Magister Akuntansi (M.Ak)
                        </option>
                        <option value="S2 Magister Teknik Informatika">
                          S2 Magister Teknik Informatika
                        </option>
                        <option value="S2 Magister Teknik Sipil">
                          S2 Magister Teknik Sipil
                        </option>
                        <option value="S2 Magister Ilmu Hukum">
                          S2 Magister Ilmu Hukum (M.H.)
                        </option>
                        <option value="S2 Magister Ilmu Komunikasi">
                          S2 Magister Ilmu Komunikasi
                        </option>
                        <option value="S2 Magister Psikologi">
                          S2 Magister Psikologi
                        </option>
                        <option value="S2 Magister Administrasi Publik">
                          S2 Magister Administrasi Publik (MAP)
                        </option>
                      </optgroup>
                    </select>

                    <ErrorMessage message={error.pendidikan} />
                  </div>

                  <div>
                    <label htmlFor="status_guru" className={labelClass}>
                      Status Guru
                    </label>

                    <select
                      name="status_guru"
                      id="status_guru"
                      value={statusGuru}
                      onChange={(e) => setGuruStatus(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">-- Pilih Status --</option>
                      <option value="1">Kepala Sekolah</option>
                      <option value="2">Wakil Kepala Sekolah</option>
                      <option value="3">Wali Kelas</option>
                      <option value="4">Guru Tetap</option>
                      <option value="5">Guru Honorer</option>
                    </select>

                    <ErrorMessage message={error.status_guru_id} />
                  </div>
                </div>

                {/* EMAIL & NO HP */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className={inputClass}
                    />

                    <ErrorMessage message={error.email} />
                  </div>

                  <div>
                    <label htmlFor="no_hp" className={labelClass}>
                      No. Handphone
                    </label>

                    <input
                      id="no_hp"
                      name="no_hp"
                      type="tel"
                      value={noHP}
                      onChange={(e) => setNoHP(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className={inputClass}
                    />

                    <ErrorMessage message={error.no_hp} />
                  </div>
                </div>

                {/* JENIS KELAMIN & STATUS USER */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Jenis Kelamin</label>

                    <div className="grid grid-cols-2 gap-3">
                      {/* LAKI-LAKI */}
                      <label
                        htmlFor="Laki-laki"
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                          jenisKelamin === "Laki-laki"
                            ? "border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-300"
                            : "border-slate-300 bg-white text-slate-600 hover:border-sky-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="jenis_kelamin"
                          id="Laki-laki"
                          value="Laki-laki"
                          checked={jenisKelamin === "Laki-laki"}
                          onChange={(e) => setJenisKelamin(e.target.value)}
                          className="h-4 w-4 accent-sky-500"
                        />

                        <span className="text-sm font-medium">Laki-laki</span>
                      </label>

                      {/* PEREMPUAN */}
                      <label
                        htmlFor="Perempuan"
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                          jenisKelamin === "Perempuan"
                            ? "border-pink-500 bg-pink-50 text-pink-700 dark:border-pink-400 dark:bg-pink-950/50 dark:text-pink-300"
                            : "border-slate-300 bg-white text-slate-600 hover:border-pink-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-pink-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="jenis_kelamin"
                          id="Perempuan"
                          value="Perempuan"
                          checked={jenisKelamin === "Perempuan"}
                          onChange={(e) => setJenisKelamin(e.target.value)}
                          className="h-4 w-4 accent-pink-500"
                        />

                        <span className="text-sm font-medium">Perempuan</span>
                      </label>
                    </div>

                    <ErrorMessage message={error.jenis_kelamin} />
                  </div>

                  <div>
                    <label htmlFor="status" className={labelClass}>
                      Status User
                    </label>

                    <select
                      name="status"
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">-- Pilih Status --</option>
                      <option value="1">Admin</option>
                      <option value="2">Wali Kelas</option>
                      <option value="3">Guru</option>
                    </select>

                    <ErrorMessage message={error.status_id} />
                  </div>
                </div>

                {/* ALAMAT */}
                <div>
                  <label htmlFor="alamat" className={labelClass}>
                    Alamat
                  </label>

                  <textarea
                    id="alamat"
                    name="alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />

                  <ErrorMessage message={error.alamat} />
                </div>

                {/* FOOTER */}
                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                  {/* BATAL */}
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Batal
                  </button>

                  {/* SIMPAN */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-500 bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
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
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0 4.991v-4.99"
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
                          strokeWidth="2"
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Simpan Data
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddDataSiswa;
