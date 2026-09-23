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

const UserIcon = ({ className = "size-5" }) => (
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
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.499-1.632Z"
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

function AddDataKelas({ getKelasHistory }) {
  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [kelasID, setKelasID] = useState("");
  const [guruID, setGuruID] = useState("");

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
    setGuruID("");
    setError({});
  };

  /* =====================================================
     GET DATA KELAS
  ===================================================== */

  const getDataKelas = async () => {
    try {
      const response = await api.get("kelas/").then((res) => res.data);

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
     GET DATA GURU
  ===================================================== */

  const getDataGuru = async () => {
    try {
      const response = await api.get("guru/").then((res) => res.data);

      setGuru(response?.data || []);
    } catch (e) {
      console.error("Error get guru:", e);

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
    getDataGuru();
  }, []);

  /* =====================================================
     SAVE DATA
  ===================================================== */

  const saveDataKelas = async (e) => {
    e.preventDefault();

    setError({});

    if (!kelasID || !guruID) {
      setError({
        kelas_id: !kelasID ? "Kelas wajib dipilih." : "",
        wali_kelas: !guruID ? "Wali kelas wajib dipilih." : "",
      });

      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("kelas_id", kelasID);
    formData.append("guru_wali_id", guruID);
    // const dataKelas = {
    //   kelas_id: Number(kelasID),
    //   wali_kelas: Number(guruID),
    // };
    console.log("add kelas", formData);

    try {
      const response = await api
        .post("ruang-kelas/", formData)
        .then((res) => res.data);

      /* ================================================
         VALIDATION ERROR
      ================================================ */

      if (response.status === 403) {
        setError({
          general: response.message || "Data tidak dapat disimpan.",
        });

        setLoading(false);

        return;
      }

      /* ================================================
         SUCCESS
      ================================================ */

      if (response.status === 200) {
        setOpen(false);
        setLoading(false);

        resetForm();

        await templateModalSuccess.fire({
          icon: "success",
          title: response.message || "Kelas berhasil ditambahkan.",
        });

        if (getKelasHistory) {
          await getKelasHistory();
        }
      }
    } catch (e) {
      console.error("Error save kelas:", e);
      console.log(e.response);

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
    value: data.id,
    label: `${data.nama_kelas} | ${data.jurusan}`,
  }));

  const guruOptions = guru.map((data) => ({
    value: data.nip,
    label: `${data.name} | ${data.nip}`,
  }));

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* =================================================
          BUTTON TAMBAH
      ================================================= */}

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
        <span>Tambah Kelas</span>
      </button>

      {/* =================================================
          MODAL
      ================================================= */}

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
            {/* ===========================================
                HEADER
            =========================================== */}

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
                    Tambah Ruang Kelas
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Lengkapi informasi kelas di bawah ini
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

            {/* ===========================================
                FORM
            =========================================== */}

            <form onSubmit={saveDataKelas} className="overflow-y-auto">
              <div className="space-y-5 p-5">
                {/* General Error */}
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
                      setError((prev) => ({
                        ...prev,
                        kelas_id: "",
                      }));
                    }
                  }}
                  placeholder="Pilih kelas"
                  options={kelasOptions}
                  error={error.kelas_id}
                  icon={<ClassroomIcon className="size-4" />}
                  disabled={loading}
                />

                {/* Wali Kelas */}
                <SelectField
                  id="wali_kelas"
                  label="Wali Kelas"
                  value={guruID}
                  onChange={(e) => {
                    setGuruID(e.target.value);

                    if (error.nip) {
                      setError((prev) => ({
                        ...prev,
                        wali_kelas: "",
                      }));
                    }
                  }}
                  placeholder="Pilih wali kelas"
                  options={guruOptions}
                  error={error.nip}
                  icon={<UserIcon className="size-4" />}
                  disabled={loading}
                />
              </div>

              {/* =========================================
                  FOOTER
              ========================================= */}

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
                      Simpan Kelas
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

export default AddDataKelas;
