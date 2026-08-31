import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Main from "../../components/Main/Main";
import Cookies from "js-cookie";
import repositori from "../../utils/repositories";
import repoimages from "../../utils/repoimages";
import ShowDataSiswa from "./modal/ShowDataSiswa";
import DataTable from "react-data-table-component";
import RefreshDataSiswaByKelas from "./components/RefreshDataSiswaByKelas";
import DeleteDataSiswaHistory from "./components/DeleteDataSiswaHistory";

function KelasById() {
  const { nip, id } = useParams();
  const dataToken = Cookies.get("authentication");
  const token = dataToken.split(",");
  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [pendingData, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const [siswaByKelas, setSiswaByKelas] = useState([]);

  const getDataKelasById = async () => {
    try {
      let response = await fetch(`${repositori}kelas/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
      }).then((res) => res.json());
      // console.log("kelas hello", response.data);
      setKelas(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getDataKelasById();
  }, []);

  const dataGuru = async () => {
    try {
      let response = await fetch(`${repositori}guru/${nip}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
      }).then((res) => res.json());
      setGuru(response.data);
      // console.log("guru", nip);
    } catch (error) {}
  };

  const getDataSiswaByKelas = async () => {
    try {
      let response = await fetch(`${repositori}siswa/kelas/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
      })
        .then((res) => res.json())
        .then((res) => res.data);
      // console.log("siswa hello", response);
      setSiswaByKelas(response);
      setFilterData(response);
      console.log("kelas", response);
    } catch (error) {}
  };

  useEffect(() => {
    getDataKelasById();
    dataGuru();
    getDataSiswaByKelas();
    const timeout = setTimeout(() => {
      setColumns([
        {
          name: "Nama Lengkap",
          selector: (row) => row.nama,
          sortable: true,
        },
        {
          name: "No. Induk",
          selector: (row) => row.nis,
          sortable: true,
        },

        {
          name: "Action",
          selector: (row) => (
            <div className="flex flex-row gap-2">
              <DeleteDataSiswaHistory id={row.id} getDataSiswaByKelas={getDataSiswaByKelas} />
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
    getDataSiswaByKelas();
    const result = siswaByKelas.filter((item) => {
      return (
        item.nama.toLowerCase().match(search.toLowerCase()) ||
        item.nis.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  return (
    <Main>
      <div className="grid grid-cols-6 bg-slate-100">
        <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
          <div className="flex justify-start py-4">
            <h4 className="font-bold text-xl text-slate-500">
              Data Kelas {kelas.kelas}|{kelas.jurusan}
            </h4>
          </div>

          <ShowDataSiswa kelasId={id} />
          <div className="flex flex-col md:flex-row gap-12 pt-8 h-auto">
            <div className="w-full md:w-2/6">
              <div className="rounded-md shadow-md p-10 bg-white flex flex-col gap-5">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-xl font-bold text-slate-500 text-center">
                    Wali Kelas
                  </h1>
                  <p className="text-center text-sm font-semibold text-slate-500">
                    {kelas.kelas}|{kelas.jurusan}
                  </p>
                </div>
                <div className="flex flex-col text-center justify-center items-center">
                  <div className="w-36 h-36 rounded-full shadow-md border-2 border-slate-600 items-center overflow-hidden">
                    <img
                      src={repoimages + guru.image_profile}
                      alt="profile"
                      className="w-36 h-36 rounded-full shadow-md"
                    />
                  </div>
                  <h1 className="text-base font-bold text-slate-500 text-center">
                    {guru.nama}
                  </h1>
                  <h4 className="text-sm font-thin text-slate-500 text-center">
                    {guru.nip}
                  </h4>
                  <div className="flex flex-row">
                    <p>{}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/5">
              <div className="rounded-md shadow-md p-10 bg-white flex flex-col gap-5">
                <DataTable
                  columns={columns}
                  data={filterData}
                  progressPending={pendingData}
                  pagination
                  selectableRowsHighlight
                  highlightOnHover
                  subHeader
                  subHeaderComponent={
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex flex-row w-1/8 relative">
                        <input
                          type="text"
                          className="rounded-md pr-2 pl-8 py-1 border border-sky-500 outline-none"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Enter search....."
                        />
                        <div className="absolute top-2 left-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 text-sky-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-end pb-2">
                        <RefreshDataSiswaByKelas
                          getDataSiswaByKelas={getDataSiswaByKelas}
                        />
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default KelasById;
