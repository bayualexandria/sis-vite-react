import { useEffect, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import api from "../../utils/repositories";

const templateModalSuccess = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600",
    cancelButton:
      "rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600",
  },
  buttonsStyling: false,
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  zIndex: 10000,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Terjadi kesalahan. Silakan coba lagi."
  );
};
const LoadingSpinner = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className="h-5 w-5 animate-spin"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 1 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const getValidationErrors = (response) => {
  return (
    response?.errors ||
    response?.data?.errors ||
    response?.validation_errors ||
    {}
  );
};

function UpdateKelasById({ id }) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState({});
  const [generalError, setGeneralError] = useState("");

  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);

  const [kelasID, setKelasID] = useState("");
  const [waliKelas, setWaliKelas] = useState("");
  const [semesterID, setSemesterID] = useState("");

  /* =========================================================
     OPEN / CLOSE MODAL
  ========================================================= */

  const handleOpen = () => {
    setOpen(true);
    setError({});
    setGeneralError("");
  };

  const handleClose = () => {
    if (loading) return;

    setOpen(false);
    setError({});
    setGeneralError("");
  };

  /* =========================================================
     GET DATA KELAS
  ========================================================= */

  const getDataKelas = async () => {
    try {
      const response = await api.get("kelas/").then((res) => res.data);

      setKelas(response?.data || []);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);

      if (
        error?.message === "Failed to fetch" ||
        error?.code === "ERR_NETWORK"
      ) {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  /* =========================================================
     GET DATA GURU
  ========================================================= */

  const getDataGuru = async () => {
    try {
      const response = await api.get("guru/").then((res) => res.data);

      setGuru(response?.data || []);
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);

      if (
        error?.message === "Failed to fetch" ||
        error?.code === "ERR_NETWORK"
      ) {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  /* =========================================================
     GET DATA KELAS BERDASARKAN ID
  ========================================================= */

  const dataKelasHistory = async () => {
    try {
      setLoadingData(true);

      const response = await api.get(`kelas/${id}`).then((res) => res.data);

      if (response?.status === 404) {
        setGeneralError(response?.message || "Data kelas tidak ditemukan.");
        return;
      }

      if (response?.status === 200) {
        const data = response?.data;

        setKelasID(data?.kelas_id ? String(data.kelas_id) : "");

        setWaliKelas(
          data?.guru_wali_id
            ? String(data.guru_wali_id)
            : data?.wali_kelas
              ? String(data.wali_kelas)
              : "",
        );

        setSemesterID(data?.semester_id ? String(data.semester_id) : "");
      }
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);

      if (
        error?.message === "Failed to fetch" ||
        error?.code === "ERR_NETWORK"
      ) {
        setGeneralError(
          "Koneksi ke server terputus. Mohon hubungi administrator server.",
        );

        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      } else {
        setGeneralError(getErrorMessage(error));
      }
    } finally {
      setLoadingData(false);
    }
  };

  /* =========================================================
     DATA FORM
  ========================================================= */

  const dataKelas = {
    kelas_id: kelasID,
    wali_kelas: waliKelas,
    semester_id: semesterID,
  };

  /* =========================================================
     UPDATE DATA
  ========================================================= */

  const updateDataKelas = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError({});
    setGeneralError("");

    try {
      const response = await api
        .put(`kelas/${id}`, dataKelas)
        .then((res) => res.data);

      /* ============================================
         VALIDATION ERROR
      ============================================ */

      if (response?.status === 403) {
        const validationErrors = getValidationErrors(response);

        setError(validationErrors);

        setGeneralError(
          response?.message ||
            "Data yang dimasukkan belum sesuai. Silakan periksa kembali.",
        );

        setLoading(false);
        return;
      }

      /* ============================================
         SUCCESS
      ============================================ */

      if (response?.status === 200) {
        setLoading(false);
        setOpen(false);

        await templateModalSuccess.fire({
          icon: "success",
          title: response?.message || "Data kelas berhasil diperbarui.",
        });

        window.location.href = "/kelas";

        return;
      }

      /* ============================================
         OTHER RESPONSE
      ============================================ */

      setGeneralError(
        response?.message || "Data kelas gagal diperbarui. Silakan coba lagi.",
      );

      setLoading(false);
    } catch (error) {
      console.error("Gagal memperbarui data kelas:", error);

      setLoading(false);

      if (
        error?.message === "Failed to fetch" ||
        error?.code === "ERR_NETWORK"
      ) {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });

        return;
      }

      const responseData = error?.response?.data;

      const validationErrors =
        responseData?.errors || responseData?.data?.errors || {};

      setError(validationErrors);

      setGeneralError(
        responseData?.message ||
          "Terjadi kesalahan saat memperbarui data kelas.",
      );
    }
  };

  /* =========================================================
     INITIAL DATA
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([getDataKelas(), getDataGuru(), dataKelasHistory()]);
    };

    loadData();
  }, [id]);

  /* =========================================================
     ESCAPE KEY + BODY SCROLL
  ========================================================= */

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, loading]);

  /* =========================================================
     LOADING BUTTON
  ========================================================= */

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          BUTTON EDIT
      ===================================================== */}

      <button
        type="button"
        onClick={handleOpen}
        title="Ubah data kelas"
        aria-label="Ubah data kelas"
        className="
          group
          inline-flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-sky-200
          bg-sky-50
          text-sky-600
          shadow-sm
          transition-all
          duration-200
          hover:border-sky-300
          hover:bg-sky-100
          hover:text-sky-700
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-sky-500/30
          dark:border-sky-800
          dark:bg-sky-950/40
          dark:text-sky-400
          dark:hover:border-sky-700
          dark:hover:bg-sky-900/50
          dark:hover:text-sky-300
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
          />
        </svg>
      </button>

      {/* =====================================================
          TAILWIND MODAL
      ===================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="update-kelas-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !loading) {
              handleClose();
            }
          }}
        >
          <div
            className="
              relative
              flex
              max-h-[90vh]
              w-full
              max-w-xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              shadow-slate-950/20
              dark:border-slate-700
              dark:bg-slate-900
              dark:shadow-black/40
            "
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                bg-gradient-to-r
                from-sky-50
                to-white
                px-5
                py-4
                dark:border-slate-700
                dark:from-sky-950/40
                dark:to-slate-900
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-sky-100
                    text-sky-600
                    dark:bg-sky-900/50
                    dark:text-sky-400
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487 18.55 2.8a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487ZM19.5 7.125 16.875 4.5M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </div>

                <div>
                  <h2
                    id="update-kelas-title"
                    className="
                      text-base
                      font-bold
                      text-slate-800
                      dark:text-white
                    "
                  >
                    Ubah Data Kelas
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Perbarui informasi kelas dan wali kelas
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                aria-label="Tutup modal"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:hover:bg-slate-800
                  dark:hover:text-slate-200
                "
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

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="overflow-y-auto">
              {loadingData ? (
                <div className="flex min-h-[300px] items-center justify-center px-5 py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-sky-50
                        text-sky-600
                        dark:bg-sky-950/50
                        dark:text-sky-400
                      "
                    >
                      <LoadingSpinner />
                    </div>

                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Memuat data kelas...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={updateDataKelas} className="flex flex-col">
                  <div className="space-y-5 px-5 py-6">
                    {/* =========================================
                        GENERAL ERROR
                    ========================================= */}

                    {generalError && (
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
                          strokeWidth="1.8"
                          stroke="currentColor"
                          className="mt-0.5 h-5 w-5 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0 3.75h.007v.008H12v-.008ZM10.29 3.86l-7.02 12.16A1.875 1.875 0 0 0 4.894 18.8h14.212a1.875 1.875 0 0 0 1.624-2.78L13.71 3.86a1.875 1.875 0 0 0-3.42 0Z"
                          />
                        </svg>

                        <span>{generalError}</span>
                      </div>
                    )}

                    {/* =========================================
                        KELAS
                    ========================================= */}

                    <div className="space-y-2">
                      <label
                        htmlFor="kelas_id"
                        className="
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                          dark:text-slate-200
                        "
                      >
                        Kelas
                        <span className="ml-1 text-rose-500">*</span>
                      </label>

                      <div className="relative">
                        <select
                          name="kelas_id"
                          id="kelas_id"
                          value={kelasID}
                          onChange={(e) => {
                            setKelasID(e.target.value);
                            setError((prev) => ({
                              ...prev,
                              kelas_id: "",
                            }));
                          }}
                          disabled={loading}
                          className="
                            w-full
                            appearance-none
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-3
                            pr-10
                            text-sm
                            text-slate-700
                            shadow-sm
                            outline-none
                            transition
                            placeholder:text-slate-400
                            hover:border-slate-400
                            focus:border-sky-500
                            focus:ring-4
                            focus:ring-sky-500/10
                            disabled:cursor-not-allowed
                            disabled:bg-slate-100
                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-slate-200
                            dark:hover:border-slate-600
                            dark:focus:border-sky-500
                            dark:disabled:bg-slate-800/50
                          "
                        >
                          <option value="">-- Pilih Kelas --</option>

                          {kelas.map((data) => (
                            <option value={data.id} key={data.id}>
                              {data.nama_kelas}
                              {" | "}
                              {data.jurusan}
                            </option>
                          ))}
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="h-5 w-5 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </div>
                      </div>

                      {error?.kelas_id && (
                        <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m0 3.75h.007v.008H12v-.008Z"
                            />
                          </svg>

                          {error.kelas_id}
                        </p>
                      )}
                    </div>

                    {/* =========================================
                        WALI KELAS
                    ========================================= */}

                    <div className="space-y-2">
                      <label
                        htmlFor="wali_kelas"
                        className="
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                          dark:text-slate-200
                        "
                      >
                        Wali Kelas
                        <span className="ml-1 text-rose-500">*</span>
                      </label>

                      <div className="relative">
                        <select
                          name="wali_kelas"
                          id="wali_kelas"
                          value={waliKelas}
                          onChange={(e) => {
                            setWaliKelas(e.target.value);
                            setError((prev) => ({
                              ...prev,
                              wali_kelas_id: "",
                              wali_kelas: "",
                            }));
                          }}
                          disabled={loading}
                          className="
                            w-full
                            appearance-none
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-3
                            pr-10
                            text-sm
                            text-slate-700
                            shadow-sm
                            outline-none
                            transition
                            focus:border-sky-500
                            focus:ring-4
                            focus:ring-sky-500/10
                            disabled:cursor-not-allowed
                            disabled:bg-slate-100
                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-slate-200
                            dark:focus:border-sky-500
                            dark:disabled:bg-slate-800/50
                          "
                        >
                          <option value="">-- Pilih Wali Kelas --</option>

                          {guru.map((data) => (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          ))}
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="h-5 w-5 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </div>
                      </div>

                      {(error?.wali_kelas_id || error?.wali_kelas) && (
                        <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m0 3.75h.007v.008H12v-.008Z"
                            />
                          </svg>

                          {error.wali_kelas_id || error.wali_kelas}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =========================================
                      FOOTER BUTTON
                  ========================================= */}

                  <div
                    className="
                      flex
                      flex-col-reverse
                      gap-2
                      border-t
                      border-slate-200
                      bg-slate-50
                      px-5
                      py-4
                      sm:flex-row
                      sm:justify-end
                      dark:border-slate-700
                      dark:bg-slate-800/50
                    "
                  >
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        px-5
                        text-sm
                        font-semibold
                        text-slate-700
                        shadow-sm
                        transition
                        hover:bg-slate-100
                        focus:outline-none
                        focus:ring-4
                        focus:ring-slate-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:border-slate-600
                        dark:bg-slate-800
                        dark:text-slate-200
                        dark:hover:bg-slate-700
                      "
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={loading || loadingData}
                      className="
                        inline-flex
                        h-10
                        min-w-[130px]
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-sky-600
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        shadow-sky-600/20
                        transition
                        hover:bg-sky-700
                        focus:outline-none
                        focus:ring-4
                        focus:ring-sky-500/20
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
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
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12.75 9.75 17.5 19 7.75"
                            />
                          </svg>

                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateKelasById;
