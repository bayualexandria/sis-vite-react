<<<<<<< HEAD
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import repo from "../../../utils/repo";

export default function FooterSection() {
  const [sekolah, setSekolah] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${repo}api/profile-sekolah`);
        console.log(response.data);
        setSekolah(response.data?.data || null);
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      }
    };
    fetchProfile();
  }, []);
=======
import { Link } from "react-router-dom";

export default function FooterSection({ sekolah, isDetailPage = false }) {
  const namaSekolah = sekolah?.nama_sekolah || "SMK Nama Sekolah";
  const alamatSekolah = sekolah?.alamat || "Alamat sekolah belum tersedia";
  const teleponSekolah = sekolah?.telepon || "Nomor telepon belum tersedia";
  const emailSekolah = sekolah?.email || "Email sekolah belum tersedia";
  const websiteSekolah = sekolah?.website || "Website belum tersedia";

  const getNavHref = (target) => (isDetailPage ? `/${target}` : target);
>>>>>>> 288fe97 (Updated)

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {/* Brand & Deskripsi */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
              S
            </div>
            <div className="min-w-0">
<<<<<<< HEAD
              <h3 className="truncate font-bold text-white">
                {sekolah.nama_sekolah}
              </h3>
=======
              <h3 className="truncate font-bold text-white">{namaSekolah}</h3>
>>>>>>> 288fe97 (Updated)
              <p className="text-xs text-slate-500">
                Sekolah Menengah Kejuruan
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-md leading-7 text-slate-400">
            Mempersiapkan generasi muda yang kompeten, berkarakter, mandiri,
            kreatif, dan siap menghadapi dunia kerja.
          </p>
        </div>

        {/* Navigation Menu */}
        <div>
          <h3 className="mb-5 font-bold text-white">Menu Navigasi</h3>
          <div className="grid gap-3">
<<<<<<< HEAD
            <Link
              to="/"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Beranda
            </Link>
            <Link
              to="/profil"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Profil
            </Link>
            <Link
              to="/jurusan"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Jurusan
            </Link>
            <Link
              to="/fasilitas"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Fasilitas
            </Link>
            <Link
              to="/tenaga-pengajar"
=======
            <FooterLink href={getNavHref("#home")} text="Beranda" />
            <FooterLink href={getNavHref("#about")} text="Profil" />
            <FooterLink href={getNavHref("#jurusan")} text="Jurusan" />
            <FooterLink href={getNavHref("#fasilitas")} text="Fasilitas" />
            <Link
              to="/guru"
>>>>>>> 288fe97 (Updated)
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Guru & Staff
            </Link>
<<<<<<< HEAD
            <Link
              to="/prestasi"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Prestasi
            </Link>
            <Link
              to="/berita"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Berita
            </Link>
            <Link
              to="/kontak"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Kontak
            </Link>
=======
            <FooterLink href={getNavHref("#prestasi")} text="Prestasi" />
            <FooterLink href={getNavHref("#berita")} text="Berita" />
            <FooterLink href={getNavHref("#kontak")} text="Kontak" />
>>>>>>> 288fe97 (Updated)
          </div>
        </div>

        {/* Kontak Informasi */}
        <div>
          <h3 className="mb-5 font-bold text-white">Kontak</h3>
          <div className="space-y-4 text-sm leading-6 text-slate-400">
<<<<<<< HEAD
            <p>{sekolah.nama_sekolah}</p>
            <p>{sekolah.no_telp}</p>
            <p className="break-all">{sekolah.email}</p>
=======
            <p>{alamatSekolah}</p>
            <p>{teleponSekolah}</p>
            <p className="break-all">{emailSekolah}</p>
            <p className="break-all">{websiteSekolah}</p>
>>>>>>> 288fe97 (Updated)
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
<<<<<<< HEAD
        © {new Date().getFullYear()} {sekolah.nama_sekolah}. All Rights
        Reserved.
=======
        © {new Date().getFullYear()} {namaSekolah}. All Rights Reserved.
>>>>>>> 288fe97 (Updated)
      </div>
    </footer>
  );
}
<<<<<<< HEAD
=======

function FooterLink({ href, text }) {
  return (
    <a
      href={href}
      className="text-sm text-slate-400 transition hover:text-white"
    >
      {text}
    </a>
  );
}
>>>>>>> 288fe97 (Updated)
