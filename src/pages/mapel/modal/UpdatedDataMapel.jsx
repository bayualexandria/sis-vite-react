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

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="mt-1 text-xs font-medium text-rose-500 dark:text-rose-400">
      {message}
    </p>
  );
};

function UpdatedDataMapel({ dataMapel, data }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  // Inisialisasi state lokal ketika modal dibuka atau data berubah
  useEffect(() => {
    if (open && data) {
      setNama(data.nama || "");
      setKode(data.kode || "");
      setDeskripsi(data.deskripsi || "");
    }
  }, [open, data]);

  const handleOpenUpdatedData = () => {
    setError({});
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const resetForm = () => {
    setNama("");
    setKode("");
    setDeskripsi("");
    setError({});
  };

  const updatedMapel = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError({});

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("kode", kode);
    formData.append("deskripsi", deskripsi);

    try {
      const response = await api.patch(`mapel/${data?.id}`, formData);

      setOpen(false);
      resetForm();

      await templateModalSuccess.fire({
        icon: "success",
        title:
          response?.data?.message || "Data mata pelajaran berhasil diperbarui",
      });

      if (dataMapel) {
        await dataMapel();
      }
    } catch (error) {
      console.error("error put mapel", error?.response);

      const statusCode = error?.response?.status;
      const responseData = error?.response?.data;

      if (statusCode === 400) {
        setError(responseData?.data || {});
      } else {
        await templateModalSuccess.fire({
          icon: "error",
          title:
            responseData?.message ||
            "Terjadi kesalahan saat menyimpan data mata pelajaran",
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
        onClick={handleOpenUpdatedData}
        type="button"
        className="group flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-sky-800 dark:hover:bg-sky-950/50 dark:hover:text-sky-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.7"
          stroke="currentColor"
          className="h-4 w-4 transition-transform group-hover:scale-110"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          />
        </svg>
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
                  Edit Data Mata Pelajaran
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Perbarui informasi mata pelajaran di bawah ini.
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
              <form onSubmit={updatedMapel} className="flex flex-col gap-5">
                {/* NAMA & KODE */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nama" className={labelClass}>
                      Nama Mapel
                    </label>

                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama mapel"
                      className={inputClass}
                    />

                    <ErrorMessage message={error.nama} />
                  </div>

                  <div>
                    <label htmlFor="kode" className={labelClass}>
                      Kode Mapel
                    </label>

                    <input
                      id="kode"
                      name="kode"
                      type="text"
                      value={kode}
                      onChange={(e) => setKode(e.target.value)}
                      placeholder="Masukkan kode mapel"
                      className={inputClass}
                    />

                    <ErrorMessage message={error.kode} />
                  </div>
                </div>

                {/* DESKRIPSI */}
                <div>
                  <label htmlFor="deskripsi" className={labelClass}>
                    Deskripsi
                  </label>

                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Masukkan deskripsi mapel"
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />

                  <ErrorMessage message={error.deskripsi} />
                </div>

                {/* FOOTER */}
                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Batal
                  </button>

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
                        Update Data
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

export default UpdatedDataMapel;
