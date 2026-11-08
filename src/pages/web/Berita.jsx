import { useState, useEffect } from "react";
import axios from "axios";
import NavbarSection from "./components/NavbarSection";
import FooterSection from "./components/FooterSection";
import FloatingChatAI from "./components/FloatingChatAI";
import repo from "../../utils/repo";

export default function BeritaPage() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedBerita, setSelectedBerita] = useState(null);

  // Data Berita & Informasi Sekolah
  const dataBerita = [
    {
      id: "news-1",
      title:
        "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka",
      category: "pengumuman",
      date: "20 Agustus 2026",
      author: "Humas Sekolah",
      featured: true,
      imageIcon: "📢",
      shortDesc:
        "Informasi lengkap mengenai jadwal, persyaratan, serta alur pendaftaran siswa baru untuk tahun ajaran mendatang.",
      content:
        "SMK Negeri/Swasta resmi membuka pendaftaran Penerimaan Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2026/2027. Calon siswa dapat memilih berbagai program keahlian unggulan seperti TKJ, RPL, TKR, TM, AKL, dan Teknik Konstruksi. Pendaftaran dapat dilakukan secara daring melalui website resmi atau datang langsung ke sekretariat PPDB sekolah. Jangan lewatkan kesempatan untuk bergabung bersama kami!",
    },
    {
      id: "news-2",
      title:
        "Siswa Jurusan RPL Meraih Juara 1 Lomba Aplikasi Mobile Tingkat Provinsi",
      category: "prestasi",
      date: "18 Agustus 2026",
      author: "Redaksi Tim Media",
      featured: false,
      imageIcon: "🏆",
      shortDesc:
        "Prestasi membanggakan kembali diukir oleh tim pengembang muda sekolah dalam ajang teknologi informasi.",
      content:
        "Tim pengembang perangkat lunak sekolah berhasil meraih posisi pertama dalam Kompetisi Pemrograman & Inovasi Aplikasi Mobile Tingkat Provinsi. Karya aplikasi berbasis AI yang diciptakan dinilai memiliki dampak sosial nyata bagi masyarakat luas.",
    },
    {
      id: "news-3",
      title:
        "Pelaksanaan Workshop Kesiapan Kerja & Orientasi Industri Bersama PT Mitra",
      category: "kegiatan",
      date: "15 Agustus 2026",
      author: "Guru BKK",
      featured: false,
      imageIcon: "💼",
      shortDesc:
        "Membekali siswa kelas XII dengan budaya kerja industri dan persiapan menghadapi wawancara kerja.",
      content:
        "Bursa Kerja Khusus (BKK) sekolah menyelenggarakan workshop kesiapan kerja dengan menghadirkan praktisi HRD dari perusahaan mitra industri. Siswa dilatih secara langsung mengenai pembuatan CV profesional, Etos kerja industri, serta simulasi wawancara kerja.",
    },
    {
      id: "news-4",
      title:
        "Peringatan Hari Kemerdekaan RI ke-81 Diwarnai Berbagai Lomba Seru",
      category: "kegiatan",
      date: "17 Agustus 2026",
      author: "OSIS",
      featured: false,
      imageIcon: "🇮🇩",
      shortDesc:
        "Kemeriahan upacara dan ajang perlombaan antar kelas dalam memperingati HUT RI.",
      content:
        "Seluruh civitas akademika berpartisipasi aktif dalam rangkaian peringatan HUT Kemerdekaan RI. Acara diawali dengan upacara bendera khidmat, dilanjutkan berbagai lomba kebersamaan yang digagas oleh pengurus OSIS.",
    },
    {
      id: "news-5",
      title:
        "Pentingnya Pembelajaran Berbasis Project (PBL) di Era Industri 4.0",
      category: "artikel",
      date: "10 Agustus 2026",
      author: "Tim Kurikulum",
      featured: false,
      imageIcon: "📚",
      shortDesc:
        "Artikel edukasi mengenai penerapan metode Project Based Learning dalam meningkatkan keterampilan siswa.",
      content:
        "Metode pembelajaran Project Based Learning (PBL) terbukti efektif mengasah kemampuan berpikir kritis, kolaborasi, dan pemecahan masalah bagi siswa sekolah kejuruan agar siap terjun ke dunia kerja nyata.",
    },
    {
      id: "news-6",
      title: "Modernisasi Peralatan Laboratorium Komputer & Workshop Otomotif",
      category: "pengumuman",
      date: "05 Agustus 2026",
      author: "Sarpras Sekolah",
      featured: false,
      imageIcon: "🛠️",
      shortDesc:
        "Peningkatan kualitas sarana prasarana sekolah demi menunjang praktik siswa secara maksimal.",
      content:
        "Sekolah kembali menambahkan unit PC spesifikasi tinggi di laboratorium komputer serta alat diagnostik scanner mesin terbaru di workshop otomotif untuk memastikan pembelajaran praktik sesuai standar industri saat ini.",
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

  // Berita Utama (Featured)
  const beritaUtama = dataBerita.find((b) => b.featured) || dataBerita[0];

  // Filter berita berdasarkan pencarian dan kategori
  const filteredBerita = dataBerita.filter((b) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(query) ||
      b.shortDesc.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query);

    if (activeCategory === "pengumuman") {
      return matchesSearch && b.category === "pengumuman";
    } else if (activeCategory === "kegiatan") {
      return matchesSearch && b.category === "kegiatan";
    } else if (activeCategory === "prestasi") {
      return matchesSearch && b.category === "prestasi";
    } else if (activeCategory === "artikel") {
      return matchesSearch && b.category === "artikel";
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
            Memuat Berita Sekolah
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
            📰 PUSAT INFORMASI & KABAR TERBARU
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Berita &{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Informasi Sekolah
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Dapatkan berita terkini seputar kegiatan, pengumuman resmi, prestasi
            siswa, serta perkembangan terbaru di {namaSekolah}.
          </p>

          {/* Search Bar Input */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/80 border border-slate-800 p-2 backdrop-blur-xl transition focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10">
              <span className="pl-4 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci berita, pengumuman, atau artikel..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Kategori Tab Filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "semua", label: "Semua Berita" },
              { id: "pengumuman", label: "Pengumuman" },
              { id: "kegiatan", label: "Kegiatan" },
              { id: "prestasi", label: "Prestasi" },
              { id: "artikel", label: "Artikel Edukasi" },
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

      {/* FEATURED NEWS / BERITA UTAMA */}
      {searchQuery === "" && activeCategory === "semua" && beritaUtama && (
        <section className="pt-20 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              onClick={() => setSelectedBerita(beritaUtama)}
              className="group cursor-pointer overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl transition hover:-translate-y-1 hover:shadow-blue-900/20 border border-slate-800 flex flex-col lg:flex-row items-center gap-8"
            >
              <div className="flex h-32 w-32 sm:h-40 sm:w-40 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-6xl backdrop-blur-md ring-2 ring-white/10">
                {beritaUtama.imageIcon}
              </div>
              <div className="space-y-3 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold text-blue-300 ring-1 ring-inset ring-blue-400/30 uppercase">
                    ⭐ Berita Utama
                  </span>
                  <span className="text-xs text-slate-400">
                    📅 {beritaUtama.date}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight group-hover:text-blue-300 transition">
                  {beritaUtama.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 max-w-3xl">
                  {beritaUtama.shortDesc}
                </p>
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-blue-400">
                  <span>Baca Selengkapnya</span>
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BERITA GRID CONTENT */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-6 mb-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Arsip Berita & Informasi
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan {filteredBerita.length} publikasi kabar sekolah
              </p>
            </div>
          </div>

          {filteredBerita.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <span className="text-5xl">📰</span>
              <h3 className="mt-4 text-base font-bold text-slate-700">
                Berita Tidak Ditemukan
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Coba gunakan kata kunci pencarian atau kategori lain.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBerita.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBerita(b)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Header Info & Category */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                        {b.imageIcon}
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-600 tracking-wider">
                        {b.category}
                      </span>
                    </div>

                    {/* Date & Author */}
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-2">
                      <span>📅 {b.date}</span>
                      <span>•</span>
                      <span>✍️ {b.author}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-slate-900 leading-snug transition group-hover:text-blue-600 line-clamp-2">
                      {b.title}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {b.shortDesc}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 group-hover:underline">
                      Baca Berita
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

      {/* MODAL BACA BERITA LENGKAP */}
      {selectedBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-slate-100">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white">
              <button
                onClick={() => setSelectedBerita(null)}
                className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-md ring-2 ring-white/20">
                  {selectedBerita.imageIcon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block rounded-full bg-blue-500/20 px-3 py-0.5 text-[10px] font-bold text-blue-300 uppercase">
                      {selectedBerita.category}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      📅 {selectedBerita.date}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
                    {selectedBerita.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto bg-slate-50/50 text-sm text-slate-700">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-200/60">
                <span>
                  Penulis:{" "}
                  <strong className="text-slate-700">
                    {selectedBerita.author}
                  </strong>
                </span>
              </div>

              <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm leading-relaxed text-slate-700 space-y-4">
                <p className="font-semibold text-slate-900 text-base">
                  {selectedBerita.shortDesc}
                </p>
                <p>{selectedBerita.content}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedBerita(null)}
                className="w-full rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-600"
              >
                Tutup Pembaca Berita
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
