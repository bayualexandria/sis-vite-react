import React, { useState, useEffect } from "react";
import Main from "../components/Main/Main";
import { Link } from "react-router-dom";
import api from "../utils/repositories";
import Semester from "./semester/Semester";

function Home() {
  const [guru, setGuru] = useState("");
  const [siswa, setSiswa] = useState("");
  const [loadData, setLoadData] = useState(false);

  const dataGuru = async () => {
    setLoadData(true);
    try {
      let response = await api.get("guru/");
      if (response.status == 200) {
        setLoadData(false);
        setGuru(response.data.data.length);
      }
    } catch (error) {
      console.log("guru", error);
    }
  };

  const dataSiswa = async () => {
    setLoadData(true);
    try {
      let response = await api.get("siswa/");
      if (response.status == 200) {
        setLoadData(false);
        setSiswa(response.data.data.length);
      }
    } catch (error) {
      console.log("error siswa", error);
    }
  };

  useEffect(() => {
    dataGuru();
    dataSiswa();
  }, []);

  return (
    <Main>
      <div className="grid grid-cols-6 bg-slate-100">
        <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
          <div className="flex justify-start pb-4">
            <h4 className="font-bold text-base text-slate-500">Dashboard</h4>
          </div>

          <div className="flex flex-col gap-y-10">
            <div className="grid gap-5 grid-col-1 md:grid-cols-2 lg:grid-cols-4">
              <Link
                to="/guru"
                className="p-5 transition duration-300 bg-white rounded-lg shadow-lg group ring-1 ring-slate-900/5 hover:bg-orange-500 hover:ring-orange-500"
              >
                <div className="flex items-center gap-x-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-orange-500 group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-white">
                    Guru
                  </h3>
                </div>
                {loadData ? (
                  <div className="w-full justify-center items-center flex flex-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 animate-spin text-slate-500 font-bold"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex justify-center pt-1">
                    <p className="text-xl font-bold text-slate-500 group-hover:text-white">
                      {guru}
                    </p>
                  </div>
                )}
              </Link>

              <Link
                to="/siswa"
                className="p-6 transition duration-300 bg-white rounded-lg shadow-lg group ring-1 ring-slate-900/5 hover:bg-lime-500 hover:ring-lime-500"
              >
                <div className="flex items-center gap-x-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-lime-500 group-hover:text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-white">
                    Siswa
                  </h3>
                </div>
                {loadData ? (
                  <div className="w-full justify-center items-center flex flex-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 animate-spin text-slate-500 font-bold"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex justify-center pt-1">
                    <p className="text-xl font-bold text-slate-500 group-hover:text-white">
                      {siswa}
                    </p>
                  </div>
                )}
              </Link>

              <Link className="p-6 transition duration-300 bg-white rounded-lg shadow-lg group ring-1 ring-slate-900/5 hover:bg-indigo-500 hover:ring-indigo-500">
                <div className="flex items-center gap-x-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-indigo-500 group-hover:text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-white">
                    Mapel Pelajaran
                  </h3>
                </div>
                <div className="flex justify-center pt-1">
                  <p className="text-xl font-bold text-slate-500 group-hover:text-white">
                    8
                  </p>
                </div>
              </Link>
              <Link className="p-6 transition duration-300 bg-white rounded-lg shadow-lg group ring-1 ring-slate-900/5 hover:bg-rose-500 hover:ring-rose-500">
                <div className="flex items-center gap-x-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-rose-500 group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-white">
                    Jadwal
                  </h3>
                </div>
                <div className="flex justify-center pt-1">
                  <p className="text-xl font-bold text-slate-500 group-hover:text-white">
                    8
                  </p>
                </div>
              </Link>
            </div>
            <Semester />
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Home;
