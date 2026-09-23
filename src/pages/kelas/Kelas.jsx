import { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import Main from "../../components/Main/Main";
import DeleteKelasById from "./DeleteKelasById";
import UpdateKelasById from "./UpdateKelasById";
import AddDataKelas from "./AddDataKelas";
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
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

/* =========================================================
   ICON
========================================================= */

const SearchIcon = ({ className = "size-5" }) => (
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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const UserIcon = ({ className = "size-5" }) => (
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
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const RefreshIcon = ({ className = "size-5" }) => (
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
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const ClassroomIcon = ({ className = "size-5" }) => (
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
      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
    />
  </svg>
);

/* =========================================================
   JURUSAN ICON
========================================================= */

const JurusanIcon = ({ jurusan, className = "size-6" }) => {
  if (jurusan === "Teknik Komputer & Jaringan") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.7"
        stroke="currentColor"
        className={`${className} text-red-500`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
        />
      </svg>
    );
  }

  if (jurusan === "Akuntansi") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.7"
        stroke="currentColor"
        className={`${className} text-amber-500`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
        />
      </svg>
    );
  }

  if (jurusan === "Pemasaran") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.7"
        stroke="currentColor"
        className={`${className} text-emerald-500`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className={`${className} text-sky-500`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
};

/* =========================================================
   LOADING
========================================================= */

const LoadingState = () => (
  <div className="flex min-h-72 w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 dark:bg-sky-950/40">
        <RefreshIcon className="size-7 animate-spin" />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Memuat data kelas
        </p>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Mohon tunggu sebentar...
        </p>
      </div>
    </div>
  </div>
);

/* =========================================================
   KARTU KELAS UNTUK GURU
========================================================= */

const KelasCard = ({ kelas }) => {
  return (
    <Link
      to={`${kelas.nip}/${kelas.id}/${kelas.kelas_id}`}
      className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white
        p-5 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:border-sky-200
        hover:shadow-xl hover:shadow-sky-100/50
        dark:border-slate-800 dark:bg-slate-900
        dark:hover:border-sky-800 dark:hover:shadow-sky-950/20
      "
    >
      {/* Accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex size-16 shrink-0 items-center justify-center
            rounded-2xl bg-slate-50
            transition-transform duration-300
            group-hover:scale-105
            dark:bg-slate-800
          "
        >
          <JurusanIcon jurusan={kelas.jurusan} className="size-10" />
        </div>

        <div
          className="
            rounded-lg bg-slate-100 px-2.5 py-1
            text-[10px] font-bold uppercase tracking-wider
            text-slate-500
            dark:bg-slate-800 dark:text-slate-400
          "
        >
          {kelas.semester === "I" ? "Ganjil" : "Genap"}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Kelas
        </p>

        <h3 className="mt-1 truncate text-lg font-bold text-slate-800 dark:text-white">
          {kelas.kelas}
        </h3>

        <p className="mt-1 line-clamp-2 min-h-10 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
          {kelas.jurusan}
        </p>
      </div>

      <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Wali Kelas
        </p>

        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-950/40">
            <UserIcon className="size-4" />
          </div>

          <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
            {kelas.wali_kelas || "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          Tahun Ajaran
        </span>

        <span className="rounded-md bg-sky-50 px-2 py-1 text-[11px] font-bold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
          {kelas.tahun_ajaran}
        </span>
      </div>
    </Link>
  );
};

/* =========================================================
   KOMPONEN UTAMA
========================================================= */

function Kelas() {
  const token = localStorage.getItem("username") || "";
  const username = token.replace(/"/g, "");

  const [kelasHistory, setKelasHistory] = useState([]);
  const [user, setUser] = useState({});
  const [datakelasGuru, setDataKelasGuru] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =====================================================
     GET DATA KELAS
  ===================================================== */

  const getKelasHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("ruang-kelas/").then((res) => res.data);
      console.log("kelas", response);

      if (response?.status === 200) {
        setKelasHistory(response.data || []);
      }
    } catch (e) {
      console.error("Error get kelas:", e);

      if (e.message === "Failed to fetch") {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     GET DATA KELAS GURU
  ===================================================== */

  const getDataKelasByGuru = useCallback(async () => {
    if (!username) return;

    try {
      const response = await api
        .get(`ruang-kelas/guru/${username}`)
        .then((res) => res.data);
      console.log(response);

      setDataKelasGuru(response?.data || []);
    } catch (e) {
      console.error("Error get kelas guru:", e);

      if (e.message === "Failed to fetch") {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  }, [username]);

  /* =====================================================
     GET USER
  ===================================================== */

  const getUserById = useCallback(async () => {
    if (!username) return;

    try {
      const response = await api
        .get(`user/${username}/guru`)
        .then((res) => res.data);
      console.log(response);

      setUser(response?.data || {});
    } catch (e) {
      console.error("Error get user:", e);

      if (e.message === "Failed to fetch") {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  }, [username]);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    getKelasHistory();
    getUserById();
    getDataKelasByGuru();
  }, [getKelasHistory, getUserById, getDataKelasByGuru]);

  /* =====================================================
     FILTER DATA
  ===================================================== */

  const filteredKelas = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return kelasHistory;
    }

    return kelasHistory.filter((item) => {
      const jurusan = String(item.jurusan || "").toLowerCase();
      const namaKelas = String(item.nama_kelas || "").toLowerCase();
      const kelas = String(item.kelas || "").toLowerCase();
      const semester = String(item.semester || "").toLowerCase();
      const tahunAjaran = String(item.tahun_ajaran || "").toLowerCase();
      const namaGuru = String(item.name || "").toLowerCase();
      const waliKelas = String(item.wali_kelas || "").toLowerCase();

      return (
        jurusan.includes(keyword) ||
        namaKelas.includes(keyword) ||
        kelas.includes(keyword) ||
        semester.includes(keyword) ||
        tahunAjaran.includes(keyword) ||
        namaGuru.includes(keyword) ||
        waliKelas.includes(keyword)
      );
    });
  }, [kelasHistory, search]);

  /* =====================================================
     DATATABLE COLUMNS
  ===================================================== */

  const columns = useMemo(
    () => [
      {
        name: "KELAS",
        sortable: true,
        grow: 1.5,
        selector: (row) =>
          `${row.nama_kelas || row.kelas || "-"} | ${row.jurusan || "-"}`,
        cell: (row) => (
          <div className="flex min-w-0 items-center gap-3 py-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <JurusanIcon jurusan={row.jurusan} className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-700 dark:text-slate-200">
                {row.nama_kelas || row.kelas || "-"}
              </p>

              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                {row.jurusan || "-"}
              </p>
            </div>
          </div>
        ),
      },

      {
        name: "DETAIL",
        width: "90px",
        center: true,
        cell: (row) => (
          <Link
            to={`${row.nip}/${row.id}/${row.kelas_id}`}
            className="
              flex size-9 items-center justify-center
              rounded-lg border border-slate-200
              bg-white text-sky-500
              transition-all
              hover:border-sky-200 hover:bg-sky-50
              dark:border-slate-700 dark:bg-slate-800
              dark:hover:border-sky-700 dark:hover:bg-sky-950/40
            "
            title="Lihat kelas"
          >
            <ClassroomIcon className="size-5" />
          </Link>
        ),
      },

      {
        name: "WALI KELAS",
        sortable: true,
        grow: 1.2,
        selector: (row) => row.name || row.wali_kelas || "-",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-950/40">
              <UserIcon className="size-4" />
            </div>

            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {row.name || row.wali_kelas || "-"}
            </span>
          </div>
        ),
      },

      {
        name: "SEMESTER",
        sortable: true,
        grow: 0.9,
        selector: (row) =>
          `${row.semester === "I" ? "Ganjil" : "Genap"} - ${
            row.tahun_ajaran || "-"
          }`,
        cell: (row) => (
          <div>
            <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {row.semester === "I" ? "Ganjil" : "Genap"}
            </span>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              {row.tahun_ajaran || "-"}
            </p>
          </div>
        ),
      },

      {
        name: "AKSI",
        width: "125px",
        right: true,
        cell: (row) => (
          <div className="flex items-center gap-2">
            <UpdateKelasById id={row.id} />

            <DeleteKelasById id={row.id} getKelasHistory={getKelasHistory} />
          </div>
        ),
      },
    ],
    [getKelasHistory],
  );

  /* =====================================================
     DATATABLE CUSTOM STYLE
  ===================================================== */

  const customStyles = {
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

    headRow: {
      style: {
        minHeight: "52px",
        backgroundColor: "transparent",
        borderBottom: "1px solid var(--datatable-border)",
      },
    },

    headCells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.05em",
        color: "var(--datatable-head)",
      },
    },

    rows: {
      style: {
        minHeight: "68px",
        backgroundColor: "transparent",
        borderBottom: "1px solid var(--datatable-border)",
        color: "var(--datatable-text)",
        transition: "background-color 0.2s ease",
      },

      highlightOnHoverStyle: {
        backgroundColor: "var(--datatable-hover)",
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
        borderTop: "1px solid var(--datatable-border)",
        backgroundColor: "transparent",
        color: "var(--datatable-text)",
        minHeight: "56px",
      },
    },
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Main>
      <div className="min-h-screen bg-slate-100 pt-[76px] dark:bg-slate-950 lg:ml-64">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                  <ClassroomIcon className="size-5" />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-2xl">
                    Ruang Kelas
                  </h1>

                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 sm:text-sm">
                    Kelola data ruang kelas dan wali kelas
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Kelas
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-700 dark:text-white">
                  {kelasHistory.length}
                </p>
              </div>

              {user.status_id == 1 && (
                <AddDataKelas getKelasHistory={getKelasHistory} />
              )}
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          {loading ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <LoadingState />
            </div>
          ) : user.status_id == 2 ? (
            /* ================================================
               GURU
            ================================================ */

            <div>
              {datakelasGuru.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {datakelasGuru.map((kelas) => (
                    <KelasCard key={kelas.id} kelas={kelas} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <ClassroomIcon className="size-7" />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                    Belum ada ruang kelas
                  </h3>

                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                    Anda belum memiliki ruang kelas yang terdaftar pada sistem.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ================================================
               ADMIN / OPERATOR
            ================================================ */

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Toolbar */}
              <div className="border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Data Ruang Kelas
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Daftar seluruh ruang kelas yang terdaftar
                    </p>
                  </div>

                  <div className="relative w-full lg:max-w-sm">
                    <SearchIcon
                      className="
                        pointer-events-none absolute left-3 top-1/2
                        size-4 -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari kelas, jurusan, wali kelas..."
                      className="
                        h-10 w-full rounded-xl
                        border border-slate-200
                        bg-slate-50
                        pl-10 pr-4
                        text-sm text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-sky-400
                        focus:bg-white
                        focus:ring-4 focus:ring-sky-500/10
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-200
                        dark:placeholder:text-slate-500
                        dark:focus:border-sky-600
                        dark:focus:bg-slate-800
                      "
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="
                          absolute right-3 top-1/2
                          flex size-5 -translate-y-1/2
                          items-center justify-center
                          rounded-full
                          text-slate-400
                          transition
                          hover:bg-slate-200 hover:text-slate-600
                          dark:hover:bg-slate-700
                        "
                        title="Hapus pencarian"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Result Information */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />

                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {filteredKelas.length} data ditemukan
                  </span>
                </div>

                {search && (
                  <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                    Pencarian: "{search}"
                  </span>
                )}
              </div>

              {/* DataTable */}
              <div className="kelas-datatable px-2 pb-2 sm:px-3">
                <DataTable
                  data={filteredKelas}
                  columns={columns}
                  customStyles={customStyles}
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 20, 30, 50]}
                  highlightOnHover
                  responsive
                  persistTableHead
                  noDataComponent={
                    <div className="flex w-full flex-col items-center justify-center py-16">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <SearchIcon className="size-7" />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Data tidak ditemukan
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Coba gunakan kata kunci pencarian yang berbeda.
                      </p>
                    </div>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          DATATABLE DARK MODE VARIABLES
      ===================================================== */}

      <style>{`
        .kelas-datatable {
          --datatable-border: #f1f5f9;
          --datatable-head: #64748b;
          --datatable-text: #475569;
          --datatable-hover: #f8fafc;
        }

        .dark .kelas-datatable {
          --datatable-border: #1e293b;
          --datatable-head: #94a3b8;
          --datatable-text: #cbd5e1;
          --datatable-hover: #172033;
        }

        .kelas-datatable .rdt_Table {
          background-color: transparent !important;
        }

        .kelas-datatable .rdt_TableHead {
          background-color: transparent !important;
        }

        .kelas-datatable .rdt_TableHeadRow {
          background-color: transparent !important;
        }

        .kelas-datatable .rdt_TableRow {
          background-color: transparent !important;
        }

        .kelas-datatable .rdt_TableCell {
          background-color: transparent !important;
        }

        .kelas-datatable .rdt_Pagination {
          background-color: transparent !important;
        }

        .dark .kelas-datatable .rdt_TableRow:hover {
          background-color: #172033 !important;
        }

        .dark .kelas-datatable .rdt_Pagination {
          color: #cbd5e1 !important;
        }

        .dark .kelas-datatable .rdt_Pagination button {
          color: #cbd5e1 !important;
          fill: #cbd5e1 !important;
        }

        .dark .kelas-datatable .rdt_Pagination select {
          color: #cbd5e1 !important;
          background-color: #0f172a !important;
        }
      `}</style>
    </Main>
  );
}

export default Kelas;
