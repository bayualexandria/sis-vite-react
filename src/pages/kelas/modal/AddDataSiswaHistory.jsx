import { useState } from "react";
import api from "../../../utils/repositories";

function AddDataSiswaHistory({ siswaId, kelasId, waliKelasId, getDataSiswa }) {
  const [btnAdd, setBtnAdd] = useState(false);
  const formData = new FormData();
  formData.append("siswa_id", siswaId);
  formData.append("kelas_id", kelasId);
  formData.append("wali_kelas_id", waliKelasId);

  const insertHistorySiswa = async () => {
    setBtnAdd(!btnAdd);
    try {
      let response = await api.post(`siswa-kelas/`, formData);
      console.log("data", formData);
      console.log("siswa hello", response);
      setTimeout(() => {
        getDataSiswa();
      }, 0.1);
    } catch (error) {
      console.log("error", error.response);
    }
  };
  return (
    <>
      {btnAdd ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 text-lime-500 animate-pulse"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      ) : (
        <div
          className="w-5 h-5 rounded-full flex justify-center items-center border border-lime-500 bg-white hover:text-white text-lime-500 hover:bg-lime-500 transition duration-200  cursor-pointer outline-none"
          onClick={insertHistorySiswa}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      )}
    </>
  );
}

export default AddDataSiswaHistory;
