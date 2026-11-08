<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import repoimages from "../../../utils/repoimages";
import axios from "axios";
import repo from "../../../utils/repo";

export default function NavbarSection({ isDetailPage = false }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sekolah, setSekolah] = useState(null);
=======
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavbarSection({ sekolah, repo, isDetailPage = false }) {
  const [mobileMenu, setMobileMenu] = useState(false);
>>>>>>> 288fe97 (Updated)

  const namaSekolah = sekolah?.nama_sekolah || "SMK Nama Sekolah";
  const getNavHref = (target) => (isDetailPage ? `/${target}` : target);

  const closeMobileMenu = () => setMobileMenu(false);

<<<<<<< HEAD
  const userProfile = async () => {
    try {
      const response = await axios.get(`${repo}api/profile-sekolah`);
      setSekolah(response.data?.data || null);
    } catch (error) {
      console.error("Gagal mengambil data sekolah:", error);
    } finally {
      false;
    }
  };

  useEffect(() => {
    userProfile();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl">
=======
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
>>>>>>> 288fe97 (Updated)
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link
          to="/"
          onClick={closeMobileMenu}
<<<<<<< HEAD
          className="group flex min-w-0 items-center gap-3.5"
        >
          {sekolah?.image_profile ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 p-2 shadow-lg shadow-blue-600/20 transition group-hover:scale-105">
              <img
                src={repoimages + sekolah.image_profile}
=======
          className="flex min-w-0 items-center gap-3"
        >
          {sekolah?.image_profile ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 p-2 shadow-lg shadow-blue-600/20">
              <img
                src={repo + sekolah.image_profile}
>>>>>>> 288fe97 (Updated)
                alt="Logo Sekolah"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
<<<<<<< HEAD
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20 transition group-hover:scale-105">
=======
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20">
>>>>>>> 288fe97 (Updated)
              S
            </div>
          )}

          <div className="min-w-0">
<<<<<<< HEAD
            <h1 className="truncate text-sm font-extrabold text-slate-900 sm:text-base tracking-tight">
              {namaSekolah}
            </h1>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">
=======
            <h1 className="truncate text-sm font-extrabold text-slate-900 sm:text-base">
              {namaSekolah}
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
>>>>>>> 288fe97 (Updated)
              Sekolah Menengah Kejuruan
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
<<<<<<< HEAD
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Beranda
          </Link>
          <Link
            to="/profil"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Profil
          </Link>
          <Link
            to="/jurusan"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Jurusan
          </Link>
          <Link
            to="/fasilitas"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Fasilitas
          </Link>
          <Link
            to="/tenaga-pengajar"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Guru & Staf
          </Link>
          <Link
            to="/prestasi"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Prestasi
          </Link>
          <Link
            to="/berita"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Berita
          </Link>
          <Link
            to="/kontak"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Kontak
          </Link>
=======
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink href={getNavHref("#home")} text="Beranda" />
          <NavLink href={getNavHref("#about")} text="Profil" />
          <NavLink href={getNavHref("#jurusan")} text="Jurusan" />
          <NavLink href={getNavHref("#fasilitas")} text="Fasilitas" />
          <Link
            to="/tenaga-pengajar"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Guru
          </Link>
          <NavLink href={getNavHref("#prestasi")} text="Prestasi" />
          <NavLink href={getNavHref("#berita")} text="Berita" />
          <NavLink href={getNavHref("#kontak")} text="Kontak" />
>>>>>>> 288fe97 (Updated)
        </nav>

        {/* Action Button */}
        <Link
          to="/ppdb"
<<<<<<< HEAD
          className="hidden shrink-0 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl lg:inline-flex"
=======
          className="hidden shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl lg:inline-flex"
>>>>>>> 288fe97 (Updated)
        >
          PPDB 2026
        </Link>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
<<<<<<< HEAD
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 lg:hidden"
=======
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 lg:hidden"
>>>>>>> 288fe97 (Updated)
          aria-label="Buka menu"
        >
          {mobileMenu ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
<<<<<<< HEAD
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
=======
              <path d="M6 6l12 12M18 6L6 18" />
>>>>>>> 288fe97 (Updated)
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
<<<<<<< HEAD
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
=======
              <path d="M4 6h16M4 12h16M4 18h16" />
>>>>>>> 288fe97 (Updated)
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
<<<<<<< HEAD
        className={`overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          mobileMenu
            ? "max-h-[500px] opacity-100 py-4"
            : "max-h-0 opacity-0 py-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-1.5">
            <MobileNavLink
              href={getNavHref("/")}
=======
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          mobileMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="grid gap-1">
            <MobileNavLink
              href={getNavHref("#home")}
>>>>>>> 288fe97 (Updated)
              text="Beranda"
              onClick={closeMobileMenu}
            />
            <MobileNavLink
<<<<<<< HEAD
              href={getNavHref("/profil")}
=======
              href={getNavHref("#about")}
>>>>>>> 288fe97 (Updated)
              text="Profil"
              onClick={closeMobileMenu}
            />
            <MobileNavLink
<<<<<<< HEAD
              href={getNavHref("/jurusan")}
=======
              href={getNavHref("#jurusan")}
>>>>>>> 288fe97 (Updated)
              text="Jurusan"
              onClick={closeMobileMenu}
            />
            <MobileNavLink
<<<<<<< HEAD
              href={getNavHref("/fasilitas")}
=======
              href={getNavHref("#fasilitas")}
>>>>>>> 288fe97 (Updated)
              text="Fasilitas"
              onClick={closeMobileMenu}
            />
            <Link
<<<<<<< HEAD
              to="/tenaga-pengajar"
              onClick={closeMobileMenu}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Guru & Staf
            </Link>
            <MobileNavLink
              href={getNavHref("/prestasi")}
=======
              to="/guru"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Guru & Staff
            </Link>
            <MobileNavLink
              href={getNavHref("#prestasi")}
>>>>>>> 288fe97 (Updated)
              text="Prestasi"
              onClick={closeMobileMenu}
            />
            <MobileNavLink
<<<<<<< HEAD
              href={getNavHref("/berita")}
=======
              href={getNavHref("#berita")}
>>>>>>> 288fe97 (Updated)
              text="Berita"
              onClick={closeMobileMenu}
            />
            <MobileNavLink
<<<<<<< HEAD
              href={getNavHref("/kontak")}
              text="Kontak"
              onClick={closeMobileMenu}
            />

            <Link
              to="/ppdb"
              onClick={closeMobileMenu}
              className="mt-3 rounded-2xl bg-blue-600 px-5 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-blue-600/20"
=======
              href={getNavHref("#kontak")}
              text="Kontak"
              onClick={closeMobileMenu}
            />
            <Link
              to="/ppdb"
              onClick={closeMobileMenu}
              className="mt-2 rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white"
>>>>>>> 288fe97 (Updated)
            >
              PPDB 2026
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

<<<<<<< HEAD
function MobileNavLink({ href, text, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
=======
function NavLink({ href, text }) {
  return (
    <a
      href={href}
      className="relative text-sm font-semibold text-slate-600 transition hover:text-blue-600"
    >
      {text}
    </a>
  );
}

function MobileNavLink({ href, text, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
>>>>>>> 288fe97 (Updated)
    >
      {text}
    </a>
  );
}
