import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarSection from "./components/NavbarSection";
import FooterSection from "./components/FooterSection";
import FloatingChatAI from "./components/FloatingChatAI";
import repo from "../../utils/repo";

export default function FasilitasPage() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedFasilitas, setSelectedFasilitas] = useState(null);

  // Data Fasilitas Sekolah
  const dataFasilitas = [
    {
      id: "lab-komputer",
      title: "Laboratorium Komputer & Jaringan",
      category: "akademik",
      icon: "💻",
      shortDesc:
        "Lab komputer modern dengan spesifikasi tinggi untuk praktik TKJ dan RPL.",
      description:
        "Laboratorium komputer dilengkapi dengan perangkat PC berperforma tinggi, akses internet berkecepatan tinggi, serta perangkat server dan jaringan standar industri untuk mendukung kegiatan praktikum pemrograman, jaringan, dan simulasi digital.",
      kegiatan: [
        "Praktikum Pemrograman",
        "Simulasi Jaringan Komputer",
        "Ujian Berbasis Komputer (UBK)",
      ],
      spesifikasi:
        "35 Unit PC Core i7, RAM 16GB, SSD, Koneksi Fiber Optic 100 Mbps",
    },
    {
      id: "bengkel-otomotif",
      title: "Bengkel & Workshop Otomotif",
      category: "praktik",
      icon: "🚗",
      shortDesc:
        "Area praktik TKR lengkap dengan alat servis mesin dan car lift.",
      description:
        "Bengkel otomotif dirancang menyerupai bengkel industri profesional. Menyediakan berbagai perlengkapan perbaikan mesin kendaraan ringan, sistem kelistrikan injeksi, alat ukur presisi, hingga lift hidrolik mobil.",
      kegiatan: [
        "Servis Mesin Kendaraan",
        "Diagnostik Engine Scanner",
        "Praktik Kelistrikan Otomotif",
      ],
      spesifikasi:
        "Car Lift Hidrolik, Engine Stand EFI, Kompresor Angin, Set Tool Box Lengkap",
    },
    {
      id: "bengkel-mesin",
      title: "Workshop Teknik Permesinan",
      category: "praktik",
      icon: "⚙️",
      shortDesc:
        "Dilengkapi mesin bubut, frais, dan mesin CNC berstandar industri.",
      description:
        "Tempat bagi siswa teknik mesin untuk mempelajari teknik manufaktur secara langsung menggunakan mesin konvensional maupun mesin kontrol numerik komputer (CNC) demi menghasilkan produk yang presisi.",
      kegiatan: [
        "Pbubutan Logam",
        "Pengoperasian Mesin CNC",
        "Praktik Pengelasan (Welding)",
      ],
      spesifikasi:
        "Mesin Bubut Konvensional, Mesin Frais, Mesin CNC Milling, Alat Las Listrik & Karbit",
    },
    {
      id: "perpustakaan",
      title: "Perpustakaan Digital & Baca",
      category: "umum",
      icon: "📚",
      shortDesc:
        "Pusat literasi dengan ribuan koleksi buku fisik dan akses e-library.",
      description:
        "Perpustakaan sekolah menyediakan suasana yang tenang, nyaman, dan ber-AC untuk membaca. Menyediakan buku pelajaran lengkap, referensi kejuruan, novel, serta katalog digital (e-library) untuk mempermudah riset siswa.",
      kegiatan: [
        "Literasi Membaca Mandiri",
        "Peminjaman Buku Paket & Referensi",
        "Diskusi Kelompok Kecil",
      ],
      spesifikasi:
        "Koleksi 3.000+ Judul Buku, Komputer Akses Katalog, Ruang Baca AC",
    },
    {
      id: "lapangan-olahraga",
      title: "Lapangan Olahraga Serbaguna",
      category: "umum",
      icon: "⚽",
      shortDesc:
        "Fasilitas olahraga outdoor untuk sepak bola, basket, dan voli.",
      description:
        "Area lapangan terbuka yang luas dan terawat untuk mendukung kesehatan fisik, kegiatan ekstrakurikuler olahraga, upacara bendera, serta ajang perlombaan antar kelas (classmeeting).",
      kegiatan: [
        "Pelajaran PJOK",
        "Ekstrakurikuler Basket & Futsal",
        "Upacara & Kegiatan Outdoor",
      ],
      spesifikasi:
        "Lapangan Standar Nasional untuk Futsal, Basket, dan Bola Voli",
    },
    {
      id: "ruang-ibadah",
      title: "Masjid / Ruang Ibadah Sekolah",
      category: "umum",
      icon: "🕌",
      shortDesc:
        "Tempat ibadah yang bersih, luas, dan nyaman bagi seluruh civitas.",
      description:
        "Sarana pembinaan kerohanian untuk membentuk karakter siswa yang religius, berakhlak mulia, serta tempat pelaksanaan kegiatan keagamaan rutin sekolah.",
      kegiatan: [
        "Sholat Berjamaah",
        "Kajian Keagamaan Islam",
        "Peringatan Hari Besar Islam",
      ],
      spesifikasi:
        "Kapasitas 300+ Jamaah, Mukena/Sajadah Bersedia, AC & Kipas Angin",
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
  const alamatSekolah = sekolah?.alamat || "Alamat sekolah belum tersedia";
  const teleponSekolah = sekolah?.no_telp || "Nomor telepon belum tersedia";
  const emailSekolah = sekolah?.email || "Email sekolah belum tersedia";

  // Filter fasilitas berdasarkan tab kategori dan search query
  const filteredFasilitas = dataFasilitas.filter((f) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      f.title.toLowerCase().includes(query) ||
      f.shortDesc.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query);

    if (activeCategory === "akademik") {
      return matchesSearch && f.category === "akademik";
    } else if (activeCategory === "praktik") {
      return matchesSearch && f.category === "praktik";
    } else if (activeCategory === "umum") {
      return matchesSearch && f.category === "umum";
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
            Memuat Fasilitas Sekolah
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
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-400 uppercase backdrop-blur-md">
            ✨ SARANA & PRASARANA LENGKAP
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Fasilitas{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Pembelajaran Modern
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Menunjang kegiatan belajar teori dan praktik siswa secara optimal
            dengan fasilitas pendukung berstandar dunia industri di{" "}
            {namaSekolah}.
          </p>

          {/* Search Bar Input */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/80 border border-slate-800 p-2 backdrop-blur-xl transition focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10">
              <span className="pl-4 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari fasilitas, laboratorium, atau ruang praktik..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Kategori Tab Filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "semua", label: "Semua Fasilitas" },
              { id: "akademik", label: "Akademik & Lab" },
              { id: "praktik", label: "Workshop & Praktik" },
              { id: "umum", label: "Umum & Olahraga" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                  activeCategory === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FASILITAS GRID CONTENT */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-6 mb-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Daftar Fasilitas
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan {filteredFasilitas.length} sarana prasarana sekolah
              </p>
            </div>
          </div>

          {filteredFasilitas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <span className="text-5xl">📂</span>
              <h3 className="mt-4 text-base font-bold text-slate-700">
                Fasilitas Tidak Ditemukan
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Coba gunakan kata kunci pencarian atau kategori lain.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFasilitas.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFasilitas(f)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                        {f.icon}
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-600 tracking-wider">
                        {f.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 text-xl font-black text-slate-900 transition group-hover:text-blue-600">
                      {f.title}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {f.shortDesc}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 group-hover:underline">
                      Lihat Rincian Fasilitas
                    </span>
                    <span className="text-xs font-bold text-blue-600 transition group-hover:translate-x-1">
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
              FASILITAS UNGGULAN KAMI
            </span>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Tertarik Melihat Langsung Lingkungan Sekolah?
            </h2>
            <p className="mt-2 text-blue-100 text-sm max-w-xl">
              Jadwalkan kunjungan Anda atau daftarkan diri segera melalui PPDB{" "}
              {namaSekolah}.
            </p>
          </div>
          <Link
            to="/ppdb"
            className="shrink-0 rounded-2xl bg-white px-8 py-4 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            Daftar PPDB Sekarang →
          </Link>
        </div>
      </section>

      {/* MODAL DETAIL FASILITAS */}
      {selectedFasilitas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-slate-100">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white">
              <button
                onClick={() => setSelectedFasilitas(null)}
                className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-md ring-2 ring-white/20">
                  {selectedFasilitas.icon}
                </div>
                <div>
                  <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold text-blue-300 ring-1 ring-inset ring-blue-400/30 uppercase">
                    {selectedFasilitas.category}
                  </span>
                  <h3 className="mt-1 text-xl font-black text-white">
                    {selectedFasilitas.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto bg-slate-50/50 text-sm text-slate-700">
              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  📌 Deskripsi Lengkap
                </strong>
                <p className="leading-relaxed text-xs sm:text-sm">
                  {selectedFasilitas.description}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  🛠️ Spesifikasi & Kelengkapan
                </strong>
                <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                  {selectedFasilitas.spesifikasi}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  🎯 Aktivitas / Kegiatan Utama
                </strong>
                <ul className="space-y-1.5">
                  {selectedFasilitas.kegiatan.map((k, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs font-semibold text-slate-800"
                    >
                      <span className="text-blue-600 font-bold">✓</span> {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedFasilitas(null)}
                className="w-full rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-600"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

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
