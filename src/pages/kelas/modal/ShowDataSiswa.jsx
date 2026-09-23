import { useCallback, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";

import AddDataSiswaHistory from "./AddDataSiswaHistory";
import RefreshDataSiswa from "./RefreshDataSiswa";

import api from "../../../utils/repositories";

function ShowDataSiswa({ kelasId, waliKelasId }) {
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [siswa, setSiswa] = useState([]);
  const [pendingData, setPendingData] = useState(false);

  // =========================================================
  // OPEN MODAL
  // =========================================================
  const openModal = () => {
    setIsOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeModal = () => {
    setIsOpen(false);
  };

  // =========================================================
  // ESCAPE KEY + BODY SCROLL
  // =========================================================
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // =========================================================
  // GET DATA SISWA
  // =========================================================
  const getDataSiswa = useCallback(async () => {
    try {
      setPendingData(true);

      const response = await api.get("siswa/search");

      const data = Array.isArray(response?.data)
        ? response.data
        : (response?.data?.data ?? []);
      console.log(response);

      setSiswa(data);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
      setSiswa([]);
    } finally {
      setPendingData(false);
    }
  }, []);

  // =========================================================
  // LOAD DATA SAAT COMPONENT DIBUAT
  // =========================================================
  useEffect(() => {
    getDataSiswa();
  }, [getDataSiswa]);

  // =========================================================
  // FILTER DATA
  // =========================================================
  const filterData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return siswa;
    }

    return siswa.filter((item) => {
      const nama = String(item?.name ?? item?.nama ?? "").toLowerCase();

      const nis = String(item?.nis ?? "").toLowerCase();

      const noHp = String(item?.no_hp ?? "").toLowerCase();

      const alamat = String(item?.alamat ?? "").toLowerCase();

      return (
        nama.includes(keyword) ||
        nis.includes(keyword) ||
        noHp.includes(keyword) ||
        alamat.includes(keyword)
      );
    });
  }, [siswa, search]);

  // =========================================================
  // DATATABLE COLUMNS
  // =========================================================
  const columns = useMemo(
    () => [
      {
        name: "No",
        width: "65px",
        center: true,
        cell: (row, index) => (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {index + 1}
          </span>
        ),
      },

      {
        name: "Nama Lengkap",
        selector: (row) => row?.name ?? row?.nama ?? "-",
        sortable: true,
        grow: 1.5,
        cell: (row) => {
          const nama = row?.name ?? row?.nama ?? "-";

          return (
            <div className="flex items-center gap-3 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                {String(nama).charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {nama}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        name: "No. Induk",
        selector: (row) => row?.nis ?? "-",
        sortable: true,
        width: "140px",
        cell: (row) => (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {row?.nis ?? "-"}
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
        grow: 1.5,
        cell: (row) => (
          <span
            className="max-w-[280px] truncate text-sm text-slate-600 dark:text-slate-300"
            title={row?.alamat ?? "-"}
          >
            {row?.alamat ?? "-"}
          </span>
        ),
      },

      {
        name: "Action",
        width: "110px",
        center: true,
        cell: (row) => (
          <div className="flex items-center justify-center">
            <AddDataSiswaHistory
              kelasId={kelasId}
              siswaId={row?.id}
              waliKelasId={waliKelasId}
              getDataSiswa={getDataSiswa}
            />
          </div>
        ),
      },
    ],
    [kelasId, getDataSiswa],
  );

  // =========================================================
  // DATATABLE CUSTOM STYLE
  // =========================================================
  const customStyles = useMemo(
    () => ({
      table: {
        style: {
          backgroundColor: "transparent",
        },
      },

      tableWrapper: {
        style: {
          backgroundColor: "transparent",
        },
      },

      responsiveWrapper: {
        style: {
          backgroundColor: "transparent",
        },
      },

      headRow: {
        style: {
          minHeight: "52px",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "rgb(226 232 240)",
          backgroundColor: "rgb(248 250 252)",
          color: "rgb(71 85 105)",
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
        },
      },

      headCells: {
        style: {
          paddingLeft: "14px",
          paddingRight: "14px",
        },
      },

      rows: {
        style: {
          minHeight: "64px",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "rgb(241 245 249)",
          backgroundColor: "transparent",
          color: "rgb(51 65 85)",
          transition: "background-color 0.2s ease",
        },

        highlightOnHoverStyle: {
          backgroundColor: "rgb(248 250 252)",
          cursor: "pointer",
        },
      },

      cells: {
        style: {
          paddingLeft: "14px",
          paddingRight: "14px",
        },
      },

      pagination: {
        style: {
          minHeight: "60px",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          borderTopColor: "rgb(226 232 240)",
          backgroundColor: "transparent",
          color: "rgb(71 85 105)",
        },
      },

      noData: {
        style: {
          minHeight: "180px",
          backgroundColor: "transparent",
          color: "rgb(100 116 139)",
          fontSize: "14px",
        },
      },

      progress: {
        style: {
          backgroundColor: "transparent",
        },
      },
    }),
    [],
  );

  return (
    <>
      {/* =====================================================
          SEARCH / OPEN MODAL
      ===================================================== */}
      <button
        type="button"
        onClick={openModal}
        className="group relative w-full text-left sm:w-80"
      >
        <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 group-hover:border-sky-300 group-hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:group-hover:border-sky-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.7"
            stroke="currentColor"
            className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-sky-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.05 6.05a7.5 7.5 0 0 0 10.6 10.6Z"
            />
          </svg>

          <span className="ml-3 text-sm text-slate-400 dark:text-slate-500">
            Tambah siswa ke kelas...
          </span>

          <span className="ml-auto rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            Cari
          </span>
        </div>
      </button>

      {/* =====================================================
          MODAL
      ===================================================== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="show-data-siswa-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* =================================================
              MODAL CONTAINER
          ================================================= */}
          <div
            className="relative z-10 flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}
            <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M15 21a6 6 0 0 0-12 0m9-13.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2
                      id="show-data-siswa-title"
                      className="text-base font-bold text-slate-800 dark:text-white sm:text-lg"
                    >
                      Tambah Siswa ke Kelas
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Pilih siswa yang ingin ditambahkan ke kelas.
                    </p>
                  </div>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:text-slate-500 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 dark:focus:ring-rose-900/30"
                  aria-label="Tutup modal"
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
              </div>
            </div>

            {/* =================================================
                TOOLBAR
            ================================================= */}
            <div className="shrink-0 border-b border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.05 6.05a7.5 7.5 0 0 0 10.6 10.6Z"
                    />
                  </svg>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari nama, NIS, nomor HP..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-900/30"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      aria-label="Hapus pencarian"
                    >
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
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="rounded-lg bg-white px-3 py-2 text-xs text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {filterData.length}
                    </span>{" "}
                    siswa tersedia
                  </div>

                  <RefreshDataSiswa getDataSiswa={getDataSiswa} />
                </div>
              </div>
            </div>

            {/* =================================================
                TABLE CONTENT
            ================================================= */}
            <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-slate-900">
              <DataTable
                columns={columns}
                data={filterData}
                progressPending={pendingData}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                selectableRowsHighlight
                highlightOnHover
                responsive
                persistTableHead
                customStyles={customStyles}
                noDataComponent={
                  <div className="flex min-h-48 flex-col items-center justify-center px-5">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-7 w-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6.75h.75A2.25 2.25 0 0 1 18.75 9v9a2.25 2.25 0 0 1-2.25 2.25H7.5A2.25 2.25 0 0 1 5.25 18V9A2.25 2.25 0 0 1 7.5 6.75h.75m7.5 0v-1.5A2.25 2.25 0 0 1 10.5 3h3a2.25 2.25 0 0 1 2.25 2.25v1.5m-7.5 0h7.5"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {search
                        ? "Siswa tidak ditemukan"
                        : "Belum ada data siswa"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {search
                        ? "Coba gunakan kata kunci pencarian yang lain."
                        : "Data siswa yang tersedia akan ditampilkan di sini."}
                    </p>
                  </div>
                }
                progressComponent={
                  <div className="flex min-h-48 flex-col items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />

                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      Memuat data siswa...
                    </p>
                  </div>
                }
              />
            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}
            <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30 sm:px-6">
              <p className="hidden text-xs text-slate-400 dark:text-slate-500 sm:block">
                Tekan{" "}
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-900">
                  ESC
                </kbd>{" "}
                untuk menutup
              </p>

              <button
                type="button"
                onClick={closeModal}
                className="ml-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-slate-700"
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

export default ShowDataSiswa;
