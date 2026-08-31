import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import repositori from "../../../utils/repositories";
import AddDataSiswaHistory from "./AddDataSiswaHistory";
import RefreshDataSiswa from "./RefreshDataSiswa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "-48%",
    transform: "translate(-50%, -50%)",
  },
};

function ShowDataSiswa({ kelasId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [pendingData, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const dataToken = Cookies.get("authentication");
  const token = dataToken.split(",");
  const [siswa, setSiswa] = useState([]);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const getDataSiswa = async () => {
    try {
      let response = await fetch(`${repositori}siswa/search`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
      })
        .then((res) => res.json())
        .then((res) => res.data);
      // console.log("siswa hello", response);
      setSiswa(response);
      setFilterData(response);
    } catch (error) {}
  };

  useEffect(() => {
    getDataSiswa();
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
            <AddDataSiswaHistory
              kelasId={kelasId}
              siswaId={row.id}
              getDataSiswa={getDataSiswa}
             
            />
          ),
          sortable: true,
        },
      ]);
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const result = siswa.filter((item) => {
      return (
        item.nama.toLowerCase().match(search.toLowerCase()) ||
        item.nis.toLowerCase().match(search.toLowerCase()) ||
        item.no_hp.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);
  return (
    <>
      <div className="w-full md:w-[35%] relative" onClick={openModal}>
        <input
          type="text"
          className="w-full rounded-full shadow-md px-4 py-2 outline-none border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          placeholder="Search Siswa"
        />
        <div className="absolute top-0.5 right-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 *:h-6 absolute top-2 left-2 text-slate-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div className="w-full overflow-hidden overflow-y-auto border rounded-lg boder-slate-300 ">
          <div className="absolute top-1 right-1">
            <button
              className="outline-none w-5 h-5 border border-slate-300 flex justify-center items-center rounded-full text-slate-500 transition duration-200 hover:border-slate-500 hover:bg-white"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-3 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

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
                <RefreshDataSiswa getDataSiswa={getDataSiswa} />
              </div>
            }
          />
        </div>
      </Modal>
    </>
  );
}

export default ShowDataSiswa;
