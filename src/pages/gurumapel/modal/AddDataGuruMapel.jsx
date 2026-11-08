import { useState, useEffect } from "react";

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

function AddDataGuruMapel({ dataGuruMapel }) {
  const [mapel, setMapel] = useState([]);
  const [guru, setGuru] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [guruID, setGuruID] = useState("");
  const [mapelID, setMapelID] = useState("");

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
    setGuruID("");
    setMapelID("");

    setError({});
  };

  /* =====================================================
     GET DATA MAPEL
  ===================================================== */

  const getDataMapel = async () => {
    try {
      const response = await api.get("mapel/").then((res) => res.data);

      setMapel(response?.data || []);
    } catch (e) {
      console.error("Error get mapel:", e);

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
      console.log(response);

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

  const formData = new FormData();
  formData.append("guru_id", guruID);
  formData.append("mata_pelajaran_id", mapelID);

  const saveGuruMapel = async (e) => {
    console.log("formData", guruID, mapelID);
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError({});

    try {
      const response = await api.post("guru-mapel/", formData);

      setOpen(false);
      resetForm();

      await templateModalSuccess.fire({
        icon: "success",
        title: response?.data?.message || "Data guru berhasil ditambahkan",
      });

      if (dataGuruMapel) {
        await dataGuruMapel();
      }
    } catch (error) {
      console.error("error post guru", error?.response);

      const statusCode = error?.response?.status;
      const responseData = error?.response?.data;

      if (statusCode != 400) {
        setError(responseData?.message || {});
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

  /* =====================================================
     OPTIONS
  ===================================================== */

  const mapelOptions = mapel.map((data) => ({
    value: data.id,
    label: `${data.kode} | ${data.nama}`,
  }));

  const guruOptions = guru.map((data) => ({
    value: data.id,
    label: `${data.name} | ${data.nip}`,
  }));

  useEffect(() => {
    getDataMapel();
    getDataGuru();
  }, []);

  return (
    <>
      {/* =========================
          BUTTON TAMBAH
      ========================== */}
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

      {/* =========================
          MODAL
      ========================== */}
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
            {/* =========================
                HEADER
            ========================== */}
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

            {/* =========================
                BODY
            ========================== */}
            <div className="overflow-y-auto px-6 py-5">
              <form onSubmit={saveGuruMapel} className="flex flex-col gap-5">
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

                  {/* Mapel */}
                  <SelectField
                    id="mapel_id"
                    label="Mapel"
                    value={mapelID}
                    onChange={(e) => {
                      setMapelID(e.target.value);

                      if (error.mata_pelajaran_id) {
                        setError((prev) => ({
                          ...prev,
                          mata_pelajaran_id: "",
                        }));
                      }
                    }}
                    placeholder="Pilih mapel"
                    options={mapelOptions}
                    error={error.mata_pelajaran_id}
                    icon={<ClassroomIcon className="size-4" />}
                    disabled={loading}
                  />

                  {/* Wali Kelas */}
                  <SelectField
                    id="guru_id"
                    label="Guru Mapel"
                    value={guruID}
                    onChange={(e) => {
                      setGuruID(e.target.value);

                      if (error.guru_id) {
                        setError((prev) => ({
                          ...prev,
                          guru_id: "",
                        }));
                      }
                    }}
                    placeholder="Pilih guru mapel"
                    options={guruOptions}
                    error={error.guru_id}
                    icon={<UserIcon className="size-4" />}
                    disabled={loading}
                  />
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
                        Simpan Guru Mapel
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

export default AddDataGuruMapel;
