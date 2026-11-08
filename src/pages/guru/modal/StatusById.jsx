import { useState } from "react";
import { Box, Modal } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../../utils/repositories";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  boxShadow:
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  borderRadius: "1rem", // rounded-2xl
  p: 4,
  outline: "none",
};

const templateModalSuccess = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-semibold text-white outline-none border border-sky-500 rounded-lg ml-2 px-3 py-1.5 cursor-pointer shadow-sm hover:bg-sky-600 transition",
    cancelButton:
      "bg-rose-500 font-semibold text-white outline-none border border-rose-500 rounded-lg mr-2 px-3 py-1.5 cursor-pointer shadow-sm hover:bg-rose-600 transition",
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    // Set status awal sesuai dengan row saat modal dibuka
    setStatus(row.status_id || "");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const updateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { status_id: status };

    try {
      let response = await api
        .patch(`guru/${row.nip}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);

      if (response.status === 200) {
        templateModalSuccess.fire({
          icon: "success",
          title: "Status berhasil diubah",
        });
        handleClose();
        dataGuru();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat mengubah status.",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menentukan badge warna status yang lebih soft & profesional
  const getBadgeStyle = (statusName) => {
    switch (statusName) {
      case "Admin":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "Wali Kelas":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    }
  };

  return (
    <>
      {/* Badge Status di Tabel */}
      <div className="flex flex-row justify-center">
        <button
          onClick={handleOpen}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition shadow-xs cursor-pointer flex items-center gap-1.5 ${getBadgeStyle(
            row.status_user_name,
          )}`}
          title="Klik untuk mengubah status"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {row.status_user_name}
        </button>
      </div>

      {/* Modal Edit Status */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div>
              <h2
                id="modal-modal-title"
                className="font-semibold text-lg text-gray-800"
              >
                Ubah Status Guru
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {row.nama} ({row.nip})
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition p-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={updateStatus}>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="status"
                className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2"
              >
                Hak Akses / Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg outline-none px-3 py-2.5 text-sm text-gray-700 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="" disabled>
                  Pilih Status
                </option>
                <option value="1">Admin</option>
                <option value="2">Wali Kelas</option>
                <option value="3">Guru</option>
              </select>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                onClick={handleClose}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default StatusById;
