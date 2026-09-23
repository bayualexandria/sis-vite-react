import { useCallback, useEffect, useMemo, useState } from "react";
import Main from "../../components/Main/Main";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import DeleteSiswaById from "./DeleteSiswaById";
import ShowDataTrashSiswa from "./trash-data/ShowDataTrashSiswa";
import ExcelExport from "../../components/laporan/excel/ExcelExport";
import AddDataSiswa from "./modal/AddDataSiswa";
import api from "../../utils/repositories";
import KartuTandaSiswa from "./KartuTandaSiswa";

function Siswa() {
  const [user, setUser] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");

  // ============================================================
  // DARK MODE
  // ============================================================
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setIsDarkMode(root.classList.contains("dark"));
    };

    // Cek theme saat pertama kali component dirender
    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // ============================================================
  // DATATABLE CUSTOM STYLES
  // Tidak menggunakan TableCustomStyle agar tidak tertimpa style
  // dari file lain.
  // ============================================================
  const dataTableStyles = useMemo(() => {
    const dark = isDarkMode;

    return {
      table: {
        style: {
          width: "100%",
          backgroundColor: dark ? "#0f172a" : "#ffffff",
          color: dark ? "#cbd5e1" : "#475569",
        },
      },

      tableWrapper: {
        style: {
          display: "block",
          width: "100%",
          backgroundColor: dark ? "#0f172a" : "#ffffff",
        },
      },

      head: {
        style: {
          backgroundColor: dark ? "#1e293b" : "#f8fafc",
        },
      },

      headRow: {
        style: {
          minHeight: "52px",
          backgroundColor: dark ? "#1e293b" : "#f8fafc",
          borderBottom: dark ? "1px solid #334155" : "1px solid #e2e8f0",
        },
      },

      headCells: {
        style: {
          backgroundColor: dark ? "#1e293b" : "#f8fafc",
          color: dark ? "#cbd5e1" : "#475569",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          paddingLeft: "16px",
          paddingRight: "16px",
          borderBottom: dark ? "1px solid #334155" : "1px solid #e2e8f0",
        },
      },

      cells: {
        style: {
          backgroundColor: "transparent",
          color: dark ? "#cbd5e1" : "#475569",
          fontSize: "13px",
          paddingLeft: "16px",
          paddingRight: "16px",
          borderBottom: dark ? "1px solid #1e293b" : "1px solid #f1f5f9",
        },
      },

      rows: {
        style: {
          minHeight: "64px",
          backgroundColor: dark ? "#0f172a" : "#ffffff",
          color: dark ? "#cbd5e1" : "#475569",
          transition: "background-color 0.2s ease",
        },

        highlightOnHoverStyle: {
          backgroundColor: dark ? "#1e293b" : "#f8fafc",
          color: dark ? "#f1f5f9" : "#334155",
          borderBottomColor: dark ? "#334155" : "#e2e8f0",
          cursor: "pointer",
        },
      },

      progress: {
        style: {
          backgroundColor: dark ? "#0f172a" : "#ffffff",
          color: dark ? "#cbd5e1" : "#475569",
        },
      },

      noData: {
        style: {
          minHeight: "250px",
          backgroundColor: dark ? "#0f172a" : "#ffffff",
          color: dark ? "#cbd5e1" : "#475569",
        },
      },

      pagination: {
        style: {
          backgroundColor: dark ? "#0f172a" : "#ffffff",
          color: dark ? "#cbd5e1" : "#475569",
          borderTop: dark ? "1px solid #1e293b" : "1px solid #e2e8f0",
        },
      },

      subHeader: {
        style: {
          backgroundColor: dark ? "#0f172a" : "#ffffff",
          color: dark ? "#cbd5e1" : "#475569",
        },
      },
    };
  }, [isDarkMode]);

  // ============================================================
  // PAGINATION
  // ============================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ============================================================
  // GET DATA SISWA
  // ============================================================
  const dataUser = useCallback(async () => {
    try {
      setPending(true);

      const response = await api.get("siswa/", {
        withCredentials: true,
      });

      const data = response?.data?.data ?? [];

      setUser(data);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
      setUser([]);
    } finally {
      setPending(false);
    }
  }, []);

  // ============================================================
  // LOAD DATA
  // ============================================================
  useEffect(() => {
    dataUser();
  }, [dataUser]);

  // ============================================================
  // FILTER DATA
  // ============================================================
  const filteredSiswa = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return user;
    }

    return user.filter((item) => {
      const name = String(item?.name ?? "").toLowerCase();
      const nis = String(item?.nis ?? "").toLowerCase();
      const jenisKelamin = String(item?.jenis_kelamin ?? "").toLowerCase();
      const noHp = String(item?.no_hp ?? "").toLowerCase();
      const alamat = String(item?.alamat ?? "").toLowerCase();

      return (
        name.includes(keyword) ||
        nis.includes(keyword) ||
        jenisKelamin.includes(keyword) ||
        noHp.includes(keyword) ||
        alamat.includes(keyword)
      );
    });
  }, [user, search]);

  // ============================================================
  // RESET PAGE
  // ============================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  // ============================================================
  // PAGINATION DATA
  // ============================================================
  const totalRows = filteredSiswa.length;

  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  const paginatedSiswa = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return filteredSiswa.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSiswa, currentPage, rowsPerPage]);

  // ============================================================
  // PAGE NUMBERS
  // ============================================================
  const getPageNumbers = () => {
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
  };

  // ============================================================
  // COLUMNS
  // ============================================================
  const columns = useMemo(
    () => [
      {
        name: "Nama Lengkap",
        selector: (row) => row?.name ?? "-",
        sortable: true,
        width: "230px",

        cell: (row) => (
          <div className="flex items-center gap-3 py-2">
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
              {String(row?.name ?? "-")
                .charAt(0)
                .toUpperCase()}
            </div>

            {/* Name */}
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-700 dark:text-slate-100">
                {row?.name ?? "-"}
              </p>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                Siswa
              </p>
            </div>
          </div>
        ),
      },

      {
        name: "NIS",
        selector: (row) => row?.nis ?? "-",
        sortable: true,
        width: "150px",

        cell: (row) => (
          <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
            {row?.nis ?? "-"}
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
        width: "160px",

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
        name: "Aksi",

        cell: (row) => (
          <div className="flex items-center gap-2">
            {/* Kartu Siswa */}
            <div
              title="Kartu tanda siswa"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/10"
            >
              <KartuTandaSiswa siswa={row} />
            </div>

            {/* Edit */}
            <Link
              to={`/siswa/${row?.nis}`}
              title="Edit data siswa"
              className="group flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
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
            </Link>

            {/* Delete */}
            <div
              title="Hapus data siswa"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500/50 dark:hover:bg-red-500/10"
            >
              <DeleteSiswaById username={row?.nis} />
            </div>
          </div>
        ),

        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [],
  );

  // ============================================================
  // RETURN
  // ============================================================
  return (
    <Main>
      <div className="min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-slate-950">
        <div className="grid grid-cols-6">
          <div className="col-span-5 col-start-2 overflow-y-auto p-5 lg:p-7">
            {/* =====================================================
                HEADER
            ====================================================== */}
            <div className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                {/* Title */}
                <div>
                  {/* Breadcrumb */}
                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                    <span>Dashboard</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>

                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Siswa
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                    Data Siswa
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Kelola informasi dan data siswa sekolah.
                  </p>
                </div>

                {/* Total Siswa */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.38 9.38 0 0 0 2.625-.372M15 19.128v-.003c0-1.113-.895-2.016-2-2.016h-2c-1.105 0-2 .903-2 2.016v.003m6 0a9.381 9.381 0 0 1-6 0m6 0a9.38 9.38 0 0 0 2.625.372 9.38 9.38 0 0 0 2.625-.372m-15 0a9.38 9.38 0 0 0 2.625.372 9.38 9.38 0 0 0 2.625-.372m0-10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm9 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Total Siswa
                    </p>

                    <p className="text-lg font-bold text-slate-700 dark:text-slate-100">
                      {user.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                MAIN CARD
            ====================================================== */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* =================================================
                  TOOLBAR
              ================================================== */}
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 lg:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Search */}
                  <div className="relative w-full lg:max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 text-slate-400 dark:text-slate-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama, NIS, no. HP..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
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
                  <div className="flex flex-wrap items-center gap-2">
                    <AddDataSiswa dataSiswa={dataUser} />

                    <ExcelExport data={user} fileName="Data Siswa" />

                    <ShowDataTrashSiswa />
                  </div>
                </div>
              </div>

              {/* =================================================
                  TABLE
              ================================================== */}
              <div
                className={`overflow-x-auto ${
                  isDarkMode ? "bg-slate-950" : "bg-white"
                }`}
              >
                <DataTable
                  columns={columns}
                  data={paginatedSiswa}
                  progressPending={pending}
                  selectableRowsHighlight
                  highlightOnHover
                  responsive
                  customStyles={dataTableStyles}
                  noDataComponent={
                    <div
                      className={`flex min-h-[250px] w-full flex-col items-center justify-center ${
                        isDarkMode ? "bg-slate-950" : "bg-white"
                      }`}
                    >
                      <div
                        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                          isDarkMode ? "bg-slate-800" : "bg-slate-100"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className={`h-6 w-6 ${
                            isDarkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 6.375c0 2.071-3.694 3.75-8.25 3.75S3.75 8.446 3.75 6.375m16.5 0c0-2.071-3.694-3.75-8.25-3.75S3.75 4.304 3.75 6.375m16.5 0v11.25c0 2.071-3.694 3.75-8.25 3.75s-8.25-1.679-8.25-3.75V6.375m16.5 0v3.75m-16.5-3.75v3.75"
                          />
                        </svg>
                      </div>

                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {search
                          ? "Data siswa tidak ditemukan"
                          : "Belum ada data siswa"}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          isDarkMode ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {search
                          ? "Coba gunakan kata kunci pencarian lain."
                          : "Data siswa akan muncul di sini."}
                      </p>
                    </div>
                  }
                />
              </div>

              {/* =================================================
                  PAGINATION
              ================================================== */}
              {!pending && totalRows > 0 && (
                <div className="border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900 lg:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Information */}
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
                      </span>{" "}
                      siswa
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Rows Per Page */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Baris per halaman
                        </span>

                        <select
                          value={rowsPerPage}
                          onChange={(e) =>
                            setRowsPerPage(Number(e.target.value))
                          }
                          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-500/10"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-1">
                        {/* Previous */}
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m15.75 19.5-7.5-7.5 7.5-7.5"
                            />
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) =>
                          page === "..." ? (
                            <span
                              key={`dots-${index}`}
                              className="flex h-8 w-7 items-center justify-center text-sm text-slate-400 dark:text-slate-500"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                                currentPage === page
                                  ? "bg-sky-500 text-white shadow-sm shadow-sky-200 dark:bg-sky-500 dark:shadow-sky-500/20"
                                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                              }`}
                            >
                              {page}
                            </button>
                          ),
                        )}

                        {/* Next */}
                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Siswa;
