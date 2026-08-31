import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PopUpLogout from "../popup/PopUpLogout";
import repo from "../../utils/repo";
import api from "../../utils/repositories";
import logo from "../../assets/images/logo-pendidikan.png"

function Sidebar() {
  const [show, setShow] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const showUser = async () => {
    const dataUser = localStorage.getItem("username");
    const username = JSON.parse(dataUser);
    try {
      let response = await api
        .get(`user/${username}/guru`)
        .then((res) => res.data.data);
      setDataUser(response["status_id"]);
    } catch (error) {}
  };

  useEffect(() => {
    showUser();
  });

  const showMenu = () => {
    setShow(!show);
  };

  return (
    <div className="fixed top-0 left-0 w-1/6 h-screen border-r drop-shadow-md bg-primary">
      <div className="px-3 py-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 flex justify-center items-center rounded-full bg-white p-2 shadow-lg">
            <img
              src={logo}
              alt="logo"
              className="w-full"
            />
          </div>
        </div>
        <ul className="flex flex-col justify-center mt-5 text-sm text-white md:px-1 gap-y-4 md:gap-x-4">
          <li className="flex justify-center w-full md:justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:text-slate-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <p className="hidden md:block text-sm">Home</p>
            </Link>
          </li>
          {dataUser === 1 ? (
            <li className="transition duration-300 hover:stroke-2 ">
              <div
                onClick={showMenu}
                className="flex flex-col items-center justify-center cursor-pointer md:justify-between hover:text-slate-300  md:flex-row"
                id="master-data"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                  <p className="hidden md:block text-sm">Master Data</p>
                </div>
                <button className="transition duration-300 ease-in-out bg-transparent outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      show ? "rotate-90" : ""
                    } w-4 h-4 transition duration-300`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <ul
                id="menu-master-data"
                className={`${
                  show ? "block" : "hidden"
                } w-full  md:pl-8 transition duration-700 ease-linear pt-3`}
              >
                <div className="flex flex-col gap-y-2">
                  <li className="flex justify-center md:justify-between">
                    <Link to="/guru" className="text-sm">
                      Guru
                    </Link>
                  </li>
                  <li className="flex justify-center md:justify-between">
                    <Link to="/siswa" className="text-sm">
                      Siswa
                    </Link>
                  </li>
                  <li className="flex justify-center md:justify-between">
                    <Link to="/mapel" className="text-sm">
                      Mapel
                    </Link>
                  </li>
                </div>
              </ul>
            </li>
          ) : (
            ""
          )}
          <li className="transition duration-300 hover:stroke-2 ">
            <div
              className="flex flex-col items-center justify-center cursor-pointer md:justify-between hover:text-slate-300 md:flex-row"
              id="master-data"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <p className="hidden md:block text-sm">Siswa</p>
              </div>
              <button className="transition duration-300 ease-in-out bg-transparent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <ul id="menu-master-data" className="hidden w-full mt-5 md:pl-5">
              <div className="flex flex-col gap-y-4">
                <li className="flex justify-center md:justify-between"></li>
              </div>
            </ul>
          </li>
          <li className="flex justify-center md:justify-between">
            <Link className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              <p className="hidden md:block text-sm">Mapel</p>
            </Link>
          </li>

          <li className="flex justify-center md:justify-between">
            <Link to="/kelas" className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="hidden md:block text-sm">Ruang Kelas</p>
            </Link>
          </li>

          <li className="flex justify-center md:justify-between">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="hidden md:block text-sm">Info</p>
            </div>
          </li>
          <li className="flex justify-center md:justify-between">
            <Link
              to="/profile-sekolah"
              className="flex items-center gap-3 cursor-pointer hover:text-slate-300"
            >
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
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                />
              </svg>
              <p className="hidden md:block text-sm">Profile Sekolah</p>
            </Link>
          </li>

          <li className="flex justify-center md:justify-between">
            <Link
              to="/profile"
              className="flex items-center gap-3 hover:text-slate-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="hidden md:block text-sm">Profile</p>
            </Link>
          </li>

          <li className="flex justify-center md:justify-between">
            <PopUpLogout />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
