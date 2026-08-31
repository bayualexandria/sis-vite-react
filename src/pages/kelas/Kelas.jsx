import React, { useState, useEffect } from "react";
import Main from "../../components/Main/Main";
import repositori from "../../utils/repositories";
import Cookies from "js-cookie";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import DeleteKelasById from "./DeleteKelasById";
import UpdateKelasById from "./UpdateKelasById";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import AddDataKelas from "./AddDataKelas";

const templateModalSuccess = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-2 py-0.5 cursor-pointer",
    cancelButton:
      "bg-rose-500  font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-2 py-0.5 cursor-pointer",
  },
  buttonsStyling: false,
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

function Kelas() {
  const [kelasHistory, setKelasHistory] = useState([]);
  const dataToken = Cookies.get("authentication");
  const token = dataToken.split(",");
  const [user, setUser] = useState([]);
  const [datakelasGuru, setDataKelasGuru] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState([]);

  // useState data input kelas

  const [loadData, setLoadData] = useState(false);


  // Get data kelas
  const getKelasHistory = async () => {
    setLoadData(true);
    try {
      let response = await fetch(`${repositori}kelas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
      }).then((res) => res.json());
      // console.log(response);
      if (response.status == 200) {
        setLoadData(false);
        setKelasHistory(response.data);
        setFilter(response.data);
        console.log(response.data);
      }
    } catch (e) {
      if (e.message === "Failed to fetch") {
        return templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  const getDataKelasByGuru = async () => {
    try {
      let response = await fetch(`${repositori}kelas/guru/${token[1]}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
        method: "GET",
      }).then((res) => res.json());
      setDataKelasGuru(response.data);
      // console.log("kelas guru", response);
    } catch (e) {
      if (e.message === "Failed to fetch") {
        return templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  const getUserById = async () => {
    try {
      let response = await fetch(`${repositori}user/${token[1]}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
        method: "GET",
      }).then((res) => res.json());
      setUser(response.data);
      // console.log("first", response.data);
    } catch (e) {
      if (e.message === "Failed to fetch") {
        return templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  useEffect(() => {
    getKelasHistory();
    const timeout = setTimeout(() => {
      setColumns([
        {
          name: "Kelas",
          selector: (row) => (
            <p>
              {row.kelas} | {row.jurusan}
            </p>
          ),
          sortable: true,
        },
        {
          name: "#      ",
          selector: (row) => (
            <Link to={`${row.no_induk_guru}/${row.id}`} key={row.id}>
              <div>
                {row.jurusan === "Teknik Komputer & Jaringan" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                    />
                  </svg>
                ) : row.jurusan === "Akuntansi" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
                    />
                  </svg>
                ) : row.jurusan === "Pemasaran" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                )}
              </div>
            </Link>
          ),
          sortable: true,
        },
        {
          name: "Wali Kelas",
          selector: (row) => (
            <div className="flex flex-row gap-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 text-sky-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              {row.wali_kelas}
            </div>
          ),
          sortable: true,
        },
        {
          name: "Semester",
          selector: (row) => (
            <p>
              {row.semester == "I" ? "Ganjil" : "Genap"} - {row.tahun_pelajaran}
            </p>
          ),
          sortable: true,
        },

        {
          name: "",
          selector: (row) => (
            <div className="flex flex-row gap-x-1">
              <UpdateKelasById id={row.id} />

              <DeleteKelasById id={row.id} getKelasHistory={getKelasHistory} />
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
    const result = kelasHistory.filter((item) => {
      return (
        item.jurusan.toLowerCase().match(search.toLowerCase()) ||
        item.kelas.toLowerCase().match(search.toLowerCase()) ||
        item.semester.toLowerCase().match(search.toLowerCase()) ||
        item.tahun_pelajaran.toLowerCase().match(search.toLowerCase()) ||
        item.wali_kelas.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilter(result);
  }, [search]);

  useEffect(() => {
    filter.length > 0 ? setLoadData(false) : setLoadData(true);

    getKelasHistory();
    getUserById();
    getDataKelasByGuru();
  }, []);

  return (
    <Main>
      <div className="grid grid-cols-6 bg-slate-100">
        <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
          <div className="flex justify-start py-4">
            <h4 className="font-bold text-xl text-slate-500">Ruang Kelas</h4>
          </div>

          {loadData ? (
            <div className="w-full justify-center items-center flex flex-col">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <p>Loading....</p>
            </div>
          ) : (
            <div>
              {user.status_id == 2 ? (
                datakelasGuru.map((k) => {
                  return (
                    <div className="w-full gap-3  grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                      <div
                        key={k.id}
                        className="w-full rounded-md shadow-md bg-white p-3"
                      >
                        <div className="flex flex-col gap-y-1">
                          <Link to={`${k.no_induk_guru}/${k.id}`} key={k.id}>
                            <div className="flex flex-row w-full gap-x-1">
                              <div className=" w-1/2">
                                {k.jurusan === "Teknik Komputer & Jaringan" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-20 text-red-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                                    />
                                  </svg>
                                ) : k.jurusan === "Akuntansi" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-20 text-yellow-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
                                    />
                                  </svg>
                                ) : k.jurusan === "Pemasaran" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-20 text-green-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-20 text-blue-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="flex flex-col text-left w-1/2 justify-center">
                                <h1 className="text-base font-bold text-slate-500">
                                  {k.kelas}
                                </h1>
                                <p className="text-[12px] text-think text-black">
                                  {k.jurusan}
                                </p>
                                <p className="font-bold text-[11px] text-slate-500">
                                  {k.semester}/{k.tahun_pelajaran}
                                </p>
                              </div>
                            </div>
                          </Link>
                          <div className="flex flex-col w-full">
                            <p className="text-slate-700 font-bold text-xs">
                              Wali Kelas
                            </p>
                            <div className="flex flex-row items-center justify-between">
                              <div className="flex flex-row gap-x-1 items-center ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="size-5 text-sky-500"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                                <p className="text-[10px] text-justify">
                                  {k.wali_kelas}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-5 transition duration-300 bg-white rounded-lg shadow-md ">
                  <DataTable
                    data={filter}
                    columns={columns}
                    progressPending={pending}
                    pagination
                    selectableRowsHighlight
                    highlightOnHover
                    subHeader
                    actions={
                      user.status_id == 1 ? (
                        <div className="flex justify-end pb-2">
                          <AddDataKelas getKelasHistory={getKelasHistory} />
                        </div>
                      ) : (
                        ""
                      )
                    }
                    subHeaderComponent={
                      <div className="w-full flex flex-row justify-between items-center">
                        <div className="flex flex-row w-1/8 relative">
                          <form>
                            <input
                              type="text"
                              className="rounded-md pr-2 pl-8 py-1 border border-sky-500 outline-none"
                              value={search || ""}
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
                          </form>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-x-5">
                          {}
                        </div>
                      </div>
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
}

export default Kelas;
