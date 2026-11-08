import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarSection from "./components/NavbarSection";
import FooterSection from "./components/FooterSection";
import FloatingChatAI from "./components/FloatingChatAI";
import repo from "../../utils/repo";

export default function JurusanPage() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState(null);

  // Data Kompetensi Keahlian / Jurusan Unggulan
  const dataJurusan = [
    {
      id: "tkj",
      short: "TKJ",
      title: "Teknik Komputer & Jaringan",
      icon: "💻",
      category: "Teknologi Informasi",
      description:
        "Mempelajari cara merakit komputer, menginstalasi jaringan LAN/WAN, mengkonfigurasi server, hingga keamanan siber.",
      prospek: [
        "Network Engineer",
        "System Administrator",
        "IT Support",
        "Cyber Security Analyst",
      ],
      materi: [
        "Jaringan Komputer Dasardan Lanjut",
        "Administrasi Server (Linux & Windows)",
        "MikroTik & Cisco Networking",
        "Keamanan Jaringan & Cloud Computing",
      ],
      fasilitas: "Laboratorium Komputer Jaringan & Server Standard Industri",
    },
    {
      id: "rpl",
      short: "RPL",
      title: "Rekayasa Perangkat Lunak",
      icon: "⚡",
      category: "Teknologi Informasi",
      description:
        "Mempelajari pembuatan aplikasi web, mobile, desktop, pengelolaan basis data (database), serta rekayasa sistem perangkat lunak.",
      prospek: [
        "Web Developer",
        "Mobile App Developer",
        "Software Engineer",
        "Database Administrator",
      ],
      materi: [
        "Pemrograman Web (HTML, CSS, JS, React, Laravel)",
        "Pemrograman Mobile (Flutter / Android)",
        "Basis Data & SQL",
        "UI/UX Design & Software Testing",
      ],
      fasilitas: "Laboratorium Coding & Software Development Modern",
    },
    {
      id: "tkr",
      short: "TKR",
      title: "Teknik Kendaraan Ringan",
      icon: "🚗",
      category: "Otomotif",
      description:
        "Mempelajari perawatan dan perbaikan mesin otomotif, sistem kelistrikan mobil, chasis, serta teknologi EFI/Injeksi terkini.",
      prospek: [
        "Mekanik Otomotif",
        "Service Advisor",
        "Teknisi BENGKEL Resmi",
        "Wirausaha Bengkel",
      ],
      materi: [
        "Pemeliharaan Mesin Kendaraan Ringan (PMKR)",
        "Sistem Injeksi & Kelistrikan Otomotif",
        "Pemeliharaan Chasis & Pemindah Tenaga",
        "Diagnosa Kerusakan Mesin Modern (Scanner)",
      ],
      fasilitas:
        "Bengkel Otomotif Standar Industri dengan Car Lift & Engine Scanner",
    },
    {
      id: "tm",
      short: "TM",
      title: "Teknik Mesin",
      icon: "⚙️",
      category: "Manufaktur",
      description:
        "Mempelajari pengoperasian mesin perkakas (bubut, frais), teknik pengelasan, hingga pembuatan komponen presisi dengan Mesin CNC.",
      prospek: [
        "Operator Mesin CNC",
        "Teknisi Manufaktur",
        "Quality Control (QC)",
        "Drafter Teknik",
      ],
      materi: [
        "Teknik Pemesinan Bubut & Frais",
        "Pemrograman & Pengoperasian Mesin CNC",
        "Gambar Teknik & Desain CAD (AutoCAD/SolidWorks)",
        "Pengelasan & Fabrikasi Logam",
      ],
      fasilitas: "Bengkel Permesinan Lengkap dengan Mesin Bubut, Frais, & CNC",
    },
    {
      id: "akl",
      short: "AKL",
      title: "Akuntansi & Keuangan Lembaga",
      icon: "📊",
      category: "Bisnis & Manajemen",
      description:
        "Mempelajari pencatatan transaksi keuangan, penyusunan laporan keuangan manual maupun berbasis aplikasi komputer akuntansi (MYOB/Accurate).",
      prospek: [
        "Staf Akuntansi",
        "Kasir / Teller Bank",
        "Staf Administrasi Keuangan",
        "Junior Auditor",
      ],
      materi: [
        "Akuntansi Keuangan & Perusahaan",
        "Komputer Akuntansi (MYOB & Accurate)",
        "Administrasi Perpajakan",
        "Pengelolaan Kas & Perbankan Dasar",
      ],
      fasilitas: "Laboratorium Komputer Akuntansi & Mini Bank Simulasi",
    },
    {
      id: "tk",
      short: "TK",
      title: "Teknik Konstruksi & Perumahan",
      icon: "🏗️",
      category: "Teknik Bangunan",
      description:
        "Mempelajari perencanaan denah bangunan, perhitungan anggaran biaya (RAB), pemetaan lokasi, serta teknik pelaksanaan konstruksi.",
      prospek: [
        "Drafter Arsitektur",
        "Quantity Surveyor (QS)",
        "Pelaksana Lapangan",
        "Estimator Biaya",
      ],
      materi: [
        "Gambar Teknik Bangunan 2D & 3D (AutoCAD/Revit)",
        "Rencana Anggaran Biaya (RAB)",
        "Teknik Pengukuran Tanah (Total Station)",
        "Konstruksi Beton & Baja",
      ],
      fasilitas: "Laboratorium AutoCAD & Peralatan Pengukuran Tanah Digital",
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

  // Filter jurusan berdasarkan pencarian
  const filteredJurusan = dataJurusan.filter((j) => {
    const query = searchQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(query) ||
      j.short.toLowerCase().includes(query) ||
      j.category.toLowerCase().includes(query) ||
      j.description.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-600/20 animate-pulse">
            S
          </div>
          <h2 className="mt-6 text-xl font-black text-slate-900">
            Memuat Jurusan Sekolah
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
            ✨ KOMPETENSI KEAHLIAN UNGGULAN
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Program &{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Jurusan Keahlian
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Pilihlah keahlian sesuai bakat dan minatmu untuk siap kerja,
            wirausaha, atau melanjutkan ke perguruan tinggi di {namaSekolah}.
          </p>

          {/* Search Bar Input */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/80 border border-slate-800 p-2 backdrop-blur-xl transition focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10">
              <span className="pl-4 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jurusan, bidang keahlian, atau keterampilan..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* JURUSAN GRID CONTENT */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-6 mb-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Daftar Jurusan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan {filteredJurusan.length} program keahlian unggulan
              </p>
            </div>
          </div>

          {filteredJurusan.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <span className="text-5xl">🔍</span>
              <h3 className="mt-4 text-base font-bold text-slate-700">
                Jurusan Tidak Ditemukan
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Coba gunakan kata kunci pencarian yang lain.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJurusan.map((j) => (
                <div
                  key={j.id}
                  onClick={() => setSelectedJurusan(j)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Badge & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                        {j.icon}
                      </div>
                      <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-black text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        {j.short}
                      </span>
                    </div>

                    {/* Title & Category */}
                    <span className="mt-6 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {j.category}
                    </span>
                    <h3 className="mt-1 text-xl font-black text-slate-900 transition group-hover:text-blue-600">
                      {j.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {j.description}
                    </p>

                    {/* Prospek Kerja Badges */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Prospek Karir Utama:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {j.prospek.slice(0, 3).map((p, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 group-hover:underline">
                      Pelajari Rincian Jurusan
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

      {/* BANNER PPDB CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
              PENDAFTARAN SISWA BARU 2026
            </span>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Sudah Menentukan Jurusan Pilihanmu?
            </h2>
            <p className="mt-2 text-blue-100 text-sm max-w-xl">
              Daftar sekarang di PPDB {namaSekolah} dan amankan kuotamu di
              jurusan impian!
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

      {/* MODAL DETAIL JURUSAN */}
      {selectedJurusan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-slate-100">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white">
              <button
                onClick={() => setSelectedJurusan(null)}
                className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-md ring-2 ring-white/20">
                  {selectedJurusan.icon}
                </div>
                <div>
                  <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold text-blue-300 ring-1 ring-inset ring-blue-400/30">
                    {selectedJurusan.short} • {selectedJurusan.category}
                  </span>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    {selectedJurusan.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto bg-slate-50/50 text-sm text-slate-700">
              <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  📌 Gambaran Umum
                </strong>
                <p className="leading-relaxed">{selectedJurusan.description}</p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  📖 Materi Keahlian Utama
                </strong>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {selectedJurusan.materi.map((m, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs font-semibold text-slate-800"
                    >
                      <span className="text-blue-600 font-bold">✓</span> {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  💼 Prospek Karir Lulusan
                </strong>
                <div className="flex flex-wrap gap-2">
                  {selectedJurusan.prospek.map((p, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 border border-blue-100"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                <strong className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  🏫 Fasilitas Pendukung Praktik
                </strong>
                <p className="font-semibold text-slate-800 text-xs">
                  {selectedJurusan.fasilitas}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <Link
                to="/ppdb"
                className="flex-1 rounded-2xl bg-blue-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition"
              >
                Pilih Jurusan Ini di PPDB →
              </Link>
              <button
                onClick={() => setSelectedJurusan(null)}
                className="rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Tutup
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
