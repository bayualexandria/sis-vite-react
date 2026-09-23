import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import api from "../../utils/repositories";
import repoimages from "../../utils/repoimages";
import logo from "../../assets/images/logo-pendidikan.png";
import ChangePassword from "../../pages/profile/ChangePassword";

const SwalReact = withReactContent(Swal);

const templateModal = SwalReact.mixin({
  customClass: {
    confirmButton:
      "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90",
    cancelButton:
      "rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300",
  },
  buttonsStyling: false,
});

const templateModalNotif = SwalReact.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "rounded-xl shadow-xl",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // DARK MODE
  // ============================================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // ============================================================
  // USERNAME
  // ============================================================

  const getUsername = () => {
    const storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      return null;
    }

    try {
      return JSON.parse(storedUsername);
    } catch {
      return storedUsername;
    }
  };

  // ============================================================
  // AMBIL DATA USER
  // ============================================================

  const showUser = useCallback(async () => {
    const username = getUsername();

    if (!username) {
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(`user/${username}/guru`, {
        withCredentials: true,
      });

      setDataUser(response?.data?.data || null);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);

      const status = error?.response?.status;

      if (
        error?.message === "Failed to fetch" ||
        error?.code === "ERR_NETWORK" ||
        status === 401
      ) {
        templateModalNotif.fire({
          icon: "error",
          title: "Koneksi ke server terputus. Mohon hubungi administrator.",
        });

        localStorage.removeItem("username");
        localStorage.removeItem("id_user");
        localStorage.removeItem("is_logged_in");

        try {
          await api.delete(`access-token/${username}`);
        } catch (logoutError) {
          console.error("Gagal menghapus access token:", logoutError);
        }

        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    showUser();
  }, [showUser]);

  // ============================================================
  // CLOSE DROPDOWN CLICK OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================================
  // HAMBURGER SIDEBAR
  // ============================================================

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const popUpLogoutButton = async () => {
    const result = await templateModal.fire({
      title: "Keluar dari sistem?",
      text: "Apakah Anda yakin ingin keluar dari sistem?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await api.post(
        "/logout-admin",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("username");
      localStorage.removeItem("id_user");
      localStorage.removeItem("is_logged_in");

      navigate("/login", {
        replace: true,
      });
    }
  };

  // ============================================================
  // INITIAL
  // ============================================================

  const getInitial = () => {
    const name = dataUser?.name || getUsername() || "U";

    return String(name).trim().charAt(0).toUpperCase();
  };

  // ============================================================
  // USERNAME / NAME
  // ============================================================

  const username = getUsername();

  const displayName =
    dataUser?.name || (typeof username === "string" ? username : "Pengguna");

  // ============================================================
  // ROLE
  // ============================================================

  const getRole = () => {
    switch (dataUser?.status_id) {
      case 1:
        return "Administrator";
      case 2:
        return "Wali Kelas";
      case 3:
        return "Guru";
      default:
        return "Pengguna";
    }
  };

  // ============================================================
  // PROFILE IMAGE
  // ============================================================

  const profileImage = dataUser?.image_profile
    ? `${repoimages}${dataUser.image_profile}`
    : null;

  return (
    <header
      className="
        sticky top-0 z-40 w-full
        border-b border-slate-200
        bg-white/95 backdrop-blur-xl
        transition-colors duration-300

        dark:border-slate-800
        dark:bg-slate-950/95
      "
    >
      <div
        className="
          flex h-[76px] items-center justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        {/* =====================================================
            LEFT
        ====================================================== */}

        <div className="flex min-w-0 items-center gap-3">
          {/* HAMBURGER MOBILE */}

          <button
            type="button"
            onClick={toggleSidebar}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition

              hover:bg-slate-50
              hover:text-primary
              active:scale-95

              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-primary

              lg:hidden
            "
            aria-label="Buka menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* MOBILE BRAND */}

          <div className="flex items-center gap-3 lg:hidden">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-primary p-2
                shadow-md shadow-primary/20
              "
            >
              <img
                src={logo}
                alt="Logo Pendidikan"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="hidden min-[420px]:block">
              <p
                className="
                  text-sm font-bold
                  text-slate-800
                  dark:text-white
                "
              >
                Sistem Informasi
              </p>

              <p
                className="
                  text-[10px]
                  text-slate-400
                  dark:text-slate-500
                "
              >
                Administrasi Sekolah
              </p>
            </div>
          </div>

          {/* DESKTOP TITLE */}

          <div className="hidden lg:block">
            <p
              className="
                text-lg font-bold tracking-tight
                text-slate-800
                dark:text-white
              "
            >
              Sistem Informasi Sekolah
            </p>

            <p
              className="
                mt-0.5 text-xs
                text-slate-400
                dark:text-slate-500
              "
            >
              Kelola data sekolah dengan mudah dan terintegrasi
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT
        ====================================================== */}

        <div
          ref={dropdownRef}
          className="relative flex items-center gap-1.5 sm:gap-3"
        >
          {/* =================================================
              DARK MODE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={toggleDarkMode}
            className="
              group relative
              flex h-10 w-10
              items-center justify-center
              rounded-xl

              text-slate-500
              transition-all duration-200

              hover:bg-slate-100
              hover:text-primary
              active:scale-95

              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-amber-400
            "
            aria-label={
              darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"
            }
            title={darkMode ? "Mode terang" : "Mode gelap"}
          >
            {darkMode ? (
              /* SUN */

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="
                  h-5 w-5
                  transition-transform duration-300
                  group-hover:rotate-45
                "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25M12 18.75V21M4.22 4.22l1.59 1.59M18.19 18.19l1.59 1.59M3 12h2.25M18.75 12H21M4.22 19.78l1.59-1.59M18.19 5.81l1.59-1.59"
                />

                <circle cx="12" cy="12" r="3.75" />
              </svg>
            ) : (
              /* MOON */

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="
                  h-5 w-5
                  transition-transform duration-300
                  group-hover:-rotate-12
                "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1 1 11.21 3
                  7 7 0 0 0 21 12.79Z"
                />
              </svg>
            )}
          </button>

          {/* SEPARATOR */}

          <div
            className="
              hidden h-8 w-px
              bg-slate-200
              dark:bg-slate-800
              sm:block
            "
          />

          {/* =================================================
              NOTIFICATION
          ================================================== */}

          <button
            type="button"
            className="
              group relative
              flex h-10 w-10
              items-center justify-center
              rounded-xl

              text-slate-500
              transition

              hover:bg-slate-100
              hover:text-primary

              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-primary
            "
            aria-label="Notifikasi"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022 23.848 23.848 0 0 0 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>

            <span
              className="
                absolute right-2.5 top-2
                h-1.5 w-1.5
                rounded-full
                bg-rose-500
                ring-2 ring-white

                dark:ring-slate-950
              "
            />
          </button>

          {/* SEPARATOR */}

          <div
            className="
              hidden h-8 w-px
              bg-slate-200
              dark:bg-slate-800
              sm:block
            "
          />

          {/* =================================================
              PROFILE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className={`
              group flex items-center gap-2
              rounded-xl p-1.5 pr-2
              transition
              sm:gap-3 sm:pr-3

              ${
                showMenu
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "hover:bg-slate-50 dark:hover:bg-slate-900"
              }
            `}
          >
            {/* AVATAR */}

            <div className="relative">
              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  overflow-hidden
                  rounded-xl

                  border border-slate-200
                  bg-primary
                  text-sm font-bold text-white
                  shadow-sm

                  dark:border-slate-700
                "
              >
                {!loading && profileImage ? (
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  getInitial()
                )}
              </div>

              <span
                className="
                  absolute -bottom-0.5 -right-0.5
                  h-3 w-3
                  rounded-full
                  border-2
                  border-white
                  bg-emerald-500

                  dark:border-slate-950
                "
              />
            </div>

            {/* USER INFO */}

            <div className="hidden min-w-0 text-left sm:block">
              <p
                className="
                  max-w-[150px] truncate
                  text-sm font-semibold
                  text-slate-800
                  dark:text-slate-100
                "
              >
                {loading ? "Memuat..." : displayName}
              </p>

              <p
                className="
                  text-[11px] font-medium
                  text-slate-400
                  dark:text-slate-500
                "
              >
                {getRole()}
              </p>
            </div>

            {/* CHEVRON */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`
                hidden h-4 w-4
                text-slate-400
                transition-transform
                dark:text-slate-500
                sm:block

                ${showMenu ? "rotate-180" : ""}
              `}
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.939l3.71-3.71a.75.75 0 1 1 1.06 1.061l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* =================================================
              DROPDOWN
          ================================================== */}

          {showMenu && (
            <div
              className="
                absolute right-0 top-[58px]
                w-[290px]
                overflow-hidden
                rounded-2xl

                border border-slate-200
                bg-white

                shadow-2xl
                shadow-slate-900/10

                dark:border-slate-700
                dark:bg-slate-900
                dark:shadow-black/30
              "
            >
              {/* USER HEADER */}

              <div
                className="
                  border-b border-slate-100
                  bg-slate-50/80
                  p-4

                  dark:border-slate-800
                  dark:bg-slate-950
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      overflow-hidden
                      rounded-xl
                      bg-primary
                      text-base font-bold
                      text-white
                    "
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitial()
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm font-bold
                        text-slate-800
                        dark:text-slate-100
                      "
                    >
                      {displayName}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className="
                          h-1.5 w-1.5
                          rounded-full
                          bg-emerald-500
                        "
                      />

                      <span
                        className="
                          text-[11px] font-medium
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        {getRole()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MENU */}

              <div className="p-2">
                {/* PROFILE */}

                <Link
                  to="/profile"
                  onClick={() => setShowMenu(false)}
                  className="
                    group flex items-center gap-3
                    rounded-xl px-3 py-3
                    transition

                    hover:bg-slate-50

                    dark:hover:bg-slate-800
                  "
                >
                  <span
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg

                      bg-slate-100
                      text-slate-500

                      transition

                      group-hover:bg-primary/10
                      group-hover:text-primary

                      dark:bg-slate-800
                      dark:text-slate-400
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </span>

                  <span className="flex-1 text-left">
                    <span
                      className="
                        block text-sm font-medium
                        text-slate-700
                        dark:text-slate-200
                      "
                    >
                      Profile
                    </span>

                    <span
                      className="
                        block text-[10px]
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      Kelola informasi akun
                    </span>
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="
                      h-4 w-4
                      text-slate-300
                      transition

                      group-hover:translate-x-0.5
                      group-hover:text-primary

                      dark:text-slate-600
                    "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 5 7 7-7 7"
                    />
                  </svg>
                </Link>

                {/* CHANGE PASSWORD */}

                <div
                  className="
                    rounded-xl
                    transition
                    hover:bg-slate-50

                    dark:hover:bg-slate-800
                  "
                >
                  <ChangePassword />
                </div>

                {/* DIVIDER */}

                <div
                  className="
                    my-2
                    border-t border-slate-100
                    dark:border-slate-800
                  "
                />

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={popUpLogoutButton}
                  className="
                    group flex w-full
                    items-center gap-3
                    rounded-xl px-3 py-3
                    transition

                    hover:bg-rose-50

                    dark:hover:bg-rose-950/30
                  "
                >
                  <span
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      bg-rose-50
                      text-rose-500

                      dark:bg-rose-950/40
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                  </span>

                  <span
                    className="
                      text-sm font-medium
                      text-rose-600
                      dark:text-rose-400
                    "
                  >
                    Logout
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
