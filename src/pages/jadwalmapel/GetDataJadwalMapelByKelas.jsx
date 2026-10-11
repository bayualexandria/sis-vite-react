import {  useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import api from "../../utils/repositories";

/* =========================================================
   SWEET ALERT
========================================================= */

const templateModalSuccess = withReactContent(Swal).mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,

  customClass: {
    popup: "z-[99999] rounded-xl shadow-2xl",
  },

  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

/* =========================================================
   ICONS
========================================================= */

const CloseIcon = ({ className = "size-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const ClassroomIcon = ({ className = "size-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
    />
  </svg>
);

const ChevronDownIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const SpinnerIcon = ({ className = "size-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={`${className} animate-spin`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

function GetDataJadwalMapelByKelas({ row }) {
  const [jadwalList, setJadwalList] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHari, setSelectedHari] = useState("");

  /* =====================================================
     GET DATA JADWAL KELAS
  ===================================================== */

  const getDataKelas = async () => {
    setLoading(true);
    try {
      const response = await api
        .get(`jadwal-mapel/kelas/${row.kelas_id}`)
        .then((res) => res.data);

      setJadwalList(response?.data || []);
    } catch (e) {
      console.error("Error get jadwal kelas:", e);

      if (e.message === "Failed to fetch" || e.code === "ERR_NETWORK") {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     OPEN / CLOSE MODAL
  ===================================================== */

  const handleOpen = () => {
    setSelectedHari("");
    setOpen(true);
    getDataKelas();
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  /* =====================================================
     OPTIONS & FILTER HARI
  ===================================================== */

  const hariOptions = [
    { value: "Senin", label: "Senin" },
    { value: "Selasa", label: "Selasa" },
    { value: "Rabu", label: "Rabu" },
    { value: "Kamis", label: "Kamis" },
    { value: "Jumat", label: "Jumat" },
    { value: "Sabtu", label: "Sabtu" },
    { value: "Minggu", label: "Minggu" },
  ];

  const filteredJadwal = selectedHari
    ? jadwalList.filter(
        (item) => item.hari?.toLowerCase() === selectedHari.toLowerCase(),
      )
    : jadwalList;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        title="Detail Jadwal"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-4 w-4"
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
      </button>

      {open && (
        <div
          className="
            fixed inset-0 z-[9990]
            flex items-center justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-jadwal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            className="
              relative flex max-h-[90vh] w-full max-w-2xl
              flex-col overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white
              shadow-2xl shadow-slate-950/20
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            {/* HEADER */}
            <div
              className="
                flex shrink-0 items-center justify-between
                border-b border-slate-100
                px-5 py-4
                dark:border-slate-800
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex size-10 items-center justify-center
                    rounded-xl
                    bg-sky-50
                    text-sky-500
                    dark:bg-sky-950/40
                  "
                >
                  <ClassroomIcon className="size-5" />
                </div>

                <div>
                  <h2
                    id="detail-jadwal-title"
                    className="
                      text-base font-bold
                      text-slate-800
                      dark:text-white
                    "
                  >
                    Jadwal Kelas {row.nama_kelas} - {row.jurusan}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Daftar mata pelajaran berdasarkan jadwal kelas
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="
                  flex size-9 items-center justify-center
                  rounded-xl
                  border border-slate-200
                  bg-white
                  text-slate-400
                  transition
                  hover:border-rose-200
                  hover:bg-rose-50
                  hover:text-rose-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:hover:border-rose-900
                  dark:hover:bg-rose-950/30
                "
                aria-label="Tutup modal"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* FILTER HARI */}
            <div className="px-5 pt-4">
              <div className="relative">
                <select
                  value={selectedHari}
                  onChange={(e) => setSelectedHari(e.target.value)}
                  className="
                    h-10 w-full appearance-none rounded-xl
                    border border-slate-200 bg-white px-4 pr-10
                    text-xs font-medium text-slate-700
                    outline-none transition-all
                    focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10
                    dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
                  "
                >
                  <option value="">Semua Hari</option>
                  {hariOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {/* BODY / CONTENT */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <SpinnerIcon className="size-8 text-sky-500 mb-2" />
                  <p className="text-sm font-medium">Memuat data jadwal...</p>
                </div>
              ) : filteredJadwal.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        {/* Kolom Hari diperlebar menggunakan w-36 */}
                        <th className="w-24 px-4 py-3">Hari</th>
                        <th className="px-4 py-3">Jam</th>
                        <th className="px-4 py-3">Mata Pelajaran</th>
                        <th className="px-4 py-3">Guru Pengampu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                      {filteredJadwal.map((item, index) => (
                        <tr
                          key={item.jadwal_id || index}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                        >
                          <td className="w-24 px-4 py-3 font-semibold">
                            {item.hari || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.jam_mulai} - {item.jam_selesai}
                          </td>
                          <td className="px-4 py-3 font-medium text-sky-600 dark:text-sky-400">
                            {item.nama_mapel || item.mapel || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {item.nama_guru || item.guru || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <ClassroomIcon className="size-12 mb-2 opacity-40" />
                  <p className="text-sm font-medium">
                    {selectedHari
                      ? `Tidak ada jadwal untuk hari ${selectedHari}.`
                      : "Belum ada jadwal mata pelajaran untuk kelas ini."}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 items-center justify-end border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GetDataJadwalMapelByKelas;
