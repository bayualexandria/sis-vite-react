import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../../utils/repositories";

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
  p: 3,
  outlinne: "none",
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

function StatusById({ row, dataGuru }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const updateStatus = async (e) => {
    e.preventDefault();
    const data = { status };

    try {
      let response = await api
        .post(`guru/${row.nip}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
      console.log(response);
      if (response.status === 200) {
        templateModalSuccess.fire({
          icon: "success",
          title: "Status berhasil diubah",
        });
        handleClose();
        dataGuru();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <div
        className="flex flex-row justify-center cursor-pointer"
        onClick={handleOpen}
      >
        <span
          className={`${
            row.status_user_name === "Admin"
              ? "bg-blue-500"
              : row.status_user_name === "Wali Kelas"
                ? "bg-orange-500"
                : "bg-lime-500"
          } rounded-full px-2 py-1 text-white border shadow-md flex justify-center items-center text-xs`}
        >
          {row.status_user_name}
        </span>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="modal-modal-title" className="font-bold text-xl">
            Status Guru
          </h2>
          <div className="flex flex-col pb-5">
            <label className="text-sm mt-4 mb-1">Status</label>
            <select
              className="border border-sky-500 rounded-md outline-none px-2 py-1"
              id="status"
              onChange={(e) => setStatus(e.target.value)}
              defaultValue={row.status}
            >
              <option value="1">Admin</option>
              <option value="2">Wali Kelas</option>
              <option value="3">Guru</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-sky-500 text-white px-2 py-1 text-base font-thin rounded-md"
              onClick={updateStatus}
            >
              Simpan
            </button>
            <button
              className="bg-rose-500 text-white px-4 py-2 rounded-md ml-2"
              onClick={handleClose}
            >
              Batal
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default StatusById;
