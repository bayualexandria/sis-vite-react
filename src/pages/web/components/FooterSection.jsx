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
        setSekolah(response.data?.data || null);
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      }
    };
    fetchProfile();
  }, []);

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
              <h3 className="truncate font-bold text-white">
                {sekolah.nama_sekolah}
              </h3>

              <h3 className="truncate font-bold text-white">
                {sekolah.nama_sekolah}
              </h3>

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
            <Link to="/tenaga-pengajar"></Link>
            <Link
              to="/guru"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Guru & Staff
            </Link>

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
          </div>
        </div>

        {/* Kontak Informasi */}
        <div>
          <h3 className="mb-5 font-bold text-white">Kontak</h3>
          <div className="space-y-4 text-sm leading-6 text-slate-400">
            <p>{sekolah.nama_sekolah}</p>
            <p>{sekolah.no_telp}</p>
            <p className="break-all">{sekolah.email}</p>

            <p>{sekolah.alamat}</p>
            <p>{sekolah.no_telp}</p>
            <p className="break-all">{sekolah.email}</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
        © {new Date().getFullYear()} {sekolah.nama_sekolah}. All Rights
        Reserved. © {new Date().getFullYear()} {sekolah.nama_sekolah}. All
        Rights Reserved.
      </div>
    </footer>
  );
}
