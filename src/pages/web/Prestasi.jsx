import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarSection from "./components/NavbarSection";
import FooterSection from "./components/FooterSection";
import FloatingChatAI from "./components/FloatingChatAI";
import repo from "../../utils/repo";

export default function PrestasiPage() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedPrestasi, setSelectedPrestasi] = useState(null);

  // Data Prestasi Sekolah & Siswa
  const dataPrestasi = [
    {
      id: "pres-1",
      title:
        "Juara 1 Lomba Kompetensi Siswa (LKS) Bidang IT Software Solutions",
      category: "akademik",
      year: "2026",
      level: "Tingkat Provinsi",
      icon: "🏆",
      shortDesc:
        "Pencapaian membanggakan dalam pengembangan perangkat lunak dan solusi sistem cerdas.",
      description:
        "Siswa perwakilan sekolah berhasil meraih Juara 1 pada ajang Lomba Kompetensi Siswa (LKS) tingkat Provinsi dalam kategori IT Software Solutions for Business, mengalahkan puluhan peserta dari SMK se-provinsi.",
      peraih: "Ahmad Fauzan (Kelas XII RPL)",
      penyelenggara: "Dinas Pendidikan Provinsi",
    },
    {
      id: "pres-2",
      title: "Juara Umum Kejuaraan Pencak Silat Antar Pelajar",
      category: "non-akademik",
      year: "2026",
      level: "Tingkat Kabupaten / Kota",
      icon: "🥇",
      shortDesc:
        "Tim ekstrakurikuler bela diri berhasil memboyong 3 medali emas sekaligus.",
      description:
        "Kontingen atlet pencak silat sekolah sukses mendominasi kejuaraan tingkat kabupaten dengan perolehan total 3 medali emas dan 2 medali perak, sekaligus dinobatkan sebagai juara umum dalam turnamen tersebut.",
      peraih: "Tim Ekstrakurikuler Pencak Silat",
      penyelenggara: "IPSX Kabupaten",
    },
    {
      id: "pres-3",
      title: "Medali Emas Olimpiade Sains Nasional (OSN) Matematika",
      category: "akademik",
      year: "2025",
      level: "Tingkat Nasional",
      icon: "🌟",
      shortDesc:
        "Prestasi gemilang di kancah nasional bidang sains dan matematika.",
      description:
        "Siswa teladan kami sukses menembus babak final nasional OSN dan mempersembahkan medali emas setelah melalui seleksi ketat melawan ratusan pelajar unggulan dari seluruh Indonesia.",
      peraih: "Siti Rahmawati (Kelas XI AKL)",
      penyelenggara: "Kementerian Pendidikan dan Kebudayaan",
    },
    {
      id: "pres-4",
      title: "Juara 1 Lomba Video Kreatif & Inovasi Teknologi Pelajar",
      category: "teknologi",
      year: "2025",
      level: "Tingkat Regional",
      icon: "💡",
      shortDesc:
        "Karya inovasi sistem alat penghemat energi berbasis IoT oleh siswa TKJ.",
      description:
        "Tim riset dan teknologi sekolah menciptakan purwarupa sistem kontrol otomatis berbasis Internet of Things (IoT) yang berhasil memukau dewan juri dan meraih posisi juara pertama.",
      peraih: "Tim Robotika & IoT TKJ",
      penyelenggara: "Universitas Teknologi Swasta",
    },
    {
      id: "pres-5",
      title: "Juara 2 Turnamen Bola Basket Cup Antar SMK",
      category: "non-akademik",
      year: "2025",
      level: "Tingkat Kabupaten",
      icon: "🏀",
      shortDesc:
        "Tim basket putra menunjukkan sportivitas dan kerjasama tim yang luar biasa.",
      description:
        "Melalui pertandingan final yang berlangsung sengit dan penuh semangat juang tinggi, tim bola basket sekolah berhasil mengamankan posisi sebagai Juara 2 dalam turnamen bergengsi antar pelajar.",
      peraih: "Tim Basket Putra Official",
      penyelenggara: "Perbasi Kabupaten",
    },
    {
      id: "pres-6",
      title: "Penghargaan Sekolah Adiwiyata & Berbudaya Lingkungan",
      category: "akademik",
      year: "2024",
      level: "Tingkat Provinsi",
      icon: "🌱",
      shortDesc:
        "Komitmen seluruh warga sekolah dalam menjaga kebersihan dan kelestarian lingkungan.",
      description:
        "Sekolah resmi menerima penghargaan sebagai sekolah berwawasan lingkungan hidup (Adiwiyata) berkat konsistensi program daur ulang sampah, kebun sekolah, dan penghijauan area kampus.",
      peraih: "Seluruh Civitas Akademika Sekolah",
      penyelenggara: "Kementerian Lingkungan Hidup",
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${repo}api/profile-sekolah`);
        setSekolah(response.data?.data || null);
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const namaSekolah = sekolah?.nama_sekolah || "SMK Nama Sekolah";

  // Filter prestasi berdasarkan tab kategori dan search query
  const filteredPrestasi = dataPrestasi.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query) ||
      p.peraih.toLowerCase().includes(query) ||
      p.level.toLowerCase().includes(query);

    if (activeCategory === "akademik") {
      return matchesSearch && p.category === "akademik";
    } else if (activeCategory === "non-akademik") {
      return matchesSearch && p.category === "non-akademik";
    } else if (activeCategory === "teknologi") {
      return matchesSearch && p.category === "teknologi";
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-600/20 animate-pulse">
            S
          </div>
          <h2 className="mt-6 text-xl font-black text-slate-900">
            Memuat Data Prestasi
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[320px] w-[650px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 h-[220px] w-[420px] rounded-full bg-indigo-600/20 blur-[110px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-amber-400 uppercase backdrop-blur-md">
            🏆 BUKTI PRESTASI & DEDIKASI
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Jejak Prestasi &{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Pencapaian Gemilang
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Deretan penghargaan dan pencapaian membanggakan yang diraih oleh
            siswa-siswi serta institusi {namaSekolah} di berbagai ajang
            kompetisi.
          </p>

          {/* Search Bar Input */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/80 border border-slate-800 p-2 backdrop-blur-xl transition focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10">
              <span className="pl-4 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari prestasi, nama siswa, atau tingkat kejuaraan..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Kategori Tab Filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "semua", label: "Semua Prestasi" },
              { id: "akademik", label: "Akademik & Sains" },
              { id: "non-akademik", label: "Olahraga & Seni" },
              { id: "teknologi", label: "Teknologi & Inovasi" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                  activeCategory === tab.id
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 font-black"
                    : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRESTASI GRID CONTENT */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-6 mb-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Daftar Pencapaian
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan {filteredPrestasi.length} catatan prestasi
                membanggakan
              </p>
            </div>
          </div>

          {filteredPrestasi.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <span className="text-5xl">📂</span>
              <h3 className="mt-4 text-base font-bold text-slate-700">
                Prestasi Tidak Ditemukan
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Coba gunakan kata kunci pencarian atau kategori lain.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrestasi.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPrestasi(p)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-amber-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Icon & Year Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl shadow-inner group-hover:bg-amber-500 group-hover:text-white transition duration-300">
                        {p.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-800">
                          {p.year}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                          {p.level}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 text-xl font-black text-slate-900 transition group-hover:text-amber-600 line-clamp-2">
                      {p.title}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {p.shortDesc}
                    </p>

                    {/* Peraih */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span>👤</span>{" "}
                      <span className="truncate">{p.peraih}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 group-hover:underline">
                      Lihat Detail Prestasi
                    </span>
                    <span className="text-xs font-bold text-amber-600 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              GABUNG BERSAMA KAMI
            </span>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Wujudkan Prestasimu Bersama {namaSekolah}
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              Kami siap mendukung setiap bakat, minat, dan potensi akademik
              maupun non-akademik siswa untuk meraih juara.
            </p>
          </div>
          <Link
            to="/ppdb"
            className="shrink-0 rounded-2xl bg-amber-500 px-8 py-4 font-bold text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-amber-400 hover:shadow-2xl"
          >
            Daftar PPDB Sekarang →
          </Link>
        </div>
      </section>

      {/* MODAL DETAIL PRESTASI */}
      {selectedPrestasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-slate-100">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white">
              <button
                onClick={() => setSelectedPrestasi(null)}
                className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-3xl backdrop-blur-md ring-2 ring-amber-400/30">
                  {selectedPrestasi.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-black text-amber-300">
                      {selectedPrestasi.year}
                    </span>
                    <span className="inline-block rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-bold text-slate-300">
                      {selectedPrestasi.level}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {selectedPrestasi.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto bg-slate-50/50 text-sm text-slate-700">
              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  📌 Deskripsi Pencapaian
                </strong>
                <p className="leading-relaxed text-xs sm:text-sm">
                  {selectedPrestasi.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                  <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    👤 Peraih / Kontingen
                  </strong>
                  <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                    {selectedPrestasi.peraih}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                  <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    🏛️ Penyelenggara
                  </strong>
                  <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                    {selectedPrestasi.penyelenggara}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedPrestasi(null)}
                className="w-full rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-amber-500 hover:text-slate-950"
              >
                Tutup Keterangan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER & CHAT AI */}
      <FooterSection />
      <FloatingChatAI
       
      />
    </div>
  );
}
