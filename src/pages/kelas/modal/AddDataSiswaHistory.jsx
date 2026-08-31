import React, { useState } from "react";
import Cookies from "js-cookie";
import repositori from "../../../utils/repositories";

function AddDataSiswaHistory({ siswaId, kelasId, getDataSiswa }) {
  const [btnAdd, setBtnAdd] = useState(false);
  const dataToken = Cookies.get("authentication");
  const token = dataToken.split(",");
  const data = {
    siswa_id: siswaId,
    kelas_id: kelasId,
  };

  const insertHistorySiswa = async () => {
    setBtnAdd(!btnAdd);
    try {
      let response = await fetch(`${repositori}siswa/kelas`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
      }).then((res) => res.json());
      console.log("data", data);
      console.log("siswa hello", response);
      setTimeout(() => {
        getDataSiswa();
      }, 0.1);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      {btnAdd ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5 text-lime-500 animate-pulse"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
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
