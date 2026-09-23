import { useEffect, useMemo, useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DataTable from "react-data-table-component";

import api from "../../../utils/repositories";

import RestoreDataGuruById from "./RestoreDataGuruById";
import DeleteDataPemanentGuruById from "./DeleteDataPemanentGuruById";

const templateModal = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-3 py-1.5 cursor-pointer",
    cancelButton:
      "bg-rose-500 font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-3 py-1.5 cursor-pointer",
  },
  buttonsStyling: false,
});

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

function ShowDataTrashGuru() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataTrash, setDataTrash] = useState([]);
  const [pendingTrash, setPendingTrash] = useState(false);
  const [searchTrash, setSearchTrash] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /*
   * ============================================================
   * DARK MODE DETECTION
   * ============================================================
   */
  const getDarkMode = () => {
    return (
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark")
    );
  };

  const [isDarkMode, setIsDarkMode] = useState(getDarkMode);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const updateTheme = () => {
      setIsDarkMode(
        html.classList.contains("dark") || body.classList.contains("dark"),
      );
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * ============================================================
   * DATA TRASH
   * ============================================================
   */
  const getDataTrashGuru = async () => {
    try {
      setPendingTrash(true);

      const response = await api.get("trash/guru");

      setDataTrash(response?.data?.data || []);
    } catch (error) {
      console.error("Gagal mengambil data trash guru:", error);

      setDataTrash([]);

      await templateModalSuccess.fire({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Gagal mengambil data guru yang dihapus",
      });
    } finally {
      setPendingTrash(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getDataTrashGuru();
    }
  }, [isOpen]);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */
  const filteredTrash = useMemo(() => {
    const keyword = searchTrash.trim().toLowerCase();

    if (!keyword) {
      return dataTrash;
    }

    return dataTrash.filter((item) => {
      return [
        item?.name,
        item?.nip,
        item?.jenis_kelamin,
        item?.no_hp,
        item?.alamat,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [dataTrash, searchTrash]);

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */
  const totalPages = Math.max(1, Math.ceil(filteredTrash.length / rowsPerPage));

  const paginatedTrash = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return filteredTrash.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTrash, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTrash, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /*
   * ============================================================
   * MODAL
   * ============================================================
   */
  const openModal = () => {
    setSearchTrash("");
    setCurrentPage(1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  /*
   * ============================================================
   * RESTORE SEMUA DATA
   * ============================================================
   */
  const restoreDataAll = async () => {
    const result = await templateModal.fire({
      title: "Restore Semua Data Guru?",
      text: "Semua data guru yang berada di tempat sampah akan dikembalikan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Restore Semua",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await api.get("trash/guru/restore-all");

      await templateModalSuccess.fire({
        icon: "success",
        title: "Semua data guru berhasil di-restore",
      });

      await getDataTrashGuru();
    } catch (error) {
      console.error("Gagal restore semua data guru:", error);

      await templateModalSuccess.fire({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Gagal melakukan restore semua data guru",
      });
    }
  };

  /*
   * ============================================================
   * HAPUS PERMANEN SEMUA
   * ============================================================
   */
  const deletePermanen = async () => {
    const result = await templateModal.fire({
      title: "Hapus Semua Data Secara Permanen?",
      text: "Data guru yang dihapus secara permanen tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Permanen",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await api.delete("guru/delete-permanent");

      await templateModalSuccess.fire({
        icon: "success",
        title: "Semua data guru berhasil dihapus permanen",
      });

      setDataTrash([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Gagal menghapus permanen:", error);

      await templateModalSuccess.fire({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Gagal menghapus data guru secara permanen",
      });
    }
  };

  /*
   * ============================================================
   * DATATABLE STYLE
   * ============================================================
   */
  const dataTableStyles = useMemo(() => {
    if (isDarkMode) {
      return {
        table: {
          style: {
            backgroundColor: "#0f172a",
            color: "#e2e8f0",
          },
        },

        tableWrapper: {
          style: {
            backgroundColor: "#0f172a",
          },
        },

        header: {
          style: {
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            fontSize: "14px",
            fontWeight: "700",
            minHeight: "56px",
          },
        },

        headRow: {
          style: {
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            borderBottom: "1px solid #334155",
            minHeight: "52px",
          },
        },

        headCells: {
          style: {
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            fontSize: "13px",
            fontWeight: "700",
            paddingLeft: "16px",
            paddingRight: "16px",
          },
        },

        rows: {
          style: {
            backgroundColor: "#0f172a",
            color: "#cbd5e1",
            borderBottom: "1px solid #1e293b",
            minHeight: "58px",
          },

          highlightOnHoverStyle: {
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            borderBottomColor: "#334155",
            cursor: "pointer",
          },
        },

        cells: {
          style: {
            color: "#cbd5e1",
            fontSize: "14px",
            paddingLeft: "16px",
            paddingRight: "16px",
          },
        },

        pagination: {
          style: {
            backgroundColor: "#0f172a",
            color: "#cbd5e1",
            borderTop: "1px solid #334155",
          },

          pageButtonsStyle: {
            backgroundColor: "#1e293b",
            color: "#cbd5e1",
            fill: "#cbd5e1",
          },
        },

        progress: {
          style: {
            backgroundColor: "#0f172a",
            color: "#38bdf8",
          },
        },

        noData: {
          style: {
            backgroundColor: "#0f172a",
            color: "#cbd5e1",
          },
        },
      };
    }

    return {
      table: {
        style: {
          backgroundColor: "#ffffff",
          color: "#334155",
        },
      },

      tableWrapper: {
        style: {
          backgroundColor: "#ffffff",
        },
      },

      headRow: {
        style: {
          backgroundColor: "#f8fafc",
          color: "#334155",
          borderBottom: "1px solid #e2e8f0",
          minHeight: "52px",
        },
      },

      headCells: {
        style: {
          backgroundColor: "#f8fafc",
          color: "#334155",
          fontSize: "13px",
          fontWeight: "700",
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },

      rows: {
        style: {
          backgroundColor: "#ffffff",
          color: "#475569",
          borderBottom: "1px solid #e2e8f0",
          minHeight: "58px",
        },

        highlightOnHoverStyle: {
          backgroundColor: "#f8fafc",
          color: "#334155",
          cursor: "pointer",
        },
      },

      cells: {
        style: {
          color: "#475569",
          fontSize: "14px",
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },

      pagination: {
        style: {
          backgroundColor: "#ffffff",
          color: "#475569",
          borderTop: "1px solid #e2e8f0",
        },

        pageButtonsStyle: {
          backgroundColor: "#ffffff",
          color: "#475569",
          fill: "#475569",
        },
      },

      progress: {
        style: {
          backgroundColor: "#ffffff",
          color: "#0ea5e9",
        },
      },

      noData: {
        style: {
          backgroundColor: "#ffffff",
          color: "#64748b",
        },
      },
    };
  }, [isDarkMode]);

  /*
   * ============================================================
   * COLUMNS
   * ============================================================
   */
  const columns = useMemo(
    () => [
      {
        name: "Nama Lengkap",
        selector: (row) => row?.name || "-",
        sortable: true,
        grow: 1.5,

        cell: (row) => (
          <div className="flex items-center gap-3 py-2">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                isDarkMode
                  ? "bg-rose-500/15 text-rose-400"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {String(row?.name || "?")
                .charAt(0)
                .toUpperCase()}
            </div>

            <span
              className={`font-semibold ${
                isDarkMode ? "text-slate-100" : "text-slate-700"
              }`}
            >
              {row?.name || "-"}
            </span>
          </div>
        ),
      },

      {
        name: "NIP",
        selector: (row) => row?.nip || "-",
        sortable: true,
        width: "160px",

        cell: (row) => (
          <span
            className={`font-mono text-sm ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {row?.nip || "-"}
          </span>
        ),
      },

      {
        name: "Jenis Kelamin",
        selector: (row) => row?.jenis_kelamin || "-",
        sortable: true,
        width: "150px",

        cell: (row) => (
          <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
            {row?.jenis_kelamin || "-"}
          </span>
        ),
      },

      {
        name: "No. Handphone",
        selector: (row) => row?.no_hp || "-",
        sortable: true,
        width: "160px",

        cell: (row) => (
          <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
            {row?.no_hp || "-"}
          </span>
        ),
      },

      {
        name: "Aksi",
        width: "130px",

        cell: (row) => (
          <div className="flex items-center gap-2">
            <RestoreDataGuruById nis={row?.nis} />

            <DeleteDataPemanentGuruById nis={row?.nis} />
          </div>
        ),
      },
    ],
    [isDarkMode],
  );

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */
  const renderPagination = () => {
    if (filteredTrash.length === 0) {
      return null;
    }

    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return (
      <div
        className={`flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
          isDarkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`text-sm ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Menampilkan{" "}
          <span
            className={`font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-700"
            }`}
          >
            {filteredTrash.length === 0
              ? 0
              : (currentPage - 1) * rowsPerPage + 1}
          </span>{" "}
          sampai{" "}
          <span
            className={`font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-700"
            }`}
          >
            {Math.min(currentPage * rowsPerPage, filteredTrash.length)}
          </span>{" "}
          dari{" "}
          <span
            className={`font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-700"
            }`}
          >
            {filteredTrash.length}
          </span>{" "}
          data
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${
              isDarkMode
                ? "border-slate-700 bg-slate-800 text-slate-200"
                : "border-slate-300 bg-white text-slate-600"
            }`}
          >
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={15}>15 / halaman</option>
            <option value={20}>20 / halaman</option>
          </select>

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isDarkMode
                ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
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
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {pages.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className={
                  isDarkMode ? "px-1 text-slate-500" : "px-1 text-slate-400"
                }
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600"
                    : isDarkMode
                      ? "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isDarkMode
                ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
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
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <>
      {/* Tombol Data Trash */}
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-lg border border-rose-500 bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-rose-600 hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-500/20"
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>

        <span>Data Trash</span>

        {dataTrash.length > 0 && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {dataTrash.length}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className={`flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl shadow-2xl ${
              isDarkMode ? "border border-slate-700 bg-slate-900" : "bg-white"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between border-b px-5 py-4 sm:px-6 ${
                isDarkMode
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <h2
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  Data Guru Terhapus
                </h2>

                <p
                  className={`mt-0.5 text-xs ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Data yang telah dihapus dan masih dapat dipulihkan.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  isDarkMode
                    ? "border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200"
                    : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                }`}
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

            {/* Toolbar */}
            <div
              className={`flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800/70"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {/* Search */}
              <div className="relative w-full sm:max-w-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>

                <input
                  type="text"
                  value={searchTrash}
                  onChange={(e) => setSearchTrash(e.target.value)}
                  placeholder="Cari nama, NIP, no. HP..."
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900 text-slate-100"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                />

                {searchTrash && (
                  <button
                    type="button"
                    onClick={() => setSearchTrash("")}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${
                      isDarkMode
                        ? "text-slate-500 hover:text-slate-300"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
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
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Actions */}
              {dataTrash.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={restoreDataAll}
                    className="inline-flex items-center gap-2 rounded-lg border border-sky-500 bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
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
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                    Restore Semua
                  </button>

                  <button
                    type="button"
                    onClick={deletePermanen}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-500 bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79"
                      />
                    </svg>
                    Hapus Semua
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div
              className={`min-h-0 flex-1 overflow-auto ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              <DataTable
                columns={columns}
                data={paginatedTrash}
                progressPending={pendingTrash}
                highlightOnHover
                selectableRowsHighlight
                responsive
                customStyles={dataTableStyles}
                noDataComponent={
                  <div className="flex w-full flex-col items-center justify-center py-14">
                    <div
                      className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                        isDarkMode ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={`h-8 w-8 ${
                          isDarkMode ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 7.5l-.625 10.5a2.25 2.25 0 0 1-2.244 2.116H6.619a2.25 2.25 0 0 1-2.244-2.116L3.75 7.5m6 4.125 2.25 2.25 2.25-2.25M3.75 7.5h16.5m-10.5-3h4.5a1.5 1.5 0 0 1 1.5 1.5v1.5h-7.5V6a1.5 1.5 0 0 1 1.5-1.5Z"
                        />
                      </svg>
                    </div>

                    <p
                      className={`font-semibold ${
                        isDarkMode ? "text-slate-100" : "text-slate-700"
                      }`}
                    >
                      {searchTrash
                        ? "Data tidak ditemukan"
                        : "Data trash masih kosong"}
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {searchTrash
                        ? "Coba gunakan kata pencarian lain."
                        : "Belum ada data guru yang dihapus."}
                    </p>
                  </div>
                }
              />
            </div>

            {/* Pagination */}
            {renderPagination()}
          </div>
        </div>
      )}
    </>
  );
}

export default ShowDataTrashGuru;
