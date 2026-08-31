import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import repositori from "../../utils/repositories";
import axios from "axios";
import DeleteSemesterById from "./DeleteSemesterById";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import api from "../../utils/repositories";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #FFF",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

function Semester() {
  const [columns, setColumns] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [semester, setSemester] = useState([]);

  // Data Semester
  const [nSemester, setNSemester] = useState("");
  const [nYears, setNYears] = useState("");

  const currentYear = new Date().getFullYear(); // Get the current year
  const startYear = 2020; // Set a start year
  const years = []; // Initialize an empty array to store years

  // Loop through years from startYear to currentYear
  for (let year = startYear; year <= currentYear; year++) {
    years.sort().push(year + 1); // Add each year to the array
  }

  // Get data Semester
  const dataSemester = async () => {
    try {
      let response = await api.get("semester").then((res) => res.data.data);
      setFilter(response.data);
      setSemester(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Insert data Semester
  const addSemester = async (e) => {
    setLoading(true);
    e.preventDefault();
    const dataInput = {
      semester: nSemester,
      tahun_pelajaran: nYears,
    };
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
    try {
      let response = await api.post(`semester`, dataInput, {
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 403) {
        setLoading(false);
        setError(response.message);
      }
      if (response.status === 200) {
        setTimeout(async () => {
          setLoading(false);
          await templateModalSuccess.fire({
            icon: "success",
            title: "Data berhasil dihapus",
          });
          setTimeout(() => (window.location.href = "/"), 1000);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dataSemester();
    const timeout = setTimeout(() => {
      setColumns([
        {
          name: "Semester",
          selector: (row) => row.semester,
          sortable: true,
        },
        {
          name: "Tahun Pelajaran",
          selector: (row) => row.tahun_pelajaran,
          sortable: true,
        },

        {
          name: "Action",
          selector: (row) => (
            <div className="flex flex-row gap-x-3">
              <DeleteSemesterById id={row.id} />
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
    const result = semester.filter((item) => {
      return (
        item.semester.toLowerCase().match(search.toLowerCase()) ||
        item.tahun_pelajaran.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilter(result);
  }, [search]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
      <div className="flex flex-col p-5 bg-white rounded-md shadow-md">
        <div className="flex flex-col items-center justify-between py-5 md:flex-row">
          <h6 className="text-xl font-bold text-slate-500">
            Data tahun ajaran
          </h6>
          <button
            onClick={handleOpen}
            data-bs-toggle="modal"
            data-bs-target="#add"
            id="addBtnModal"
            className="px-2 py-1 text-sm font-bold text-white transition duration-200 rounded-md shadow-md bg-cyan-500 hover:text-cyan-500 hover:bg-white hover:ring hover:ring-cyan-200"
          >
            Tambah data
          </button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="w-full overflow-hidden overflow-y-auto border rounded-lg boder-slate-300 ">
              <div className="absolute top-1 right-1">
                <button
                  className="outline-none w-5 h-5 border border-slate-300 flex justify-center items-center rounded-full text-slate-500 transition duration-200 hover:border-slate-500 hover:bg-white"
                  onClick={handleClose}
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
              <div className="flex flex-col w-full p-3">
                <form
                  className="flex flex-col w-full gap-y-5"
                  onSubmit={addSemester}
                >
                  <div className="flex flex-col gap-y-3 relative">
                    <label
                      htmlFor="password"
                      className="font-bold text-base text-slate-500"
                    >
                      Semester
                    </label>

                    <input
                      type="text"
                      name="semester"
                      id="semester"
                      onChange={(e) => setNSemester(e.target.value)}
                      className="border-sky-500 border  rounded-md shadow-md p-2 text-base outline-none"
                    />
                    {error.semester ? (
                      <p className="text-xs text-rose-500 font-thin">
                        {error.semester}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-col gap-y-3 relative">
                    <label
                      htmlFor="password"
                      className="font-bold text-base text-slate-500"
                    >
                      Tahun Pelajaran
                    </label>

                    <select
                      className="border-sky-500 border  rounded-md shadow-md p-2 text-base outline-none"
                      name="years"
                      id="years"
                      onChange={(e) => setNYears(e.target.value)}
                    >
                      {years.map((year) => (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {error.tahun_pelajaran ? (
                      <p className="text-xs text-rose-500 font-thin">
                        {error.tahun_pelajaran}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-row justify-end">
                    <button
                      type="submit"
                      className="rounded-full outline-none border border-primary shadow-md py-1 px-6 text-sm font-bold text-white bg-primary hover:bg-white hover:text-primary transition duration-200"
                    >
                      {loading ? (
                        <div className="flex flex-row justify-center items-center gap-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 animate-spin"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                          </svg>
                          Loading...
                        </div>
                      ) : (
                        "Simpan"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Box>
        </Modal>
        <div className="w-full overflow-hidden overflow-x-scroll border rounded-lg boder-slate-300 md:overflow-hidden">
          <DataTable
            data={filter}
            columns={columns}
            progressPending={pending}
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
                </div>
                <div className="flex flex-row gap-x-3">
                  <div className="rounded-md p-1 flex flex-row justify-center items-center font-bold border border-lime-500 text-sm gap-x-1 hover:bg-white hover:text-lime-500 cursor-pointer bg-lime-500 text-white transition duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <p>Excel</p>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Semester;
