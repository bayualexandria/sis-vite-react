import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import api from "../../../utils/repositories";
import RestoreDataSiswaById from "./RestoreDataSiswaById";
import DeleteDataPemanentById from "./DeleteDataPemanentById";

// ======================================================
// SWEET ALERT
// ======================================================

const templateModal = withReactContent(Swal).mixin({
  customClass: {
    container: "swal-container",
    popup:
      "rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800",
    title: "text-lg font-bold text-slate-800 dark:text-white",
    htmlContainer: "text-sm text-slate-600 dark:text-slate-300",
    confirmButton:
      "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700",
    cancelButton:
      "ml-2 rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
  },

  buttonsStyling: false,

  didOpen: () => {
    const container = document.querySelector(".swal-container");

    if (container) {
      container.style.zIndex = "99999";
    }
  },
});

const templateModalSuccess = withReactContent(Swal).mixin({
  customClass: {
    container: "swal-container",
    popup:
      "rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800",
    title: "text-lg font-bold text-slate-800 dark:text-white",
    htmlContainer: "text-sm text-slate-600 dark:text-slate-300",
    confirmButton:
      "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700",
  },

  buttonsStyling: false,

  didOpen: () => {
    const container = document.querySelector(".swal-container");

    if (container) {
      container.style.zIndex = "99999";
    }
  },
});

// ======================================================
// COMPONENT
// ======================================================

function ShowDataTrashSiswa() {
  // ====================================================
  // STATE
  // ====================================================

  const [isOpen, setIsOpen] = useState(false);

  const [dataTrash, setDataTrash] = useState([]);

  const [pendingTrash, setPendingTrash] = useState(false);

  const [searchTrash, setSearchTrash] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [darkMode, setDarkMode] = useState(false);

  // ====================================================
  // DARK MODE
  // ====================================================

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark");

      setDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ====================================================
  // GET DATA TRASH SISWA
  // ====================================================

  const getDataTrashSiswa = async () => {
    try {
      setPendingTrash(true);

      const response = await api.get("trash/siswa", {
        withCredentials: true,
      });

      const data = response?.data?.data ?? [];

      setDataTrash(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data trash siswa:", error);

      setDataTrash([]);

      templateModal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message || "Data siswa terhapus gagal dimuat.",
      });
    } finally {
      setPendingTrash(false);
    }
  };

  // ====================================================
  // OPEN MODAL
  // ====================================================

  const handleOpenModal = () => {
    setSearchTrash("");
    setCurrentPage(1);
    setIsOpen(true);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const handleCloseModal = () => {
    if (pendingTrash) return;

    setIsOpen(false);
    setSearchTrash("");
    setCurrentPage(1);
  };

  // ====================================================
  // LOAD DATA WHEN MODAL OPEN
  // ====================================================

  useEffect(() => {
    if (isOpen) {
      getDataTrashSiswa();
    }
  }, [isOpen]);

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredTrash = useMemo(() => {
    const keyword = searchTrash.trim().toLowerCase();

    if (!keyword) {
      return dataTrash;
    }

    return dataTrash.filter((item) => {
      const name = String(item?.name ?? "").toLowerCase();
      const nis = String(item?.nis ?? "").toLowerCase();
      const jenisKelamin = String(item?.jenis_kelamin ?? "").toLowerCase();
      const noHp = String(item?.no_hp ?? "").toLowerCase();

      return (
        name.includes(keyword) ||
        nis.includes(keyword) ||
        jenisKelamin.includes(keyword) ||
        noHp.includes(keyword)
      );
    });
  }, [dataTrash, searchTrash]);

  // ====================================================
  // TOTAL PAGE
  // ====================================================

  const totalPages = Math.max(1, Math.ceil(filteredTrash.length / rowsPerPage));

  // ====================================================
  // PAGINATION DATA
  // ====================================================

  const paginatedTrash = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    const endIndex = startIndex + rowsPerPage;

    return filteredTrash.slice(startIndex, endIndex);
  }, [filteredTrash, currentPage, rowsPerPage]);

  // ====================================================
  // RESET PAGE WHEN SEARCH / ROWS CHANGE
  // ====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTrash, rowsPerPage]);

  // ====================================================
  // KEEP PAGE VALID
  // ====================================================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ====================================================
  // RESTORE ALL
  // ====================================================

  const handleRestoreAll = async () => {
    if (dataTrash.length === 0) {
      await templateModal.fire({
        icon: "info",
        title: "Tidak Ada Data",
        text: "Tidak ada data siswa yang dapat dipulihkan.",
      });

      return;
    }

    const result = await templateModal.fire({
      icon: "question",
      title: "Restore Semua Data Siswa?",
      html: `
        <p>
          Semua data siswa yang berada di tempat sampah
          akan dipulihkan kembali.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Restore Semua",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setPendingTrash(true);

      await api.get("trash/siswa/restore-all", {
        withCredentials: true,
      });

      setDataTrash([]);
      setCurrentPage(1);

      await templateModalSuccess.fire({
        icon: "success",
        title: "Berhasil",
        text: "Semua data siswa berhasil dipulihkan.",
      });

      await getDataTrashSiswa();
    } catch (error) {
      console.error("Gagal restore semua siswa:", error);

      templateModal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ||
          "Semua data siswa gagal dipulihkan.",
      });
    } finally {
      setPendingTrash(false);
    }
  };

  // ====================================================
  // DELETE ALL PERMANENT
  // ====================================================

  const handleDeleteAll = async () => {
    if (dataTrash.length === 0) {
      await templateModal.fire({
        icon: "info",
        title: "Tidak Ada Data",
        text: "Tidak ada data siswa yang dapat dihapus.",
      });

      return;
    }

    const result = await templateModal.fire({
      icon: "warning",
      title: "Hapus Semua Data Siswa?",
      html: `
        <p>
          Semua data siswa di tempat sampah akan
          <strong>dihapus secara permanen</strong>.
        </p>

        <p class="mt-2">
          Data yang sudah dihapus permanen
          tidak dapat dikembalikan.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Permanen",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setPendingTrash(true);

      await api.delete("siswa/delete-permanent", {
        withCredentials: true,
      });

      setDataTrash([]);
      setCurrentPage(1);

      await templateModalSuccess.fire({
        icon: "success",
        title: "Berhasil",
        text: "Semua data siswa berhasil dihapus permanen.",
      });
    } catch (error) {
      console.error("Gagal menghapus semua siswa:", error);

      templateModal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ||
          "Semua data siswa gagal dihapus permanen.",
      });
    } finally {
      setPendingTrash(false);
    }
  };

  // ====================================================
  // DATATABLE STYLE
  // ====================================================

  const customStyles = useMemo(() => {
    return {
      table: {
        style: {
          backgroundColor: darkMode ? "#1e293b" : "#ffffff",
        },
      },

      tableWrapper: {
        style: {
          backgroundColor: darkMode ? "#1e293b" : "#ffffff",
        },
      },

      headRow: {
        style: {
          minHeight: "48px",
          backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
          borderBottomWidth: "1px",
          borderBottomColor: darkMode ? "#334155" : "#e2e8f0",
        },
      },

      headCells: {
        style: {
          paddingLeft: "16px",
          paddingRight: "16px",
          fontSize: "12px",
          fontWeight: "700",
          color: darkMode ? "#cbd5e1" : "#475569",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
        },
      },

      rows: {
        style: {
          minHeight: "64px",
          backgroundColor: darkMode ? "#1e293b" : "#ffffff",
          color: darkMode ? "#e2e8f0" : "#334155",
          borderBottomWidth: "1px",
          borderBottomColor: darkMode ? "#334155" : "#f1f5f9",
          transition: "background-color 0.2s ease",
        },

        highlightOnHoverStyle: {
          backgroundColor: darkMode ? "#273449" : "#f8fafc",
          cursor: "default",
        },
      },

      cells: {
        style: {
          paddingLeft: "16px",
          paddingRight: "16px",
          fontSize: "13px",
        },
      },

      noData: {
        style: {
          minHeight: "180px",
          backgroundColor: darkMode ? "#1e293b" : "#ffffff",
          color: darkMode ? "#94a3b8" : "#64748b",
          fontSize: "14px",
        },
      },

      progress: {
        style: {
          backgroundColor: darkMode ? "#1e293b" : "#ffffff",
        },
      },
    };
  }, [darkMode]);

  // ====================================================
  // TABLE COLUMNS
  // ====================================================

  const columns = useMemo(
    () => [
      {
        name: "Nama Lengkap",
        selector: (row) => row?.name ?? "-",
        sortable: true,
        grow: 1.7,
        cell: (row) => {
          const name = row?.name?.trim() || "Tanpa Nama";

          const initial = name.charAt(0).toUpperCase();

          return (
            <div className="flex min-w-0 items-center gap-3 py-2">
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-indigo-100
                  text-sm font-bold
                  text-indigo-600
                  dark:bg-indigo-500/15
                  dark:text-indigo-400
                "
              >
                {initial}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                    dark:text-slate-100
                  "
                  title={name}
                >
                  {name}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        name: "NIS",
        selector: (row) => row?.nis ?? "-",
        sortable: true,
        width: "150px",
        cell: (row) => (
          <span
            className="
              font-medium
              text-slate-600
              dark:text-slate-300
            "
          >
            {row?.nis || "-"}
          </span>
        ),
      },

      {
        name: "Jenis Kelamin",
        selector: (row) => row?.jenis_kelamin ?? "-",
        sortable: true,
        width: "150px",
        cell: (row) => {
          const gender = row?.jenis_kelamin || "-";

          return (
            <span
              className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${
                  gender.toLowerCase().includes("laki")
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                    : gender.toLowerCase().includes("perempuan")
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }
              `}
            >
              {gender}
            </span>
          );
        },
      },

      {
        name: "No. Handphone",
        selector: (row) => row?.no_hp ?? "-",
        sortable: true,
        width: "170px",
        cell: (row) => (
          <span
            className="
              text-sm
              text-slate-600
              dark:text-slate-300
            "
          >
            {row?.no_hp || "-"}
          </span>
        ),
      },

      {
        name: "Action",
        width: "150px",
        right: true,
        cell: (row) => (
          <div className="flex items-center justify-end gap-2">
            <RestoreDataSiswaById nis={row?.nis} />

            <DeleteDataPemanentById nis={row?.nis} />
          </div>
        ),
      },
    ],
    [],
  );

  // ====================================================
  // PAGINATION
  // ====================================================

  const renderPagination = () => {
    if (filteredTrash.length === 0) {
      return null;
    }

    const pages = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);

      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let page = start; page <= end; page++) {
        pages.push(page);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    const startItem = (currentPage - 1) * rowsPerPage + 1;

    const endItem = Math.min(currentPage * rowsPerPage, filteredTrash.length);

    return (
      <div
        className="
          flex
          flex-col
          gap-4
          border-t
          border-slate-200
          px-4
          py-4
          dark:border-slate-700
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* INFO */}
        <div
          className="
            text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          Menampilkan{" "}
          <span
            className="
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            {startItem}
          </span>{" "}
          -{" "}
          <span
            className="
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            {endItem}
          </span>{" "}
          dari{" "}
          <span
            className="
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            {filteredTrash.length}
          </span>{" "}
          data
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ROWS PER PAGE */}
          <div className="flex items-center gap-2">
            <span
              className="
                hidden
                text-xs
                text-slate-500
                dark:text-slate-400
                sm:inline
              "
            >
              Baris:
            </span>

            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-2.5
                py-1.5
                text-xs
                font-medium
                text-slate-700
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20
                dark:border-slate-600
                dark:bg-slate-800
                dark:text-slate-200
              "
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* PREVIOUS */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="
              flex
              h-8
              min-w-8
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              px-2
              text-xs
              font-semibold
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-300
              dark:hover:bg-slate-700
            "
            aria-label="Halaman sebelumnya"
          >
            ←
          </button>

          {/* PAGE NUMBERS */}
          <div className="flex items-center gap-1">
            {pages.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      px-1
                      text-xs
                      text-slate-400
                    "
                  >
                    ...
                  </span>
                );
              }

              const active = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-lg
                    px-2
                    text-xs
                    font-semibold
                    transition
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* NEXT */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            className="
              flex
              h-8
              min-w-8
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              px-2
              text-xs
              font-semibold
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-300
              dark:hover:bg-slate-700
            "
            aria-label="Halaman berikutnya"
          >
            →
          </button>
        </div>
      </div>
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      {/* ==================================================
          BUTTON OPEN TRASH
      ================================================== */}

      <button
        type="button"
        onClick={handleOpenModal}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-2.5
          text-sm
          font-semibold
          text-slate-700
          shadow-sm
          transition
          hover:border-indigo-200
          hover:bg-indigo-50
          hover:text-indigo-600
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-slate-200
          dark:hover:border-indigo-500/40
          dark:hover:bg-indigo-500/10
          dark:hover:text-indigo-400
        "
      >
        <span className="text-base">🗑️</span>

        <span>Data Terhapus</span>
      </button>

      {/* ==================================================
          MODAL
      ================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-3
            backdrop-blur-sm
            sm:p-5
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="
              flex
              max-h-[90vh]
              w-full
              max-w-6xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-4
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-700
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-100
                    text-lg
                    dark:bg-indigo-500/15
                  "
                >
                  🗑️
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      truncate
                      text-base
                      font-bold
                      text-slate-800
                      dark:text-white
                      sm:text-lg
                    "
                  >
                    Data Siswa Terhapus
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Kelola data siswa yang berada di tempat sampah.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={pendingTrash}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-xl
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:hover:bg-slate-800
                  dark:hover:text-slate-200
                "
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            {/* ==================================================
                MODAL BODY
            ================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* ==================================================
                  TOOLBAR
              ================================================== */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-b
                  border-slate-200
                  bg-slate-50/70
                  p-4
                  dark:border-slate-700
                  dark:bg-slate-900
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                {/* SEARCH */}
                <div className="relative w-full sm:max-w-md">
                  <span
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-slate-400
                    "
                  >
                    🔎
                  </span>

                  <input
                    type="text"
                    value={searchTrash}
                    onChange={(event) => setSearchTrash(event.target.value)}
                    placeholder="Cari nama, NIS, jenis kelamin, no. HP..."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      py-2.5
                      pl-10
                      pr-10
                      text-sm
                      text-slate-700
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-500/20
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-slate-200
                      dark:placeholder:text-slate-500
                    "
                  />

                  {searchTrash && (
                    <button
                      type="button"
                      onClick={() => setSearchTrash("")}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition
                        hover:text-slate-700
                        dark:hover:text-slate-200
                      "
                      aria-label="Hapus pencarian"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* ACTION */}
                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={handleRestoreAll}
                    disabled={pendingTrash || dataTrash.length === 0}
                    className="
                      inline-flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-emerald-600
                      px-3.5
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-emerald-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:flex-none
                    "
                  >
                    <span>↩</span>
                    <span>Restore Semua</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    disabled={pendingTrash || dataTrash.length === 0}
                    className="
                      inline-flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-rose-600
                      px-3.5
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-rose-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:flex-none
                    "
                  >
                    <span>🗑</span>
                    <span>Hapus Semua</span>
                  </button>
                </div>
              </div>

              {/* ==================================================
                  SUMMARY
              ================================================== */}

              <div className="px-4 pt-4">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-amber-500
                      "
                    />

                    <span
                      className="
                        text-xs
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {dataTrash.length} data berada di tempat sampah
                    </span>
                  </div>

                  {searchTrash && (
                    <span
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Hasil pencarian:{" "}
                      <strong
                        className="
                          text-slate-700
                          dark:text-slate-200
                        "
                      >
                        {filteredTrash.length}
                      </strong>{" "}
                      data
                    </span>
                  )}
                </div>
              </div>

              {/* ==================================================
                  TABLE
              ================================================== */}

              <div className="p-4">
                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-slate-700
                  "
                >
                  <DataTable
                    columns={columns}
                    data={paginatedTrash}
                    customStyles={customStyles}
                    responsive
                    highlightOnHover
                    pointerOnHover={false}
                    persistTableHead
                    progressPending={pendingTrash}
                    progressComponent={
                      <div
                        className="
                          flex
                          min-h-[180px]
                          items-center
                          justify-center
                          gap-3
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        <span
                          className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-slate-300
                            border-t-indigo-600
                            dark:border-slate-600
                            dark:border-t-indigo-400
                          "
                        />
                        Memuat data...
                      </div>
                    }
                    noDataComponent={
                      <div
                        className="
                          flex
                          min-h-[180px]
                          flex-col
                          items-center
                          justify-center
                          px-5
                          text-center
                        "
                      >
                        <div
                          className="
                            mb-3
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            text-xl
                            dark:bg-slate-800
                          "
                        >
                          🗑️
                        </div>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-700
                            dark:text-slate-200
                          "
                        >
                          {searchTrash
                            ? "Data tidak ditemukan"
                            : "Tempat sampah kosong"}
                        </p>

                        <p
                          className="
                            mt-1
                            max-w-sm
                            text-xs
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          {searchTrash
                            ? "Coba gunakan kata kunci pencarian yang berbeda."
                            : "Belum ada data siswa yang terhapus."}
                        </p>
                      </div>
                    }
                  />
                </div>

                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {renderPagination()}
              </div>
            </div>

            {/* ==================================================
                MODAL FOOTER
            ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-3
                border-t
                border-slate-200
                bg-slate-50/70
                px-5
                py-3
                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <p
                className="
                  hidden
                  text-xs
                  text-slate-400
                  sm:block
                  dark:text-slate-500
                "
              >
                Data yang dihapus permanen tidak dapat dipulihkan.
              </p>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={pendingTrash}
                className="
                  ml-auto
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:hover:bg-slate-700
                "
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

export default ShowDataTrashSiswa;
