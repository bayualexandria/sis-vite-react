import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../../utils/repositories";

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

function StatusUserVerified({ row, dataGuru }) {
  const updateEmailVerifiedAtToNull = async () => {
    
    try {
      let response = await api
        .get(`user/${row.nip}/update-email-verified`)
        .then((res) => res.data);
      if (response.status === 200) {
        templateModalSuccess.fire({
          icon: "warning",
          title: "Email tidak terverifikasi",
        });
        dataGuru();
      }
    } catch (error) {
      return error;
    }
  };

  const updateEmailVerifiedAt = async () => {
    
    try {
      let response = await api
        .get(`user/${row.nip}/update-email-verified-at`)
        .then((res) => res.data);
      if (response.status === 200) {
        templateModalSuccess.fire({
          icon: "success",
          title: "Email terverifikasi",
        });
        dataGuru();
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <div className="flex flex-row justify-center">
        {row.email_verified_at != null ? (
          <span
            className={`text-green-500 px-2 py-1 flex flex-row items-center cursor-pointer`}
            onClick={updateEmailVerifiedAtToNull}
          >
            <div className="w-4 h-4 rounded-full shadow-md bg-green-500 border border-green-500 flex justify-center items-center mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            Terferifikasi
          </span>
        ) : (
          <span
            className={`text-red-500 px-2 py-1 flex flex-row items-center cursor-pointer`}
            onClick={updateEmailVerifiedAt}
          >
            <div className="w-4 h-4 rounded-full shadow-md bg-red-500 border border-red-500 flex justify-center items-center mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            Tidak Terferifikasi
          </span>
        )}
      </div>
    </>
  );
}

export default StatusUserVerified;
