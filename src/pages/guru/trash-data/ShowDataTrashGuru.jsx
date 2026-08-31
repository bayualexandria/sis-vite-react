import { useState, useEffect } from "react";
import Modal from "react-modal";
import Cookies from "js-cookie";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import repositori from "../../../utils/repositories";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "-48%",
    transform: "translate(-50%, -50%)",
  },
};

const templateModal = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-2 py-0.5 cursor-pointer",
    cancelButton:
      "bg-rose-500  font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-2 py-0.5 cursor-pointer",
  },
  buttonsStyling: false,
});
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

function ShowDataTrashGuru() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataTrash, setDataTrash] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterTrash, setFilterTrash] = useState([]);
  const [pendingTrash, setPendingTrash] = useState(true);
  const [searchTrash, setSearchTrash] = useState("");

  const getDataTrashGuru = async () => {
    const dataToken = Cookies.get("authentication");
    const token = dataToken.split(",");
    try {
      const response = await axios
        .get(`${repositori}guru/data-trash`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token[0],
          },
        })
        .then((res) => res.data);
      setFilterTrash(response.data);
      setDataTrash(response.data);
    } catch (error) {
      return error;
    }
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const restoreDataAll = async () => {
    await templateModal
      .fire({
        title: "Restore all data guru",
        text: "Apakah anda ingin restore semua data guru!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        reverseButtons: true,
      })
      .then(async (result) => {
        try {
          if (result.isConfirmed) {
            await templateModalSuccess.fire({
              icon: "success",
              title: "Data berhasil di restore",
            });
            const dataToken = Cookies.get("authentication");
            const token = dataToken.split(",");
            try {
               await axios
                .get(`${repositori}guru/restore`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token[0],
                  },
                })
                .then((res) => res.data);
              setTimeout(() => {
                return (window.location.href = "/guru");
              }, 500);
            } catch (error) {
              return error;
            }
          }
        } catch (e) {
          return e;
        }
        return true;
      });
  };

  const deletePermanen = async () => {
    await templateModal
      .fire({
        title: "Delete all data guru",
        text: "Apakah anda ingin hapus semua data guru!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        reverseButtons: true,
      })
      .then(async (result) => {
        try {
          if (result.isConfirmed) {
            await templateModalSuccess.fire({
              icon: "success",
              title: "Data berhasil di hapus secara permanen",
            });
            const dataToken = Cookies.get("authentication");
            const token = dataToken.split(",");
            try {
               await fetch(
                `${repositori}guru/delete-permanent`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token[0],
                  },
                },
              );
              setTimeout(() => {
                return (window.location.href = "/guru");
              }, 500);
            } catch (error) {
              return error;
            }
          }
        } catch (e) {
          return e;
        }
        return true;
      });
  };

  useEffect(() => {
    getDataTrashGuru();
    const timeout = setTimeout(() => {
      setColumns([
        {
          name: "Nama Lengkap",
          selector: (row) => row.nama,
          sortable: true,
        },
        {
          name: "NIP",
          selector: (row) => row.nip,
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
          name: "Action",
          selector: (row) => (
            <div className="flex flex-row gap-x-3">
              {/* <RestoreDataGuruById nis={row.nis} /> */}
              {/* <DeleteDataPemanentById nis={row.nis} /> */}
            </div>
          ),
          sortable: true,
        },
      ]);
      setPendingTrash(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const result = dataTrash.filter((item) => {
      return (
        item.nama.toLowerCase().match(searchTrash.toLowerCase()) ||
        item.nip.toLowerCase().match(searchTrash.toLowerCase()) ||
        item.jenis_kelamin.toLowerCase().match(searchTrash.toLowerCase()) ||
        item.no_hp.toLowerCase().match(searchTrash.toLowerCase())
      );
    });
    setFilterTrash(result);
  }, [searchTrash]);

  return (
    <>
      <div className="cursor-pointer outline-none" onClick={openModal}>
        <div className="rounded-md px-1 py-1 shadow-md flex flex-row justify-center items-center border border-rose-500 hover:text-rose-500 text-white bg-rose-500 hover:bg-white transition duration-200 gap-x-1">
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
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          <p className="font-bold text-sm">Data trash</p>
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
            data={filterTrash}
            progressPending={pendingTrash}
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
                    value={searchTrash}
                    onChange={(e) => setSearchTrash(e.target.value)}
                    placeholder="Enter searchTrash....."
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
                <div className="flex flex-row">
                  {dataTrash === "" ? (
                    ""
                  ) : (
                    <div className="flex flex-row gap-x-2">
                      <div
                        className="rounded-md p-1 flex flex-row justify-center items-center font-bold border border-sky-500 text-sm gap-x-1 hover:bg-white hover:text-sky-500 cursor-pointer bg-sky-500 text-white transition duration-200"
                        onClick={restoreDataAll}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>

                        <p>Restore all</p>
                      </div>
                      <div
                        className="rounded-md p-1 flex flex-row justify-center items-center font-bold border border-rose-500 text-sm gap-x-1 hover:bg-white hover:text-rose-500 cursor-pointer bg-rose-500 text-white transition duration-200"
                        onClick={deletePermanen}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>

                        <p>Delete permanent all</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </div>
      </Modal>
    </>
  );
}

export default ShowDataTrashGuru;
