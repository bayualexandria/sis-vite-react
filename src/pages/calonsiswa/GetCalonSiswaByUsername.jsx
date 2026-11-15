import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import Main from "../../components/Main/Main";
import api from "../../utils/repositories";
import repo from "../../utils/repo";

/* =========================================================
   ICONS
========================================================= */

const Icons = {
  ChevronRight: ({ className = "h-4 w-4" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  ),
  User: ({ className = "h-5 w-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z"
      />
    </svg>
  ),
  Users: ({ className = "h-5 w-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.722a10.5 10.5 0 0 0-3.112-7.394M12 11.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm-9.75 9.75a15.02 15.02 0 0 1 12.375-6.187m3.375 2.437v4.5m-2.25-2.25h4.5"
      />
    </svg>
  ),
  CheckCircle: ({ className = "h-4 w-4" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  ),
  Document: ({ className = "h-5 w-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  ),
  Eye: ({ className = "h-4 w-4" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  ),
  Close: ({ className = "h-5 w-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  ),
};

/* =========================================================
   DETAIL CALON SISWA BY USERNAME
========================================================= */

function GetCalonSiswaByUsername() {
  const [siswa, setSiswa] = useState(null);
  const [persyaratan, setPersyaratan] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal dokumen
  const [selectedDoc, setSelectedDoc] = useState(null);

  // State untuk modal verifikasi
  const [isVerifModalOpen, setIsVerifModalOpen] = useState(false);
  const [statusVerifikasi, setStatusVerifikasi] = useState("Pending");
  const [catatanVerifikasi, setCatatanVerifikasi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { username } = useParams();
  const navigate = useNavigate();

  const dataSiswaByUsername = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`siswa-ppdb/${username}`);
      const data = response?.data?.data;
      setSiswa(data || null);
    } catch (error) {
      console.error("Gagal mengambil data siswa PPDB:", error);
      setSiswa(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const dataPersyaratanSiswaByUsername = useCallback(async () => {
    if (!username) return;
    try {
      const response = await api.get(`siswa-ppdb/persyaratan/${username}`);
      const data = response?.data?.data ?? [];
      setPersyaratan(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data persyaratan PPDB:", error);
      setPersyaratan([]);
    }
  }, [username]);

  useEffect(() => {
    dataSiswaByUsername();
    dataPersyaratanSiswaByUsername();
  }, [dataSiswaByUsername, dataPersyaratanSiswaByUsername]);

  // Handler buka modal verifikasi
  const handleOpenVerifModal = () => {
    setStatusVerifikasi(
      siswa?.status || siswa?.status_pendaftaran || "Pending",
    );
    setCatatanVerifikasi(siswa?.catatan_verifikasi || "");
    setIsVerifModalOpen(true);
  };

  const formData = new FormData();
  formData.append("status_verifikasi", statusVerifikasi);
  formData.append("catatan_verifikasi", catatanVerifikasi);

  // Handler Submit Verifikasi (API Patch & Redirect)
  const handleUpdateVerifikasi = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.patch(`siswa-ppdb/pendaftaran/${username}`, formData);

      setIsVerifModalOpen(false);
      navigate("/siswa-ppdb");
    } catch (error) {
      console.log("Gagal mengupdate verifikasi:", error.response);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengupdate data.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Main>
      <div className="min-h-screen bg-slate-100 pt-[76px] dark:bg-slate-950 lg:ml-64">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* HEADER & BREADCRUMB */}
          <div className="mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                <Link to="/" className="transition hover:text-sky-500">
                  Dashboard
                </Link>
                <Icons.ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Profil Pendaftaran
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                Detail Informasi Calon Siswa
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Informasi status pendaftaran, data diri, data orang tua, dan
                kelengkapan dokumen persyaratan Anda.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"></div>
                <span className="text-sm font-medium">
                  Memuat profil pendaftaran...
                </span>
              </div>
            </div>
          ) : !siswa ? (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Icons.User className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Data Siswa Tidak Ditemukan
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Pastikan Anda sudah mengisi formulir pendaftaran PPDB.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* KARTU PROFIL UTAMA & STATUS */}
              <div className="lg:col-span-1 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                  <div className="text-center pb-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-100 font-bold text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 text-2xl shadow-inner mb-3">
                      {(siswa.calon_siswa?.nama_lengkap || "S")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                      {siswa.calon_siswa?.nama_lengkap || "Tanpa Nama"}
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      NISN: {siswa.calon_siswa?.nisn || "Belum diisi"}
                    </p>
                    <div className="mt-3 inline-block">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          (siswa.status || siswa.status_pendaftaran) ===
                            "Diverifikasi" ||
                          (siswa.status || siswa.status_pendaftaran) ===
                            "Diterima"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : (siswa.status || siswa.status_pendaftaran) ===
                                "Ditolak"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                        }`}
                      >
                        Status:{" "}
                        {siswa.status || siswa.status_pendaftaran || "Pending"}
                      </span>
                    </div>

                    {/* Tombol Verifikasi */}
                    <div className="mt-4">
                      <button
                        onClick={handleOpenVerifModal}
                        className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Verifikasi Pendaftaran
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Jenis Kelamin:</span>
                      <span className="font-semibold">
                        {siswa.calon_siswa?.jenis_kelamin || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Tempat, Tgl Lahir:</span>
                      <span className="font-semibold">
                        {siswa.calon_siswa?.ttl
                          ? `${siswa.calon_siswa.ttl}`
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 font-mono">
                      No. Registrasi: {username}
                    </span>
                  </div>
                </div>
              </div>

              {/* KARTU DETAIL DATA CALON SISWA & ORANG TUA */}
              <div className="lg:col-span-2 space-y-6">
                {/* DATA CALON SISWA */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                      <Icons.User className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                      Informasi Data Calon Siswa
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        NIK Siswa
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.calon_siswa?.nik || "-"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">Agama</span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.calon_siswa?.agama || "-"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                      <span className="text-slate-400 block mb-1">
                        Alamat Lengkap
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.calon_siswa?.alamat || "-"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        Sekolah Asal
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.calon_siswa?.sekolah_asal || "-"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        Tahun Lulus
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.calon_siswa?.tahun_lulus || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DATA ORANG TUA / WALI */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                      <Icons.Users className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                      Informasi Data Orang Tua / Wali
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        Nama Ayah
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.orang_tua?.nama_ayah || siswa.nama_ayah || "-"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        Pekerjaan Ayah
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.orang_tua?.pekerjaan_ayah ||
                          siswa.pekerjaan_ayah ||
                          "-"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        Nama Ibu
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.orang_tua?.nama_ibu || siswa.nama_ibu || "-"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        Pekerjaan Ibu
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.orang_tua?.pekerjaan_ibu ||
                          siswa.pekerjaan_ibu ||
                          "-"}
                      </span>
                    </div>

                    {siswa.orang_tua?.nama_wali && (
                      <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block mb-1">
                          Nama Wali
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {siswa.orang_tua.nama_wali}
                        </span>
                      </div>
                    )}
                    {siswa.orang_tua?.pekerjaan_wali && (
                      <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block mb-1">
                          Pekerjaan Wali
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {siswa.orang_tua.pekerjaan_wali}
                        </span>
                      </div>
                    )}

                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                      <span className="text-slate-400 block mb-1">
                        No. HP / Kontak Orang Tua
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {siswa.orang_tua?.nomor_telepon ||
                          siswa.no_hp_ortu ||
                          "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* KARTU PERSYARATAN & DOKUMEN */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                        <Icons.Document className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">
                        Kelengkapan Dokumen Persyaratan
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      Total: {persyaratan.length} Berkas
                    </span>
                  </div>

                  <div className="mt-5">
                    {persyaratan.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 dark:text-slate-500">
                        <p className="text-sm font-medium">
                          Belum ada data persyaratan yang diunggah.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {persyaratan.map((item, idx) => {
                          const filePath = item.path_file;
                          const fullFileUrl = filePath
                            ? filePath.startsWith("http")
                              ? filePath
                              : `${repo}${filePath}`
                            : null;

                          return (
                            <div
                              key={item.id || idx}
                              className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 gap-3"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-semibold text-slate-800 dark:text-white text-xs">
                                    {item.jenis_dokumen ||
                                      item.nama ||
                                      `Dokumen #${idx + 1}`}
                                  </h4>
                                  <p className="text-[11px] text-slate-400">
                                    {item.keterangan ||
                                      "File dokumen pendukung pendaftaran"}
                                  </p>
                                </div>
                                <div>
                                  {item.status === "Terverifikasi" ||
                                  item.is_verified ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                      <Icons.CheckCircle className="h-3 w-3" />{" "}
                                      Valid
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                      Pending
                                    </span>
                                  )}
                                </div>
                              </div>

                              {fullFileUrl ? (
                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end">
                                  <button
                                    onClick={() =>
                                      setSelectedDoc({
                                        name:
                                          item.jenis_dokumen ||
                                          item.nama ||
                                          `Dokumen #${idx + 1}`,
                                        url: fullFileUrl,
                                      })
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-400 dark:hover:bg-sky-900/50"
                                  >
                                    <Icons.Eye className="h-3.5 w-3.5" />
                                    <span>Lihat Dokumen</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-right">
                                  <span className="text-[11px] text-slate-400 italic">
                                    File tidak tersedia
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              MODAL PREVIEW DOKUMEN
          ========================================================= */}
          {selectedDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                      {selectedDoc.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pratinjau berkas dokumen persyaratan
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <Icons.Close className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-950 overflow-auto flex flex-col items-center justify-center min-h-[450px]">
                  {selectedDoc.url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                    <img
                      src={selectedDoc.url}
                      alt={selectedDoc.name}
                      className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
                    />
                  ) : selectedDoc.url.match(/\.pdf$/i) ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <iframe
                        src={selectedDoc.url}
                        title={selectedDoc.name}
                        className="w-full h-[65vh] rounded-lg border border-slate-200 dark:border-slate-800 bg-white shadow-inner"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Pratinjau langsung tidak tersedia untuk format file ini.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <a
                    href={selectedDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Buka di Tab Baru
                  </a>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              MODAL FORM VERIFIKASI
          ========================================================= */}
          {isVerifModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    Form Verifikasi Pendaftaran
                  </h3>
                  <button
                    onClick={() => setIsVerifModalOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <Icons.Close className="h-5 w-5" />
                  </button>
                </div>

                <form
                  onSubmit={handleUpdateVerifikasi}
                  className="p-6 space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
                      Status Verifikasi
                    </label>
                    <select
                      value={statusVerifikasi}
                      onChange={(e) => setStatusVerifikasi(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diverifikasi">Diverifikasi</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
                      Catatan Verifikasi
                    </label>
                    <textarea
                      rows="4"
                      value={catatanVerifikasi}
                      onChange={(e) => setCatatanVerifikasi(e.target.value)}
                      placeholder="Masukkan catatan verifikasi..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsVerifModalOpen(false)}
                      className="rounded-xl bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                    >
                      {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Main>
  );
}

export default GetCalonSiswaByUsername;
