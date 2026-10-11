import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";

import Main from "../../components/Main/Main";
import repoimages from "../../utils/repoimages";
import api from "../../utils/repositories";
import AddDataJadwalMapel from "../jadwalmapel/AddDataJadwalMapel";

function GuruMapelById() {
  const { id } = useParams();

  const [guruMapel, setGuruMapel] = useState({});
  const [listJadwalMapel, setListJadwalMapel] = useState([]); // Menyimpan seluruh daftar jadwal dari API
  const [selectedKelasId, setSelectedKelasId] = useState(""); // Menyimpan ID kelas yang sedang aktif dipilih
  const [guru, setGuru] = useState({});

  const [search, setSearch] = useState("");
  const [pendingData, setPendingData] = useState(true);

  // =========================================================
  // 1. GET DATA GURU MAPEL BY ID
  // =========================================================
  const getDataGuruMapelById = useCallback(async () => {
    try {
      const response = await api.get(`guru-mapel/${id}`);
      const data = response?.data?.data ?? {};
      setGuruMapel(data);
    } catch (error) {
      console.error("Gagal mengambil data guru mapel:", error);
      setGuruMapel({});
    }
  }, [id]);

  useEffect(() => {
    getDataGuruMapelById();
  }, [getDataGuruMapelById]);

  // =========================================================
  // 2. GET DAFTAR JADWAL MAPEL BERDASARKAN GURU & MAPEL
  // =========================================================
  const getDataJadwalMapelByGuruMapel = useCallback(async () => {
    if (!guruMapel?.guru_id || !guruMapel?.mata_pelajaran_id) return;

    setPendingData(true);
    try {
      const response = await api.get(
        `jadwal-mapel/guru/${guruMapel.guru_id}/mapel/${guruMapel.mata_pelajaran_id}`,
      );
      const data = response?.data?.data ?? [];
      console.log(data);
      setListJadwalMapel(data);

      // Otomatis pilih kelas pertama jika data tersedia dan belum ada pilihan
      if (data.length > 0) {
        const firstKelasId =
          data?.kelas_id ?? data?.kelas?.id ?? data?.id_kelas ?? "";
        setSelectedKelasId(String(firstKelasId));
      }
    } catch (error) {
      console.log(error.response);
      console.error("Gagal mengambil data jadwal mapel:", error);
      setListJadwalMapel([]);
    } finally {
      setPendingData(false);
    }
  }, [guruMapel]);

  // =========================================================
  // 3. GET DATA GURU BY NIP / GURU_ID
  // =========================================================
  const getDataGuruByNIP = useCallback(async () => {
    const nipGuru = guruMapel?.nip || guruMapel?.guru_id;
    if (!nipGuru) return;

    try {
      const response = await api.get(`guru/${nipGuru}`);
      const data = response?.data?.data ?? {};
      setGuru(data);
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
      setGuru({});
    }
  }, [guruMapel]);

  useEffect(() => {
    if (guruMapel?.guru_id && guruMapel?.mata_pelajaran_id) {
      getDataJadwalMapelByGuruMapel();
      getDataGuruByNIP();
    }
  }, [guruMapel, getDataJadwalMapelByGuruMapel, getDataGuruByNIP]);

  // =========================================================
  // EXTRACT DAFTAR KELAS UNTUK OPSI DROPDOWN
  // =========================================================
  const optionsKelas = useMemo(() => {
    const map = new Map();
    listJadwalMapel.forEach((item) => {
      const kId = item?.kelas_id ?? item?.kelas?.id ?? item?.id_kelas;
      const kNama = item?.nama_kelas ?? item?.kelas?.nama_kelas ?? "Kelas";
      const kJurusan = item?.jurusan ?? item?.kelas?.jurusan ?? "";
      if (kId && !map.has(String(kId))) {
        map.set(String(kId), {
          id: String(kId),
          label: `${kNama} ${kJurusan ? `- ${kJurusan}` : ""}`,
        });
      }
    });
    return Array.from(map.values());
  }, [listJadwalMapel]);

  // =========================================================
  // FILTER DATA BERDASARKAN KELAS YANG DIPILIH & KEYWORD SEARCH
  // =========================================================
  const filterData = useMemo(() => {
    // 1. Filter utama berdasarkan kelas yang dipilih dari dropdown
    let data = listJadwalMapel;
    if (selectedKelasId) {
      data = data.filter((item) => {
        const kId = String(
          item?.kelas_id ?? item?.kelas?.id ?? item?.id_kelas ?? "",
        );
        return kId === String(selectedKelasId);
      });
    }

    // 2. Filter berdasarkan pencarian teks (search keyword)
    const keyword = search.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) => {
      const hari = String(item?.hari ?? "").toLowerCase();
      const ruangan = String(
        item?.jurusan ?? item?.nama_kelasa ?? "",
      ).toLowerCase();
      const jam = String(item?.jam_mulai ?? item?.jam ?? "").toLowerCase();

      return (
        hari.includes(keyword) ||
        ruangan.includes(keyword) ||
        jam.includes(keyword)
      );
    });
  }, [listJadwalMapel, selectedKelasId, search]);

  // Helper pembuat warna badge hari
  const getHariBadgeColor = (hariStr) => {
    const day = String(hariStr).toLowerCase();
    switch (day) {
      case "senin":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
      case "selasa":
        return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800";
      case "rabu":
        return "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800";
      case "kamis":
        return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
      case "jumat":
        return "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  // =========================================================
  // DATA TABLE COLUMNS (JADWAL MAPEL)
  // =========================================================
  const columns = useMemo(
    () => [
      {
        name: "No",
        width: "70px",
        center: true,
        cell: (row, index) => (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {index + 1}
          </span>
        ),
      },
      {
        name: "Hari",
        selector: (row) => row?.hari ?? "-",
        sortable: true,
        width: "130px",
        cell: (row) => (
          <span
            className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getHariBadgeColor(
              row?.hari,
            )}`}
          >
            {row?.hari ?? "-"}
          </span>
        ),
      },
      {
        name: "Waktu / Jam",
        selector: (row) => row?.jam_mulai ?? row?.jam ?? "-",
        sortable: true,
        width: "180px",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-4 w-4 shrink-0 text-sky-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {row?.jam_mulai
                ? `${row.jam_mulai} - ${row.jam_selesai || ""}`
                : (row?.jam ?? "-")}
            </span>
          </div>
        ),
      },
      {
        name: "Ruangan",
        selector: (row) => row?.jurusan ?? row?.nama_kelas ?? "-",
        sortable: true,
        grow: 1,
        cell: (row) => (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-4 w-4 shrink-0 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {row?.jurusan
                ? row?.nama_kelas + " - " + row?.jurusan
                : "R. Kelas"}
            </span>
          </div>
        ),
      },
      {
        name: "Aksi",
        width: "100px",
        center: true,
        cell: (row) => (
          <button
            type="button"
            title="Detail Jadwal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        ),
      },
    ],
    [],
  );

  // =========================================================
  // DATATABLE STYLE
  // =========================================================
  const customStyles = useMemo(
    () => ({
      table: { style: { backgroundColor: "transparent" } },
      tableWrapper: { style: { backgroundColor: "transparent" } },
      responsiveWrapper: { style: { backgroundColor: "transparent" } },
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
      headCells: { style: { paddingLeft: "16px", paddingRight: "16px" } },
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
      cells: { style: { paddingLeft: "16px", paddingRight: "16px" } },
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
    }),
    [],
  );

  return (
    <Main>
      <div className="min-h-screen bg-slate-100 pt-[76px] dark:bg-slate-950 lg:ml-64">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* ================= HEADER ================= */}
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
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                    Manajemen Jadwal Pelajaran
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
                  Jadwal Mengajar Guru
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Daftar alokasi waktu dan tempat pelaksanaan kegiatan belajar
                  mengajar berdasarkan kelas.
                </p>
              </div>

              {/* Badge Mapel */}
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-xs font-bold text-white">
                  {guruMapel?.nama_mapel?.charAt(0)?.toUpperCase() || "M"}
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Mata Pelajaran
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {guruMapel?.kode_mapel ?? "-"}{" "}
                    {guruMapel?.nama_mapel ? `| ${guruMapel.nama_mapel}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CONTENT GRID ================= */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* INFO GURU */}
            <div className="xl:col-span-4">
              <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">
                        Informasi Pengajar
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Guru Pengampu
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center px-6 py-8">
                  <div className="relative mb-5">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg ring-4 ring-sky-50 dark:border-slate-800 dark:bg-slate-800 dark:ring-sky-900/20 sm:h-36 sm:w-36">
                      {guru?.image_profile ? (
                        <img
                          src={`${repoimages}${guru.image_profile}`}
                          alt={guru?.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
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
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {guru?.name ??
                      guruMapel?.nama_guru ??
                      "Belum ada data guru"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    NIP: {guru?.nip ?? guruMapel?.nip ?? "-"}
                  </p>

                  <div className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Total Sesi Mengajar
                    </p>
                    <p className="mt-1 text-sm font-bold text-sky-600 dark:text-sky-400">
                      {listJadwalMapel.length} Sesi Pertemuan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TABEL JADWAL MAPEL BERDASARKAN KELAS */}
            <div className="xl:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {/* Table Header & Dropdown Filter Kelas */}
                <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">
                        Daftar Jadwal Pelajaran
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Pilih kelas di bawah untuk menampilkan jadwal mengajar
                        yang sesuai.
                      </p>
                      <div className="py-2">
                        <AddDataJadwalMapel
                          guruMapel={guruMapel}
                          jadwalMapel={getDataJadwalMapelByGuruMapel}
                        />
                      </div>
                    </div>

                    {/* DROPDOWN FILTER KELAS */}
                    <div className="w-full sm:w-64">
                      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                        Pilih Kelas:
                      </label>
                      <select
                        value={selectedKelasId}
                        onChange={(e) => {
                          setSelectedKelasId(e.target.value);
                          setSearch(""); // Reset search saat ganti kelas
                        }}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500"
                      >
                        {optionsKelas.length === 0 ? (
                          <option value="">Tidak ada kelas tersedia</option>
                        ) : (
                          optionsKelas.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Search Bar & Stats */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Menampilkan{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {filterData.length}
                      </span>{" "}
                      jadwal untuk kelas yang dipilih
                    </p>

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
                        placeholder="Cari hari, jam, ruangan..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table Data Jadwal */}
                <div className="w-full overflow-x-auto">
                  <DataTable
                    columns={columns}
                    data={filterData}
                    progressPending={pendingData}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    highlightOnHover
                    responsive
                    persistTableHead
                    customStyles={customStyles}
                    noDataComponent={
                      <div className="flex min-h-40 flex-col items-center justify-center px-4 py-8">
                        <p className="src-text text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {search
                            ? "Jadwal tidak ditemukan"
                            : "Tidak ada jadwal untuk kelas ini"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          {search
                            ? "Coba sesuaikan kata kunci pencarian Anda."
                            : "Silakan pilih kelas lain pada dropdown di atas."}
                        </p>
                      </div>
                    }
                    progressComponent={
                      <div className="flex min-h-48 flex-col items-center justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
                        <p className="mt-3 text-sm text-slate-500">
                          Memuat jadwal mapel...
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

export default GuruMapelById;
