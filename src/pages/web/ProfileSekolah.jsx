import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarSection from "./components/NavbarSection";
import FooterSection from "./components/FooterSection";
import FloatingChatAI from "./components/FloatingChatAI";
import repo from "../../utils/repo";
import repoimages from "../../utils/repoimages";

export default function ProfileSekolahPage() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${repo}api/profile-sekolah`);
        setSekolah(response.data?.data || null);
      } catch (error) {
        console.error("Gagal memuat profil sekolah:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const namaSekolah = sekolah?.nama_sekolah || "SMK Nama Sekolah";
  const alamatSekolah = sekolah?.alamat || "Alamat sekolah belum tersedia";
  const teleponSekolah = sekolah?.no_telp || "Nomor telepon belum tersedia";
  const emailSekolah = sekolah?.email || "Email sekolah belum tersedia";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-600/20 animate-pulse">
            S
          </div>
          <h2 className="mt-6 text-xl font-black text-slate-900">
            Memuat Profil Sekolah
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <NavbarSection isDetailPage={true} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white lg:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-blue-600/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 h-[200px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-400 uppercase backdrop-blur-md">
            ✨ Profil Resmi Institusi
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Tentang{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {namaSekolah}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Mengenal lebih dekat sejarah, visi misi, serta komitmen kami dalam
            membangun pendidikan kejuruan berkualitas tinggi.
          </p>
        </div>
      </section>

      {/* SAMBUTAN KEPALA SEKOLAH */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-20 blur-xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-slate-100 shadow-2xl aspect-[4/5] flex items-center justify-center">
                {sekolah?.image_kepala_sekolah || sekolah?.foto_kepsek ? (
                  <img
                    src={`${repoimages}${sekolah.image_kepala_sekolah || sekolah.foto_kepsek}`}
                    alt="Kepala Sekolah"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-400">
                    <span className="text-6xl block mb-3">👨‍💼</span>
                    <p className="text-sm font-bold">Foto Kepala Sekolah</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <span className="inline-block text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                SAMBUTAN PIMPINAN
              </span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Mencetak Generasi Unggul, Kompeten, dan Berkarakter
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                "Selamat datang di {namaSekolah}. Kami berkomitmen penuh untuk
                menghadirkan lingkungan belajar yang inovatif, disiplin, dan
                berbasis teknologi guna menjawab tantangan dunia kerja modern."
              </p>
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-900 text-lg">
                  {sekolah?.nama_kepala_sekolah || "Kepala Sekolah, M.Pd."}
                </h4>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                  Kepala Sekolah {namaSekolah}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI & MISI */}
      <section className="py-20 lg:py-24 bg-slate-50/60 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
              ARAH & TUJUAN
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Visi & Misi Sekolah
            </h2>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {/* Visi Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-xl hover:border-blue-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-black text-blue-600 shadow-inner mb-6">
                🎯
              </div>
              <h3 className="text-2xl font-black text-slate-900">Visi Utama</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {sekolah?.visi ||
                  "Menjadi lembaga pendidikan kejuruan yang unggul, berkarakter mulia, mandiri, serta menghasilkan lulusan berdaya saing global."}
              </p>
            </div>

            {/* Misi Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-xl hover:border-blue-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-black text-blue-600 shadow-inner mb-6">
                🚀
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Misi Sekolah
              </h3>
              <ul className="mt-4 space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Menyelenggarakan pembelajaran berbasis kompetensi sesuai
                    standar industri terkini.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Membentuk peserta didik yang berakhlak mulia, disiplin, dan
                    memiliki integritas tinggi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Mengembangkan kerjasama strategis dengan dunia usaha dan
                    dunia industri (DUDI).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMASI KONTAK & LOKASI SINGKAT */}
      <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">
                MARI BERKUNJUNG
              </span>
              <h3 className="text-2xl font-extrabold sm:text-3xl">
                Ingin Mengenal {namaSekolah} Lebih Dekat?
              </h3>
              <p className="text-slate-400 text-sm max-w-xl">
                Kami terbuka bagi calon siswa dan orang tua yang ingin
                berkonsultasi langsung atau melihat fasilitas belajar kami.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link
                to="/tenaga-pengajar"
                className="rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
              >
                Lihat Guru & Staf →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & CHAT AI */}
      <FooterSection />
      <FloatingChatAI
        alamatSekolah={alamatSekolah}
        teleponSekolah={teleponSekolah}
        emailSekolah={emailSekolah}
      />
    </div>
  );
}
