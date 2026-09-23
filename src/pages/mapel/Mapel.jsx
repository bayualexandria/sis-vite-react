import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import Main from "../../components/Main/Main";
import AddDataGuru from "../guru/modal/AddDataGuru";
import DeleteGuruById from "../guru/DeleteGuruById";
import StatusById from "../guru/modal/StatusById";
import StatusUserVerified from "../guru/modal/StatusUserVerified";
import ExcelExport from "../../components/laporan/excel/ExcelExport";
import ShowDataTrashGuru from "../guru/trash-data/ShowDataTrashGuru";
import api from "../../utils/repositories";

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

  ChevronLeft: ({ className = "h-4 w-4" }) => (
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
        d="m15.75 19.5-7.5-7.5 7.5-7.5"
      />
    </svg>
  ),

  ChevronRightSmall: ({ className = "h-4 w-4" }) => (
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
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z"
      />
    </svg>
  ),

  Search: ({ className = "h-5 w-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.6"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  ),

  Close: ({ className = "h-4 w-4" }) => (
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

  Edit: ({ className = "h-4 w-4" }) => (
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
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
      />
    </svg>
  ),

  Database: ({ className = "h-6 w-6" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 6.375c0 2.071-3.694 3.75-8.25 3.75s-8.25-1.679-8.25-3.75m16.5 0c0-2.071-3.694-3.75-8.25-3.75s-8.25 1.679-8.25 3.75m16.5 0v11.25c0 2.071-3.694 3.75-8.25 3.75s-8.25-1.679-8.25-3.75V6.375m16.5 0v3.75m-16.5-3.75v3.75"
      />
    </svg>
  ),
};

/* =========================================================
   DATATABLE STYLES
========================================================= */

const getDataTableStyles = (isDarkMode) => ({
  table: {
    style: {
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      color: isDarkMode ? "#cbd5e1" : "#475569",
    },
  },

  tableWrapper: {
    style: {
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
    },
  },

  header: {
    style: {
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      color: isDarkMode ? "#f8fafc" : "#1e293b",
      minHeight: "0",
      padding: "0",
    },
  },

  head: {
    style: {
      backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
    },
  },

  headRow: {
    style: {
      minHeight: "52px",
      backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
      borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
    },
  },

  headCells: {
    style: {
      backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
      color: isDarkMode ? "#cbd5e1" : "#475569",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
    },
  },

  cells: {
    style: {
      backgroundColor: "transparent",
      color: isDarkMode ? "#cbd5e1" : "#475569",
      fontSize: "13px",
      borderBottom: isDarkMode ? "1px solid #1e293b" : "1px solid #f1f5f9",
    },
  },

  rows: {
    style: {
      minHeight: "64px",
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      color: isDarkMode ? "#cbd5e1" : "#475569",
      transition: "background-color 0.2s ease",
    },

    stripedStyle: {
      backgroundColor: isDarkMode ? "#111c31" : "#fafafa",
    },

    highlightOnHoverStyle: {
      backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
      color: isDarkMode ? "#f8fafc" : "#334155",
      borderBottomColor: isDarkMode ? "#334155" : "#e2e8f0",
    },
  },

  progress: {
    style: {
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      color: isDarkMode ? "#cbd5e1" : "#475569",
    },
  },

  noData: {
    style: {
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      color: isDarkMode ? "#cbd5e1" : "#475569",
      minHeight: "250px",
    },
  },

  pagination: {
    style: {
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      color: isDarkMode ? "#cbd5e1" : "#475569",
      borderTop: isDarkMode ? "1px solid #1e293b" : "1px solid #e2e8f0",
    },
  },
});

/* =========================================================
   GURU
========================================================= */

function Mapel() {
  const [guru, setGuru] = useState([]);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /*
   * Jangan langsung membaca dark mode hanya sekali.
   * State akan mengikuti perubahan class "dark" pada html.
   */
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  /* =======================================================
     DARK MODE OBSERVER
  ======================================================= */

  useEffect(() => {
    const root = document.documentElement;

    const updateDarkMode = () => {
      setIsDarkMode(root.classList.contains("dark"));
    };

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* =======================================================
     DATATABLE STYLE
  ======================================================= */

  const dataTableStyles = useMemo(
    () => getDataTableStyles(isDarkMode),
    [isDarkMode],
  );

  /* =======================================================
     GET DATA GURU
  ======================================================= */

  const dataGuru = useCallback(async () => {
    try {
      setPending(true);

      const response = await api.get("guru/");

      const data = response?.data?.data ?? [];

      setGuru(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
      setGuru([]);
    } finally {
      setPending(false);
    }
  }, []);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    dataGuru();
  }, [dataGuru]);

  /* =======================================================
     FILTER DATA
  ======================================================= */

  const filteredGuru = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return guru;
    }

    return guru.filter((item) => {
      const name = String(item?.name ?? "").toLowerCase();
      const nip = String(item?.nip ?? "").toLowerCase();
      const jenisKelamin = String(item?.jenis_kelamin ?? "").toLowerCase();
      const noHp = String(item?.no_hp ?? "").toLowerCase();
      const alamat = String(item?.alamat ?? "").toLowerCase();

      return (
        name.includes(keyword) ||
        nip.includes(keyword) ||
        jenisKelamin.includes(keyword) ||
        noHp.includes(keyword) ||
        alamat.includes(keyword)
      );
    });
  }, [guru, search]);

  /* =======================================================
     RESET PAGINATION
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalRows = filteredGuru.length;

  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  const paginatedGuru = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return filteredGuru.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredGuru, currentPage, rowsPerPage]);

  /* =======================================================
     PAGE NUMBERS
  ======================================================= */

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [currentPage, totalPages]);

  /* =======================================================
     TABLE COLUMNS
  ======================================================= */

  const columns = useMemo(
    () => [
      {
        name: "Nama Lengkap",
        selector: (row) => row?.name ?? "-",
        sortable: true,
        width: "230px",

        cell: (row) => {
          const name = String(row?.name ?? "-");

          return (
            <div className="flex min-w-0 items-center gap-3 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                  {name}
                </p>

                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Guru
                </p>
              </div>
            </div>
          );
        },
      },

      {
        name: "NIP",
        selector: (row) => row?.nip ?? "-",
        sortable: true,
        width: "155px",

        cell: (row) => (
          <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
            {row?.nip ?? "-"}
          </span>
        ),
      },

      {
        name: "Jenis Kelamin",
        selector: (row) => row?.jenis_kelamin ?? "-",
        sortable: true,
        width: "150px",

        cell: (row) => (
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {row?.jenis_kelamin ?? "-"}
          </span>
        ),
      },

      {
        name: "No. Handphone",
        selector: (row) => row?.no_hp ?? "-",
        sortable: true,
        width: "155px",

        cell: (row) => (
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {row?.no_hp ?? "-"}
          </span>
        ),
      },

      {
        name: "Alamat",
        selector: (row) => row?.alamat ?? "-",
        sortable: true,
        minWidth: "180px",

        cell: (row) => (
          <span
            title={row?.alamat ?? "-"}
            className="block max-w-[280px] truncate text-sm text-slate-500 dark:text-slate-400"
          >
            {row?.alamat ?? "-"}
          </span>
        ),
      },

      {
        name: "Status",
        cell: (row) => <StatusById row={row} dataGuru={dataGuru} />,
        sortable: true,
        width: "150px",
      },

      {
        name: "User Status",
        cell: (row) => <StatusUserVerified row={row} dataGuru={dataGuru} />,
        sortable: true,
        width: "150px",
      },

      {
        name: "Aksi",

        cell: (row) => (
          <div className="flex items-center gap-2">
            {/* EDIT */}

            <Link
              to={`/guru/${row?.nip}`}
              title="Edit data guru"
              className="
                group flex h-8 w-8 items-center justify-center
                rounded-lg border border-slate-200 bg-white
                text-slate-500 shadow-sm
                transition-all duration-200
                hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600
                dark:border-slate-700 dark:bg-slate-800
                dark:text-slate-400
                dark:hover:border-sky-800 dark:hover:bg-sky-950/50
                dark:hover:text-sky-400
              "
            >
              <Icons.Edit className="h-4 w-4 transition-transform group-hover:scale-110" />
            </Link>

            {/* DELETE */}

            <div
              title="Hapus data guru"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg border border-slate-200 bg-white
                shadow-sm transition-all duration-200
                hover:border-red-200 hover:bg-red-50
                dark:border-slate-700 dark:bg-slate-800
                dark:hover:border-red-900 dark:hover:bg-red-950/40
              "
            >
              <DeleteGuruById username={row?.nip} />
            </div>
          </div>
        ),

        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: "100px",
      },
    ],
    [dataGuru],
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Main>
      <div className="min-h-screen bg-slate-100 pt-[76px] dark:bg-slate-950 lg:ml-64">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {/* Breadcrumb */}

                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                  <Link to="/" className="transition hover:text-sky-500">
                    Dashboard
                  </Link>

                  <Icons.ChevronRight className="h-3.5 w-3.5" />

                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    Mapel
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                  Data Mapel
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Kelola informasi dan data mapel sekolah.
                </p>
              </div>

              {/* TOTAL GURU */}

              <div
                className="
                  flex items-center gap-3 rounded-xl
                  border border-slate-200 bg-white px-4 py-3
                  shadow-sm
                  dark:border-slate-800 dark:bg-slate-900
                "
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                  <Icons.Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Total Guru
                  </p>

                  <p className="text-lg font-bold text-slate-700 dark:text-white">
                    {guru.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <div
            className="
              overflow-hidden rounded-2xl border
              border-slate-200 bg-white shadow-sm
              dark:border-slate-800 dark:bg-slate-900
            "
          >
            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 lg:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* SEARCH */}

                <div className="relative w-full lg:max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Icons.Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, NIP, no. HP..."
                    className="
                      h-10 w-full rounded-lg
                      border border-slate-200
                      bg-slate-50 pl-10 pr-10
                      text-sm text-slate-700
                      outline-none transition-all
                      placeholder:text-slate-400
                      focus:border-sky-400
                      focus:bg-white
                      focus:ring-4 focus:ring-sky-50
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-slate-200
                      dark:placeholder:text-slate-500
                      dark:focus:border-sky-600
                      dark:focus:bg-slate-800
                      dark:focus:ring-sky-950/50
                    "
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="
                        absolute right-3 top-1/2
                        -translate-y-1/2 rounded-md p-1
                        text-slate-400 transition
                        hover:bg-slate-200 hover:text-slate-600
                        dark:hover:bg-slate-700 dark:hover:text-slate-200
                      "
                    >
                      <Icons.Close className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap items-center gap-2">
                  <AddDataGuru dataGuru={dataGuru} />

                  <ExcelExport data={guru} fileName="Data Guru" />

                  <ShowDataTrashGuru />
                </div>
              </div>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="w-full overflow-hidden">
              <DataTable
                columns={columns}
                data={paginatedGuru}
                progressPending={pending}
                highlightOnHover
                responsive
                customStyles={dataTableStyles}
                persistTableHead
                noDataComponent={
                  <div className="flex min-h-[250px] w-full flex-col items-center justify-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <Icons.Database className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                    </div>

                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {search
                        ? "Data guru tidak ditemukan"
                        : "Belum ada data guru"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {search
                        ? "Coba gunakan kata kunci pencarian lain."
                        : "Data guru akan muncul di sini."}
                    </p>
                  </div>
                }
              />
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {!pending && totalRows > 0 && (
              <div
                className="
                  border-t border-slate-200
                  bg-white px-5 py-4
                  dark:border-slate-800 dark:bg-slate-900
                  lg:px-6
                "
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* INFO */}

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Menampilkan{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {(currentPage - 1) * rowsPerPage + 1}
                    </span>
                    {" – "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {Math.min(currentPage * rowsPerPage, totalRows)}
                    </span>
                    {" dari "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {totalRows}
                    </span>
                    {" data"}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* ROWS PER PAGE */}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Baris per halaman
                      </span>

                      <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        className="
                          h-8 rounded-lg
                          border border-slate-200
                          bg-white px-2.5
                          text-sm font-medium text-slate-600
                          outline-none transition
                          focus:border-sky-400
                          focus:ring-2 focus:ring-sky-50
                          dark:border-slate-700
                          dark:bg-slate-800
                          dark:text-slate-300
                          dark:focus:border-sky-600
                          dark:focus:ring-sky-950/50
                        "
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                    {/* PAGINATION */}

                    <div className="flex items-center gap-1">
                      {/* PREVIOUS */}

                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="
                          flex h-8 w-8 items-center
                          justify-center rounded-lg
                          border border-slate-200
                          bg-white text-slate-500
                          transition
                          hover:border-sky-200
                          hover:bg-sky-50
                          hover:text-sky-600
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          dark:border-slate-700
                          dark:bg-slate-800
                          dark:text-slate-400
                          dark:hover:border-sky-800
                          dark:hover:bg-sky-950/50
                          dark:hover:text-sky-400
                        "
                      >
                        <Icons.ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* NUMBERS */}

                      {pageNumbers.map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`dots-${index}`}
                            className="
                              flex h-8 w-7
                              items-center justify-center
                              text-sm text-slate-400
                              dark:text-slate-500
                            "
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`
                              flex h-8 min-w-8
                              items-center justify-center
                              rounded-lg px-2
                              text-sm font-medium transition

                              ${
                                currentPage === page
                                  ? "bg-sky-500 text-white shadow-sm shadow-sky-200 dark:bg-sky-600 dark:shadow-sky-950"
                                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-800 dark:hover:bg-sky-950/50 dark:hover:text-sky-400"
                              }
                            `}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      {/* NEXT */}

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        className="
                          flex h-8 w-8 items-center
                          justify-center rounded-lg
                          border border-slate-200
                          bg-white text-slate-500
                          transition
                          hover:border-sky-200
                          hover:bg-sky-50
                          hover:text-sky-600
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          dark:border-slate-700
                          dark:bg-slate-800
                          dark:text-slate-400
                          dark:hover:border-sky-800
                          dark:hover:bg-sky-950/50
                          dark:hover:text-sky-400
                        "
                      >
                        <Icons.ChevronRightSmall className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Mapel;
