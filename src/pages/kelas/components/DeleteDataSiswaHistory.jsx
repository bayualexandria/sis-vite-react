import React, { useState } from "react";
import repositori from "../../../utils/repositories";
import Cookies from "js-cookie";

function DeleteDataSiswaHistory({ id, getDataSiswaByKelas }) {
  const [btnDelete, setBtnDelete] = useState(false);

  const deleteDataSiswaHistory = async () => {
    setBtnDelete(!btnDelete);
    const data = Cookies.get("authentication");
    const token = data.split(",");
    try {
      let response = await fetch(`${repositori}siswa/kelas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0],
        },
      }).then((res) => res.json());
      console.log("delete siswa history", response);
      getDataSiswaByKelas();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {btnDelete ? (
        <p className="text-sm text-lime-500 font-thin animate-pulse">success</p>
      ) : (
        <div
          className="w-6 h-6 rounded-full flex justify-center items-center border border-rose-500 bg-white hover:text-white text-rose-500 hover:bg-rose-500 transition duration-200  cursor-pointer outline-none p-1"
          onClick={deleteDataSiswaHistory}
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
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </div>
      )}
    </>
  );
}

export default DeleteDataSiswaHistory;
