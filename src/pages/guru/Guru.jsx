import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import Main from "../../components/Main/Main";
import AddDataGuru from "./modal/AddDataGuru";
import DeleteGuruById from "./DeleteGuruById";
import StatusById from "./modal/StatusById";
import StatusUserVerified from "./modal/StatusUserVerified";
import ExcelExport from "../../components/laporan/excel/ExcelExport";
import ShowDataTrashGuru from "./trash-data/ShowDataTrashGuru";

import api from "../../utils/repositories";

function Guru() {
  const [guru, setGuru] = useState([]);
  const [filter, setFilter] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");

  /**
   * Mengambil data guru dari API
   */
  const dataGuru = useCallback(async () => {
    try {
      setPending(true);

      const response = await api.get("/guru/");
      const data = response?.data?.data ?? [];

      console.log("Data guru:", data);

      setGuru(data);
      setFilter(data);
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);

      setGuru([]);
      setFilter([]);
    } finally {
      setPending(false);
    }
  }, []);

  /**
   * Ambil data guru saat component pertama kali dimuat
   */
  useEffect(() => {
    dataGuru();
  }, [dataGuru]);

  /**
   * Filter data berdasarkan pencarian
   */
  useEffect(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      setFilter(guru);
      return;
    }

    const result = guru.filter((item) => {
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

    setFilter(result);
  }, [search, guru]);

  /**
   * Kolom DataTable
   */
  const columns = [
    {
      name: "Nama Lengkap",
      selector: (row) => row?.name ?? "-",
      sortable: true,
    },
    {
      name: "NIP",
      selector: (row) => row?.nip ?? "-",
      sortable: true,
    },
    {
      name: "Jenis Kelamin",
      selector: (row) => row?.jenis_kelamin ?? "-",
      sortable: true,
    },
    {
      name: "No. Handphone",
      selector: (row) => row?.no_hp ?? "-",
      sortable: true,
    },
    {
      name: "Alamat",
      selector: (row) => row?.alamat ?? "-",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => <StatusById row={row} dataGuru={dataGuru} />,
      sortable: true,
    },
    {
      name: "User Status",
      cell: (row) => <StatusUserVerified row={row} dataGuru={dataGuru} />,
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex flex-row items-center gap-x-3">
          <Link to={`/guru/${row?.nip}`}>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-sky-500 text-sky-500 shadow-sm transition duration-200 hover:bg-sky-500 hover:text-white">
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </div>
          </Link>

          <DeleteGuruById username={row?.nip} />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Main>
      <div className="grid min-h-screen grid-cols-1 bg-slate-100 lg:grid-cols-6">
        <div className="p-4 lg:col-span-5 lg:col-start-2 lg:p-5">
          {/* Header */}
          <div className="flex justify-start py-4">
            <h4 className="text-xl font-bold text-slate-500">Data Guru</h4>
          </div>

          <div className="flex flex-col gap-y-10">
            <div className="grid grid-cols-1 gap-5">
              <div className="rounded-lg bg-white p-5 shadow-md">
                <div className="w-full">
                  {/* Toolbar */}
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari data guru..."
                        className="w-full rounded-md border border-sky-500 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-200"
                      />

                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5 text-sky-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Tombol */}
                    <div className="flex flex-wrap items-center gap-2">
                      <AddDataGuru dataGuru={dataGuru} />

                      <ExcelExport data={guru} fileName="Data Guru" />

                      <ShowDataTrashGuru />
                    </div>
                  </div>

                  {/* Table */}
                  <DataTable
                    columns={columns}
                    data={filter}
                    progressPending={pending}
                    pagination
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    persistTableHead
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

export default Guru;
