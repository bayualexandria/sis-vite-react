import { useState, useEffect } from "react";
import Main from "../../components/Main/Main";
import DataTable from "react-data-table-component";

import { Link } from "react-router-dom";

import DeleteSiswaById from "./DeleteSiswaById";
import ShowDataTrashSiswa from "./trash-data/ShowDataTrashSiswa";
import ExcelExport from "../../components/laporan/excel/ExcelExport";
import AddDataSiswa from "./modal/AddDataSiswa";
import api from "../../utils/repositories";

function Siswa() {
  const [user, setUser] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState([]);

  const dataUser = async () => {
    try {
      const response = await api
        .get(`siswa/`, {
          withCredentials: true,
        })
        .then((res) => res.data);
      console.log("siswa", response);
      setUser(response.data);
      setFilter(response.data);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    dataUser();
    const timeout = setTimeout(() => {
      setColumns([
        {
          name: "Nama Lengkap",
          selector: (row) => row.name,
          sortable: true,
        },
        {
          name: "NIS",
          selector: (row) => row.nis,
          sortable: true,
        },
        {
          name: "Jenis Kelamin",
          selector: (row) => row.jenis_kelamin,
          sortable: true,
        },
        {
          name: "No. Handphone",
          selector: (row) => row.no_hp,
          sortable: true,
        },
        {
          name: "Alamat",
          selector: (row) => row.alamat,
          sortable: true,
        },
        {
          name: "Action",
          selector: (row) => (
            <div className="flex flex-row gap-x-3">
              <Link to={`/siswa/${row.nis}`}>
                <div className="w-6 h-6 rounded-full shadow-md flex justify-center items-center border border-sky-500 hover:text-white text-sky-500 hover:bg-sky-500 transition duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              </Link>
              <DeleteSiswaById username={row.nis} />
            </div>
          ),
          sortable: true,
        },
      ]);

      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const result = user.filter((item) => {
      return (
        item.name.toLowerCase().match(search.toLowerCase()) ||
        item.nis.toLowerCase().match(search.toLowerCase()) ||
        item.jenis_kelamin.toLowerCase().match(search.toLowerCase()) ||
        item.no_hp.toLowerCase().match(search.toLowerCase()) ||
        item.alamat.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilter(result);
  }, [search]);

  return (
    <Main>
      <div className="grid grid-cols-6 bg-slate-100">
        <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
          <div className="flex justify-start py-4">
            <h4 className="font-bold text-xl text-slate-500">Data Siswa</h4>
          </div>
          <div className="flex flex-col gap-y-10">
            <div className="grid gap-5 grid-col-1 ">
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
                    <AddDataSiswa />
                    <ExcelExport data={user} fileName="Data Siswa" />
                    <ShowDataTrashSiswa />
                  </div>
                </div>
              </div>
              <div className="p-1 transition duration-300 bg-white rounded-lg shadow-md ">
                <DataTable
                  data={filter}
                  columns={columns}
                  progressPending={pending}
                  pagination
                  selectableRowsHighlight
                  highlightOnHover
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Siswa;
