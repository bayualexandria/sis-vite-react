import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/images/logo-pendidikan.png";

import PopUpLogout from "../popup/PopUpLogout";

/* ============================================================
   ICONS
============================================================ */

const icons = {
  home: (
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
        d="m3 10.5 9-7.5 9 7.5M5.25 9.75V21h13.5V9.75M9 21v-6h6v6"
      />
    </svg>
  ),

  guru: (
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
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.937 3.375 3.375 0 0 0-3.375-3.375c-.348 0-.686.053-1.006.15M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.003A9.358 9.358 0 0 1 8.25 21c-2.17 0-4.168-.74-5.75-1.983m12.5-12.5a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 3.375a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0ZM4.5 8.25a2.625 2.625 0 1 0 5.25 0 2.625 2.625 0 0 0-5.25 0Z"
      />
    </svg>
  ),

  siswa: (
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
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.937 3.375 3.375 0 0 0-3.375-3.375c-.348 0-.686.053-1.006.15M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.003A9.358 9.358 0 0 1 8.25 21c-2.17 0-4.168-.74-5.75-1.983m12.5-12.5a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 3.375a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1-5.25 0ZM4.5 8.25a2.625 2.625 0 1 0 5.25 0 2.625 2.625 0 0 0 5.25 0Z"
      />
    </svg>
  ),

  mapel: (
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
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
      />
    </svg>
  ),

  kelas: (
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
        d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"
      />
    </svg>
  ),

  sekolah: (
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
        d="M3 21h18M4.5 21V10.3A48 48 0 0 1 12 9.75a48 48 0 0 1 7.5.55V21M3 9l9-6 9 6M8.25 21v-8.25M12 21v-8.25M15.75 21v-8.25M12 6.75h.01"
      />
    </svg>
  ),

  profile: (
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
  ),

  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 10v6M12 7.5h.01" />
    </svg>
  ),

  database: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5v7c0 1.657 3.582 3 8 3s8-1.343 8-3V5M4 12v7c0 1.657 3.582 3 8 3s8-1.343 8-3v-7"
      />
    </svg>
  ),
  guruMapel: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
      />
    </svg>
  ),
};

/* ============================================================
   MENU ITEM
   WAJIB DI LUAR COMPONENT SIDEBAR
============================================================ */

function MenuItem({ to, label, icon, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3
        rounded-xl px-3 py-2.5
        transition-all duration-200

        ${
          active
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : `
              text-slate-600
              hover:bg-slate-100
              hover:text-slate-900

              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-white
            `
        }
      `}
    >
      <span
        className={`
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-lg
          transition

          ${
            active
              ? "bg-white/15 text-white"
              : `
                bg-slate-100
                text-slate-500

                group-hover:bg-white
                group-hover:text-primary

                dark:bg-slate-800
                dark:text-slate-400
                dark:group-hover:bg-slate-700
                dark:group-hover:text-primary
              `
          }
        `}
      >
        {icon}
      </span>

      <span className="text-sm font-medium">{label}</span>

      {active && (
        <span
          className="
            ml-auto
            h-1.5 w-1.5
            rounded-full
            bg-white
          "
        />
      )}
    </Link>
  );
}

/* ============================================================
   SIDEBAR
============================================================ */

function Sidebar() {
  const location = useLocation();

  const statusId = Number(localStorage.getItem("id_user"));
  const [showMasterData, setShowMasterData] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ============================================================
     AMBIL USERNAME
  ============================================================ */

  /* ============================================================
     AMBIL DATA USER
  ============================================================ */

  /* ============================================================
     MOBILE SIDEBAR EVENT
  ============================================================ */

  useEffect(() => {
    const handleToggleSidebar = () => {
      setMobileOpen((prev) => !prev);
    };

    const handleCloseSidebar = () => {
      setMobileOpen(false);
    };

    window.addEventListener("toggle-mobile-sidebar", handleToggleSidebar);

    window.addEventListener("close-mobile-sidebar", handleCloseSidebar);

    return () => {
      window.removeEventListener("toggle-mobile-sidebar", handleToggleSidebar);

      window.removeEventListener("close-mobile-sidebar", handleCloseSidebar);
    };
  }, []);

  /* ============================================================
     OTOMATIS BUKA MASTER DATA
  ============================================================ */

  useEffect(() => {
    const masterRoutes = ["/guru", "/siswa", "/mapel"];

    const isMasterRoute = masterRoutes.some((route) =>
      location.pathname.startsWith(route),
    );

    if (isMasterRoute) {
      setShowMasterData(true);
    }
  }, [location.pathname]);

  /* ============================================================
     TUTUP MOBILE SETELAH PINDAH HALAMAN
  ============================================================ */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ============================================================
     ACTIVE MENU
  ============================================================ */
  const getRole = () => {
    switch (statusId) {
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
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  /* ============================================================
     CLOSE MOBILE SIDEBAR
  ============================================================ */

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* ========================================================
          MOBILE OVERLAY
      ======================================================== */}

      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 z-[60]
          bg-slate-950/50
          backdrop-blur-sm
          transition-opacity duration-300
          lg:hidden

          ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex w-[280px] flex-col

          border-r
          border-slate-200
          bg-white

          shadow-2xl

          transition-transform duration-300 ease-out

          dark:border-slate-800
          dark:bg-slate-950
          dark:shadow-black/30

          lg:w-64
          lg:translate-x-0
          lg:shadow-xl

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ======================================================
            HEADER
        ======================================================= */}

        <div
          className="
            flex h-[76px]
            shrink-0
            items-center justify-between
            border-b
            border-slate-100
            px-5

            dark:border-slate-800
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                bg-primary
                p-2
                shadow-lg
                shadow-primary/20
              "
            >
              <img
                src={logo}
                alt="Logo Pendidikan"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p
                className="
                  text-sm font-bold tracking-tight
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

          {/* CLOSE MOBILE */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg

              text-slate-400

              transition

              hover:bg-slate-100
              hover:text-slate-700

              dark:hover:bg-slate-800
              dark:hover:text-white

              lg:hidden
            "
            aria-label="Tutup menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ======================================================
            USER MINI INFO
        ======================================================= */}

        <div
          className="
            mx-3 mt-4
            rounded-xl
            border
            border-slate-100
            bg-slate-50
            p-3

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                bg-primary/10
                text-primary
              "
            >
              {icons.profile}
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  dark:text-slate-500
                "
              >
                {getRole()}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              ></p>
            </div>
          </div>
        </div>

        {/* ======================================================
            MENU
        ======================================================= */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p
            className="
              mb-3 px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-slate-400
              dark:text-slate-500
            "
          >
            Menu Utama
          </p>

          <nav className="space-y-1.5">
            {/* HOME */}

            <MenuItem
              to="/home"
              label="Home"
              icon={icons.home}
              active={isActive("/home")}
              onClick={closeMobileSidebar}
            />

            {/* ==================================================
                MASTER DATA
            =================================================== */}

            {statusId === 1 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowMasterData((prev) => !prev)}
                  className={`
                    group flex w-full
                    items-center justify-between
                    rounded-xl
                    px-3 py-2.5
                    transition-all duration-200

                    ${
                      showMasterData
                        ? `
                          bg-slate-100
                          text-slate-900

                          dark:bg-slate-800
                          dark:text-white
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100
                          hover:text-slate-900

                          dark:text-slate-300
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`
                        flex h-9 w-9
                        items-center justify-center
                        rounded-lg

                        ${
                          showMasterData
                            ? `
                              bg-primary/10
                              text-primary
                            `
                            : `
                              bg-slate-100
                              text-slate-500

                              group-hover:bg-white
                              group-hover:text-primary

                              dark:bg-slate-800
                              dark:text-slate-400
                              dark:group-hover:bg-slate-700
                            `
                        }
                      `}
                    >
                      {icons.database}
                    </span>

                    <span className="text-sm font-medium">Master Data</span>
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`
                      h-4 w-4
                      text-slate-400
                      transition-transform
                      duration-300

                      dark:text-slate-500

                      ${showMasterData ? "rotate-90" : ""}
                    `}
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 0 1-.02-1.06L10.94 10 7.19 6.29a.75.75 0 1 1 1.06-1.06l4.28 4.24a.75.75 0 0 1 0 1.06l-4.28 4.24a.75.75 0 0 1-1.04 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div
                  className={`
                    grid overflow-hidden
                    transition-all duration-300

                    ${
                      showMasterData
                        ? "mt-1 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="
                        ml-7 space-y-1
                        border-l
                        border-slate-200
                        pl-4

                        dark:border-slate-700
                      "
                    >
                      <MenuItem
                        to="/guru"
                        label="Guru"
                        icon={icons.guru}
                        active={isActive("/guru")}
                        onClick={closeMobileSidebar}
                      />

                      <MenuItem
                        to="/siswa"
                        label="Siswa"
                        icon={icons.siswa}
                        active={isActive("/siswa")}
                        onClick={closeMobileSidebar}
                      />

                      <MenuItem
                        to="/mapel"
                        label="Mata Pelajaran"
                        icon={icons.mapel}
                        active={isActive("/mapel")}
                        onClick={closeMobileSidebar}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RUANG KELAS */}
            {(statusId === 1 || statusId === 2) && (
              <MenuItem
                to="/kelas"
                label="Ruang Kelas"
                icon={icons.kelas}
                active={isActive("/kelas")}
                onClick={closeMobileSidebar}
              />
            )}

            {/* PROFILE SEKOLAH */}
            <MenuItem
              to="/guru-mapel"
              label="Guru Mata Pelajaran"
              icon={icons.guruMapel}
              active={isActive("/guru-mapel")}
              onClick={closeMobileSidebar}
            />

            <MenuItem
              to="/profile-sekolah"
              label="Profile Sekolah"
              icon={icons.sekolah}
              active={isActive("/profile-sekolah")}
              onClick={closeMobileSidebar}
            />

            {/* INFORMASI */}

            <button
              type="button"
              className="
                group flex w-full
                items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-left

                text-slate-600

                transition

                hover:bg-slate-100
                hover:text-slate-900

                dark:text-slate-300
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
            >
              <span
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg

                  bg-slate-100
                  text-slate-500

                  group-hover:bg-white
                  group-hover:text-primary

                  dark:bg-slate-800
                  dark:text-slate-400
                  dark:group-hover:bg-slate-700
                "
              >
                {icons.info}
              </span>

              <span className="text-sm font-medium">Informasi</span>
            </button>
          </nav>

          {/* ====================================================
              PENGATURAN
          ===================================================== */}

          <div
            className="
              my-5
              border-t
              border-slate-100

              dark:border-slate-800
            "
          />

          <p
            className="
              mb-3 px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-slate-400
              dark:text-slate-500
            "
          >
            Pengaturan
          </p>

          <nav className="space-y-1.5">
            <MenuItem
              to="/profile"
              label="Profile"
              icon={icons.profile}
              active={isActive("/profile")}
              onClick={closeMobileSidebar}
            />
          </nav>
        </div>

        {/* ======================================================
            FOOTER
        ======================================================= */}

        <div
          className="
            shrink-0
            border-t
            border-slate-100
            bg-slate-50/70
            p-3

            dark:border-slate-800
            dark:bg-slate-900/70
          "
        >
          <div
            className="
              flex items-center justify-between
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3 py-2.5
              shadow-sm

              dark:border-slate-700
              dark:bg-slate-800
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-slate-400
                  dark:text-slate-500
                "
              >
                STATUS SISTEM
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className="
                    h-2 w-2
                    rounded-full
                    bg-emerald-500
                    shadow-sm
                    shadow-emerald-500/40
                  "
                />

                <span
                  className="
                    text-[11px]
                    font-medium
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  Sistem Aktif
                </span>
              </div>
            </div>

            <PopUpLogout />
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
