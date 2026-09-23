import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";

import Main from "../../components/Main/Main";
import repoimages from "../../utils/repoimages";
import ShowDataSiswa from "./modal/ShowDataSiswa";
import RefreshDataSiswaByKelas from "./components/RefreshDataSiswaByKelas";
import DeleteDataSiswaHistory from "./components/DeleteDataSiswaHistory";
import api from "../../utils/repositories";

function KelasById() {
  const { nip, id, kelasid } = useParams();

  const [kelas, setKelas] = useState({});
  const [guru, setGuru] = useState({});
  const [siswaByKelas, setSiswaByKelas] = useState([]);

  const [search, setSearch] = useState("");
  const [pendingData, setPendingData] = useState(true);

  // =========================================================
  // GET DATA KELAS
  // =========================================================
  const getDataKelasById = useCallback(async () => {
    try {
      const response = await api.get(`ruang-kelas/${id}`);
      console.log("kelasbyid", response);

      const data = response?.data?.data ?? [];

      setKelas(data[0] ?? {});
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
      setKelas({});
    }
  }, [nip, id]);

  // =========================================================
  // GET DATA GURU
  // =========================================================
  const getDataGuru = useCallback(async () => {
    try {
      const response = await api.get(`guru/${nip}`);

      setGuru(response?.data?.data ?? {});
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
      setGuru({});
    }
  }, [nip]);

  // =========================================================
  // GET DATA SISWA
  // =========================================================
  const getDataSiswaByKelas = useCallback(async () => {
    try {
      setPendingData(true);

      const response = await api.get(`siswa-kelas/${nip}/${kelasid}`);
      console.log("data siswa kelas", response);

      const data = Array.isArray(response?.data)
        ? response.data
        : (response?.data?.data ?? []);

      setSiswaByKelas(data);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
      console.log(error.response);
      setSiswaByKelas([]);
    } finally {
      setPendingData(false);
    }
  }, [id]);

  // =========================================================
  // LOAD SEMUA DATA
  // =========================================================
  useEffect(() => {
    getDataKelasById();
    getDataGuru();
    getDataSiswaByKelas();
  }, [getDataKelasById, getDataGuru, getDataSiswaByKelas]);

  // =========================================================
  // FILTER DATA SISWA
  // =========================================================
  const filterData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return siswaByKelas;
    }

    return siswaByKelas.filter((item) => {
      const nama = String(item?.nama_siswa ?? "").toLowerCase();
      const nis = String(item?.nis ?? "").toLowerCase();

      return nama.includes(keyword) || nis.includes(keyword);
    });
  }, [siswaByKelas, search]);

  // =========================================================
  // DATA TABLE COLUMNS
  // =========================================================
  const columns = useMemo(
    () => [
      {
        name: "No",
        width: "70px",
        center: true,
        cell: (row, index) => (
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {index + 1}
          </span>
        ),
      },

      {
        name: "Nama Lengkap",
        selector: (row) => row?.nama_siswa ?? "-",
        sortable: true,
        width: "250px",
        grow: 2,
        cell: (row) => (
          <div className="flex items-center gap-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
              {String(row?.nama_siswa ?? "?")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                {row?.nama_siswa ?? "-"}
              </p>
            </div>
          </div>
        ),
      },

      {
        name: "No. Induk",
        selector: (row) => row?.nis ?? "-",
        sortable: true,
        width: "160px",
        cell: (row) => (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {row?.nis ?? "-"}
          </span>
        ),
      },

      {
        name: "Action",
        width: "110px",
        center: true,
        cell: (row) => (
          <div className="flex items-center justify-center">
            <DeleteDataSiswaHistory
              id={row?.id}
              getDataSiswaByKelas={getDataSiswaByKelas}
            />
          </div>
        ),
      },
    ],
    [getDataSiswaByKelas],
  );

  // =========================================================
  // DATATABLE STYLE
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
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
          color: "rgb(71 85 105)",
        },
      },

      headCells: {
        style: {
          paddingLeft: "16px",
          paddingRight: "16px",
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
          paddingLeft: "16px",
          paddingRight: "16px",
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
    <Main>
      <div className="min-h-screen bg-slate-100 pt-[76px] dark:bg-slate-950 lg:ml-64">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* =====================================================
              HEADER
          ===================================================== */}
          <div className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 21h16.5M4.5 18.75V9.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v9m0 0V4.75A.75.75 0 0 1 10.25 4h3.5a.75.75 0 0 1 .75.75v14m0 0v-5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v5"
                      />
                    </svg>
                  </div>

                  <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                    Manajemen Kelas
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
                  Data Kelas
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Kelola informasi wali kelas dan data siswa.
                </p>
              </div>

              {/* Badge Kelas */}
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-xs font-bold text-white">
                  {kelas?.nama_kelas?.charAt(0)?.toUpperCase() || "K"}
                </span>

                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Kelas
                  </p>

                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {kelas?.nama_kelas ?? "-"}
                    {kelas?.jurusan ? ` | ${kelas.jurusan}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              DETAIL KELAS
          ===================================================== */}
          <ShowDataSiswa kelasId={kelasid} waliKelasId={nip} />

          {/* =====================================================
              CONTENT
          ===================================================== */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* ===================================================
                WALI KELAS
            =================================================== */}
            <div className="xl:col-span-4">
              <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                {/* Card Header */}
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.8"
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                        />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">
                        Wali Kelas
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Informasi guru kelas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col items-center px-6 py-8">
                  {/* Profile Image */}
                  <div className="relative mb-5">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg ring-4 ring-sky-50 dark:border-slate-800 dark:bg-slate-800 dark:ring-sky-900/20 sm:h-36 sm:w-36">
                      {guru?.image_profile ? (
                        <img
                          src={`${repoimages}${guru.image_profile}`}
                          alt={guru?.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.3"
                            stroke="currentColor"
                            className="h-16 w-16"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                  </div>

                  {/* Guru Information */}
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {guru?.name ?? "Belum ada wali kelas"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {guru?.nip ?? "-"}
                  </p>

                  {/* Kelas */}
                  <div className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Kelas yang diampu
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                      {kelas?.nama_kelas ?? "-"}
                      {kelas?.jurusan ? ` | ${kelas.jurusan}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================
                DATA SISWA
            =================================================== */}
            <div className="xl:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {/* Table Header */}
                <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">
                        Daftar Siswa
                      </h2>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Daftar siswa yang terdaftar pada kelas ini.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {/* Search */}
                      <div className="relative w-full sm:w-64">
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
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Cari nama atau NIS..."
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-800 dark:focus:ring-sky-900/30"
                        />

                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
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

                      {/* Refresh */}
                      <div className="flex justify-end">
                        <RefreshDataSiswaByKelas
                          getDataSiswaByKelas={getDataSiswaByKelas}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Result Info */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Menampilkan{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {filterData.length}
                      </span>{" "}
                      siswa
                    </p>

                    {search && (
                      <p className="text-xs text-sky-600 dark:text-sky-400">
                        Hasil pencarian:{" "}
                        <span className="font-semibold">"{search}"</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
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
                      <div className="flex min-h-40 flex-col items-center justify-center px-4">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6.75h.75A2.25 2.25 0 0 1 18.75 9v9a2.25 2.25 0 0 1-2.25 2.25H7.5A2.25 2.25 0 0 1 5.25 18V9A2.25 2.25 0 0 1 7.5 6.75h.75m7.5 0v-1.5A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v1.5m7.5 0h-7.5"
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
                            ? "Coba gunakan kata kunci lain."
                            : "Belum ada siswa yang terdaftar di kelas ini."}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default KelasById;
