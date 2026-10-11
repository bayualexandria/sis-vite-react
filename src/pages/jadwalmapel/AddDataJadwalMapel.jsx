import { useEffect, useState } from "react";

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

const PlusIcon = ({ className = "size-5" }) => (
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
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

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

const CalendarIcon = ({ className = "size-5" }) => (
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
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const ClockIcon = ({ className = "size-5" }) => (
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
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
   FORM FIELD
========================================================= */

const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  icon,
  error,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="
          flex items-center gap-2
          text-xs font-bold uppercase tracking-wide
          text-slate-600
          dark:text-slate-300
        "
      >
        {icon && <span className="text-sky-500">{icon}</span>}
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-11 w-full appearance-none rounded-xl
            border bg-white px-4 pr-10
            text-sm text-slate-700
            outline-none transition-all
            focus:ring-4
            disabled:cursor-not-allowed disabled:opacity-60

            ${
              error
                ? `
                    border-rose-400
                    focus:border-rose-500
                    focus:ring-rose-500/10
                  `
                : `
                    border-slate-200
                    focus:border-sky-400
                    focus:ring-sky-500/10
                    hover:border-slate-300
                  `
            }

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-200
            dark:focus:border-sky-600
          `}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDownIcon />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
          <span>•</span>
          {error}
        </p>
      )}
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AddDataJadwalMapel({ guruMapel, jadwalMapel }) {
  const [kelas, setKelas] = useState([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [kelasID, setKelasID] = useState("");
  const [hari, setHari] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");

  const [error, setError] = useState({});

  /* =====================================================
     OPEN / CLOSE
  ===================================================== */

  const handleOpen = () => {
    setError({});
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setKelasID("");
    setHari("");
    setJamMulai("");
    setJamSelesai("");
    setError({});
  };

  /* =====================================================
     GET DATA KELAS
  ===================================================== */

  const getDataKelas = async () => {
    try {
      const response = await api.get("ruang-kelas/").then((res) => res.data);
      setKelas(response?.data || []);
    } catch (e) {
      console.error("Error get kelas:", e);

      if (e.message === "Failed to fetch") {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    getDataKelas();
  }, []);

  /* =====================================================
     SAVE DATA
  ===================================================== */

  const saveDataKelas = async (e) => {
    e.preventDefault();

    setError({});

    const newErrors = {};
    if (!kelasID) newErrors.kelas_id = "Kelas wajib dipilih.";
    if (!hari) newErrors.hari = "Hari wajib dipilih.";
    if (!jamMulai) newErrors.jam_mulai = "Jam mulai wajib dipilih.";
    if (!jamSelesai) newErrors.jam_selesai = "Jam selesai wajib dipilih.";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("kelas_id", kelasID);
    formData.append("guru_id", guruMapel.guru_id);
    formData.append("mata_pelajaran_id", guruMapel.mata_pelajaran_id);
    formData.append("hari", hari);
    formData.append("jam_mulai", jamMulai);
    formData.append("jam_selesai", jamSelesai);

    console.log(kelasID);

    try {
      const response = await api
        .post("jadwal-mapel/", formData)
        .then((res) => res.data);

      if (response.status === 403) {
        setError({
          general: response.message || "Data tidak dapat disimpan.",
        });
        setLoading(false);
        return;
      }

      if (response.status === 200) {
        setOpen(false);
        setLoading(false);

        resetForm();

        await templateModalSuccess.fire({
          icon: "success",
          title: response.message || "Jadwal mapel berhasil ditambahkan.",
        });

        if (jadwalMapel) {
          await jadwalMapel();
        }
      }
    } catch (e) {
      console.error("Error save jadwal mapel:", e);
      setLoading(false);

      if (e.response?.data?.errors) {
        setError(e.response.data.errors);
        return;
      }

      if (e.response?.data?.message) {
        setError({
          general: e.response.data.message,
        });
        return;
      }

      if (e.message === "Failed to fetch") {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
        return;
      }

      templateModalSuccess.fire({
        icon: "error",
        title: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  /* =====================================================
     OPTIONS
  ===================================================== */

  const kelasOptions = kelas.map((data) => ({
    value: data.kelas_id,
    label: `${data.nama_kelas} | ${data.jurusan}`,
  }));

  /* =====================================================
     Data Hari & Jam
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

  // Contoh generate opsi jam operasional (bisa disesuaikan format jamnya)
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 7; i <= 17; i++) {
      const hourStr = i < 10 ? `0${i}` : `${i}`;
      options.push({ value: `${hourStr}:00`, label: `${hourStr}:00` });
      options.push({ value: `${hourStr}:30`, label: `${hourStr}:30` });
    }
    return options;
  };

  const jamOptions = generateTimeOptions();

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="
          inline-flex h-10 items-center justify-center gap-2
          rounded-xl
          border border-emerald-500
          bg-emerald-500
          px-4
          text-xs font-bold text-white
          shadow-sm shadow-emerald-500/20
          transition-all duration-200
          hover:-translate-y-0.5
          hover:bg-emerald-600
          hover:border-emerald-600
          hover:shadow-lg hover:shadow-emerald-500/20
          active:translate-y-0
          focus:outline-none
          focus:ring-4 focus:ring-emerald-500/20
        "
      >
        <PlusIcon className="size-4" />
        <span>Tambah Jadwal Mapel</span>
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
          aria-labelledby="add-kelas-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            className="
              relative flex max-h-[90vh] w-full max-w-lg
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
                    id="add-kelas-title"
                    className="
                      text-base font-bold
                      text-slate-800
                      dark:text-white
                    "
                  >
                    Tambah Jadwal Mapel
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Lengkapi informasi jadwal mapel di bawah ini
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

            {/* FORM */}
            <form onSubmit={saveDataKelas} className="overflow-y-auto">
              <div className="space-y-5 p-5">
                {error.general && (
                  <div
                    className="
                      rounded-xl
                      border border-rose-200
                      bg-rose-50
                      px-4 py-3
                      text-xs font-medium text-rose-600
                      dark:border-rose-900/50
                      dark:bg-rose-950/20
                      dark:text-rose-400
                    "
                  >
                    {error.general}
                  </div>
                )}

                {/* Kelas */}
                <SelectField
                  id="kelas_id"
                  label="Kelas"
                  value={kelasID}
                  onChange={(e) => {
                    setKelasID(e.target.value);
                    if (error.kelas_id) {
                      setError((prev) => ({ ...prev, kelas_id: "" }));
                    }
                  }}
                  placeholder="Pilih kelas"
                  options={kelasOptions}
                  error={error.kelas_id}
                  icon={<ClassroomIcon className="size-4" />}
                  disabled={loading}
                />

                {/* Hari */}
                <SelectField
                  id="hari"
                  label="Hari"
                  value={hari}
                  onChange={(e) => {
                    setHari(e.target.value);
                    if (error.hari) {
                      setError((prev) => ({ ...prev, hari: "" }));
                    }
                  }}
                  placeholder="Pilih hari"
                  options={hariOptions}
                  error={error.hari}
                  icon={<CalendarIcon className="size-4" />}
                  disabled={loading}
                />

                {/* Jam Mulai & Jam Selesai (Grid 2 Kolom) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SelectField
                    id="jam_mulai"
                    label="Jam Mulai"
                    value={jamMulai}
                    onChange={(e) => {
                      setJamMulai(e.target.value);
                      if (error.jam_mulai) {
                        setError((prev) => ({ ...prev, jam_mulai: "" }));
                      }
                    }}
                    placeholder="Pilih jam mulai"
                    options={jamOptions}
                    error={error.jam_mulai}
                    icon={<ClockIcon className="size-4" />}
                    disabled={loading}
                  />

                  <SelectField
                    id="jam_selesai"
                    label="Jam Selesai"
                    value={jamSelesai}
                    onChange={(e) => {
                      setJamSelesai(e.target.value);
                      if (error.jam_selesai) {
                        setError((prev) => ({ ...prev, jam_selesai: "" }));
                      }
                    }}
                    placeholder="Pilih jam selesai"
                    options={jamOptions}
                    error={error.jam_selesai}
                    icon={<ClockIcon className="size-4" />}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div
                className="
                  flex flex-col-reverse gap-2
                  border-t border-slate-100
                  bg-slate-50/70
                  px-5 py-4
                  sm:flex-row sm:justify-end
                  dark:border-slate-800
                  dark:bg-slate-950/40
                "
              >
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="
                    h-10 rounded-xl
                    border border-slate-200
                    bg-white
                    px-5
                    text-xs font-bold
                    text-slate-600
                    transition
                    hover:border-slate-300
                    hover:bg-slate-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-slate-300
                    dark:hover:bg-slate-700
                  "
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex h-10
                    items-center justify-center gap-2
                    rounded-xl
                    border border-sky-500
                    bg-sky-500
                    px-5
                    text-xs font-bold text-white
                    shadow-sm shadow-sky-500/20
                    transition-all
                    hover:bg-sky-600
                    hover:border-sky-600
                    hover:shadow-lg hover:shadow-sky-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    focus:outline-none
                    focus:ring-4 focus:ring-sky-500/20
                  "
                >
                  {loading ? (
                    <>
                      <SpinnerIcon className="size-4" />
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
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      Simpan jadwal mapel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddDataJadwalMapel;
