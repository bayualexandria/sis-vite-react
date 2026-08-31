import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../utils/repositories";

function PopUpLogout() {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const popUpLogoutButton = async () => {
    const templateModal = withReactContent(Swal).mixin({
      customClass: {
        confirmButton:
          "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-2 py-0.5 cursor-pointer",
        cancelButton:
          "bg-rose-500  font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-2 py-0.5 cursor-pointer",
      },
      buttonsStyling: false,
    });
    await templateModal
      .fire({
        title: "Logout",
        text: "Apakah anda ingin keluar dari sistem ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await api.post(
            `/logout-admin`,
            {},
            {
              withCredentials: true,
            },
          );
          setUser(localStorage.removeItem("username"));
          localStorage.removeItem("id_user");
          localStorage.removeItem("is_logged_in");
          return <Navigate to="/login" replace={true} />;
        }
        return true;
      });
  };
  return (
    <>
      {user == null && <Navigate to="/login" replace={true} />}
      <button
        className="flex items-center gap-3 hover:text-slate-300 cursor-pointer"
        onClick={popUpLogoutButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <p className="hidden md:block text-sm">Logout</p>
      </button>
    </>
  );
}

export default PopUpLogout;
