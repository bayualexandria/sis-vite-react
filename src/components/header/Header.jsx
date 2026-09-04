import { useState, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../utils/repositories";
import repoimages from "../../utils/repoimages";
import ChangePassword from "../../pages/profile/ChangePassword";

const templateModal = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-2 py-0.5 cursor-pointer",
    cancelButton:
      "bg-rose-500  font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-2 py-0.5 cursor-pointer",
  },
  buttonsStyling: false,
});
const templateModalNotif = withReactContent(Swal).mixin({
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

function Header() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [dataUser, setDataUser] = useState([]);

  const showUser = useCallback(async () => {
    const dataUserStorage = localStorage.getItem("username");

    if (!dataUserStorage) {
      return;
    }

    let username;

    try {
      username = JSON.parse(dataUserStorage);
    } catch {
      username = dataUserStorage;
    }

    try {
      const response = await api.get(`user/${username}/guru`);
      const data = response?.data?.data;

      setDataUser(data);
    } catch (error) {
      if (
        error?.message === "Failed to fetch" ||
        error?.code === "ERR_NETWORK" ||
        error?.response?.status === 401
      ) {
        templateModalNotif.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
        localStorage.removeItem("username");
        localStorage.removeItem("id_user");
        localStorage.removeItem("is_logged_in");
        await api.delete(`access-token/${username}`);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    }
  }, []);

  useEffect(() => {
    showUser();
  }, [showUser]);

  const popUpLogoutButton = async () => {
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
          await api.post("/logout-admin");
          setUser(localStorage.removeItem("username"));
          localStorage.removeItem("username");
          localStorage.removeItem("id_user");
          localStorage.removeItem("is_logged_in");
          return <Navigate to="/login" replace={true} />;
        }
        return true;
      });
  };

  const showMenu = () => {
    setShow(!show);
  };

  return (
    <div className="container py-4">
      {user == null && <Navigate to="/login" replace={true} />}

      <ul className="flex justify-end md:gap-56 w-full">
        <li className="flex items-center justify-between gap-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-7 md:h-7 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-7 md:h-7 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          <div
            className="flex items-center gap-x-1 cursor-pointer"
            onClick={showMenu}
          >
            {dataUser.status_id === 2 ||
            dataUser.status_id === 1 ||
            dataUser.status_id === 3 ? (
              <div className="w-9 h-9 rounded-full shadow-md  p-2 flex justify-center items-center border border-slate-200 overflow-hidden">
                <img
                  src={repoimages + dataUser.image_profile}
                  alt="profile"
                  className="w-full"
                />
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 md:w-7 md:h-7 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}

            <h5 className="hidden text-slate-500 md:block text-sm">
              {dataUser ? dataUser.name : ""}
            </h5>
          </div>
          <div
            className={`${
              show ? "block" : "hidden"
            } absolute right-3 top-16 md:top-16`}
          >
            <div className="flex flex-col rounded-md shadow-md px-5 py-3 bg-slate-50 gap-y-3">
              <ChangePassword />
              {dataUser ? (
                <Link
                  to="/profile"
                  className="flex flex-row justify-between items-center gap-x-3 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-slate-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>

                  <p className="text-sm text-slate-500">Profile</p>
                </Link>
              ) : (
                ""
              )}

              <div
                className="flex flex-row justify-between items-center gap-x-3 cursor-pointer"
                onClick={popUpLogoutButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>

                <p className="text-sm text-slate-500">Logout</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Header;
