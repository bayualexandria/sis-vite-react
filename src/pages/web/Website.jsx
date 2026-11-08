import axios from "axios";
<<<<<<< HEAD
import { useEffect, useState, } from "react";
=======
import { useEffect, useState, useRef } from "react";
>>>>>>> 288fe97 (Updated)
import repo from "../../utils/repo";
import api from "../../utils/repositories";
import repoimages from "../../utils/repoimages";
import { Link } from "react-router-dom";
import NavbarSection from "./components/NavbarSection";
import FooterSection from "./components/FooterSection";
<<<<<<< HEAD
import FloatingChatAI from "./components/FloatingChatAI";
=======
>>>>>>> 288fe97 (Updated)

function Website() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Data Guru & API
<<<<<<< HEAD
  const [listGuru, setListGuru] = useState([]);
  const [searchQueryGuru, setSearchQueryGuru] = useState("");
  const [activeTabGuru, setActiveTabGuru] = useState("semua");
  const [selectedGuru, setSelectedGuru] = useState(null);

  // State untuk Floating Chat AI




  const userProfile = async () => {
    try {
      const [resSekolah, resGuru] = await Promise.all([
        axios.get(`${repo}api/profile-sekolah`),
        api.get("/guru/").catch(() => ({ data: { data: [] } })),
      ]);

      setSekolah(resSekolah.data?.data || null);

      const dataGuruMentah = resGuru.data?.data || resGuru.data || [];

      // Fungsi hierarki: Kepala Sekolah (1), Wakasek (2), Staf Inti (3), Guru (4), Lainnya (5)
      const getHierarkiBobot = (guru) => {
        const jabatan = (guru.status_guru || guru.position || "").toLowerCase();
        if (jabatan.includes("kepala sekolah")) return 1;
        if (jabatan.includes("wakil kepala") || jabatan.includes("wakasek"))
          return 2;
        if (
          jabatan.includes("kurikulum") ||
          jabatan.includes("kesiswaan") ||
          jabatan.includes("bendahara") ||
          jabatan.includes("tata usaha") ||
          jabatan.includes("tu")
        )
          return 3;
        if (jabatan.includes("guru") || jabatan.includes("pengajar")) return 4;
        return 5;
      };

      const dataGuruTerurut = [...dataGuruMentah].sort((a, b) => {
        return getHierarkiBobot(a) - getHierarkiBobot(b);
      });

      setListGuru(dataGuruTerurut);
=======

  // State untuk Floating Chat AI
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Halo! Saya Asisten AI Sekolah. Ada yang bisa saya bantu terkait PPDB, Jurusan, atau informasi guru/sekolah?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputChat, setInputChat] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const userProfile = async () => {
    try {
      const response = await axios.get(`${repo}api/profile-sekolah`);
      setSekolah(response.data?.data || null);
>>>>>>> 288fe97 (Updated)
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userProfile();
  }, []);

<<<<<<< HEAD

=======
  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatOpen]);
>>>>>>> 288fe97 (Updated)

  const namaSekolah = sekolah?.nama_sekolah || "SMK Nama Sekolah";
  const alamatSekolah = sekolah?.alamat || "Alamat sekolah belum tersedia";
  const teleponSekolah = sekolah?.no_telp || "Nomor telepon belum tersedia";
  const emailSekolah = sekolah?.email || "Email sekolah belum tersedia";
  const websiteSekolah = sekolah?.website || "Website belum tersedia";

<<<<<<< HEAD
  // Logika Filter Guru
  const pimpinanUtama = listGuru.filter((guru) => {
    const jabatan = (guru.status_guru || guru.position || "").toLowerCase();
    return jabatan.includes("kepala sekolah") || jabatan.includes("wakil");
  });

  const sisaGuruStaf = listGuru.filter((guru) => {
    const jabatan = (guru.status_guru || guru.position || "").toLowerCase();
    return !jabatan.includes("kepala sekolah") && !jabatan.includes("wakil");
  });

  const filterByQueryAndTab = (list) => {
    return list.filter((guru) => {
      const query = searchQueryGuru.toLowerCase();
      const nama = (guru.nama || guru.name || "").toLowerCase();
      const mapel = (
        guru.mapel ||
        guru.subject ||
        guru.bidang ||
        ""
      ).toLowerCase();
      const jabatan = (guru.status_guru || guru.position || "").toLowerCase();

      const matchesSearch =
        nama.includes(query) ||
        mapel.includes(query) ||
        jabatan.includes(query);

      if (activeTabGuru === "guru") {
        return (
          matchesSearch &&
          (jabatan.includes("guru") || jabatan.includes("pengajar"))
        );
      } else if (activeTabGuru === "staf") {
        return (
          matchesSearch &&
          (jabatan.includes("tata usaha") ||
            jabatan.includes("tu") ||
            jabatan.includes("bendahara") ||
            jabatan.includes("operator") ||
            jabatan.includes("staff"))
        );
      }
      return matchesSearch;
    });
=======
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: inputChat,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = inputChat;
    setInputChat("");
    setIsAiTyping(true);

    setTimeout(() => {
      let replyText =
        "Terima kasih telah bertanya! Untuk informasi lebih rinci silakan hubungi kontak kami atau kunjungi halaman PPDB.";

      const lower = currentInput.toLowerCase();
      if (lower.includes("ppdb") || lower.includes("daftar")) {
        replyText =
          "Pendaftaran PPDB 2026 sudah dibuka! Anda bisa mendaftar dengan klik tombol 'PPDB 2026' di menu atas.";
      } else if (lower.includes("jurusan") || lower.includes("prodi")) {
        replyText =
          "Kami memiliki beberapa kompetensi keahlian unggulan seperti TKJ, Teknik Mesin, TKR, RPL, Akuntansi, dan Konstruksi.";
      } else if (lower.includes("guru") || lower.includes("pengajar")) {
        replyText =
          "Kami memiliki tenaga pengajar profesional. Anda dapat melihat daftar lengkap guru beserta profilnya pada bagian menu Guru.";
      } else if (lower.includes("alamat") || lower.includes("lokasi")) {
        replyText = `Alamat kami berlokasi di: ${alamatSekolah}`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 1200);
>>>>>>> 288fe97 (Updated)
  };

  const filteredPimpinan = filterByQueryAndTab(pimpinanUtama);
  const filteredGuruStaf = filterByQueryAndTab(sisaGuruStaf);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen scroll-smooth bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
=======
    <div className="relative min-h-screen scroll-smooth bg-white text-slate-800">
>>>>>>> 288fe97 (Updated)
      {/* =========================================================
          NAVBAR
      ========================================================== */}
      <NavbarSection />

      {/* =========================================================
<<<<<<< HEAD
          HERO SECTION (Modern Gradient & Ambient Glow)
=======
          HERO & SECTIONS LAINNYA
>>>>>>> 288fe97 (Updated)
      ========================================================== */}
      <section
        id="home"
        className="relative scroll-mt-20 overflow-hidden bg-slate-950 py-28 text-white lg:py-36"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[700px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 h-[250px] w-[450px] rounded-full bg-indigo-600/15 blur-[110px] pointer-events-none" />

<<<<<<< HEAD
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
=======
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
>>>>>>> 288fe97 (Updated)
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold tracking-widest text-blue-400 uppercase backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              PENERIMAAN PESERTA DIDIK BARU 2026
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
              Wujudkan Masa Depan
              <span className="mt-2 block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Bersama Kami
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              {namaSekolah} hadir untuk mempersiapkan peserta didik menjadi
              generasi yang kompeten, berkarakter, mandiri, kreatif, dan siap
              menghadapi dunia kerja global.
            </p>

<<<<<<< HEAD
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/ppdb"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:-translate-y-1 hover:bg-blue-700"
=======
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/ppdb"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
>>>>>>> 288fe97 (Updated)
              >
                Daftar Sekarang <span className="ml-2">→</span>
              </Link>
              <a
                href="#jurusan"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 px-7 py-4 text-sm font-bold text-slate-300 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:border-blue-500 hover:text-white"
              >
                Lihat Jurusan
              </a>
            </div>

<<<<<<< HEAD
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-slate-800 pt-8 sm:grid-cols-4">
=======
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-slate-200 pt-8 sm:grid-cols-4">
>>>>>>> 288fe97 (Updated)
              <Stat number="10+" text="Tahun Berdiri" />
              <Stat number="500+" text="Siswa" />
              <Stat number="30+" text="Guru & Staff" />
              <Stat number="6+" text="Kompetensi Keahlian" />
            </div>
          </div>

          <div className="relative flex min-h-[430px] items-center justify-center">
<<<<<<< HEAD
            <div className="absolute h-72 w-72 rounded-full bg-blue-500/10 blur-2xl sm:h-96 sm:w-96" />
            <div className="absolute h-80 w-80 rounded-full border border-slate-800 sm:h-[420px] sm:w-[420px]" />
            <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-[2.5rem] border-8 border-slate-900 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-900/40 sm:h-80 sm:w-80">
=======
            <div className="absolute h-72 w-72 rounded-full bg-blue-100 sm:h-96 sm:w-96" />
            <div className="absolute h-80 w-80 rounded-full border border-blue-200 sm:h-[420px] sm:w-[420px]" />
            <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-[2.5rem] border-8 border-white bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-900/20 sm:h-80 sm:w-80">
>>>>>>> 288fe97 (Updated)
              <div className="text-center text-white">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 text-5xl backdrop-blur-md">
                  S
                </div>
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                  Sekolah
                </p>
                <p className="mt-1 text-xl font-black">Profesional</p>
              </div>
            </div>
            <HeroCard
              className="left-0 top-10 sm:left-2"
              icon="01"
              title="Kompetensi"
              text="Siap Kerja"
            />
            <HeroCard
              className="bottom-8 right-0 sm:right-2"
              icon="02"
              title="Prestasi"
              text="Siswa Berprestasi"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          PROFIL, JURUSAN, FASILITAS
      ========================================================== */}
      <section id="about" className="scroll-mt-20 bg-white py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="PROFIL SEKOLAH"
            title="Membangun Generasi Kompeten dan Berkarakter"
            description="Pendidikan kejuruan yang mempersiapkan siswa menghadapi dunia kerja, dunia industri, dan pendidikan tinggi."
          />
          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
<<<<<<< HEAD
            <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-900/10">
=======
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-900/10">
>>>>>>> 288fe97 (Updated)
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10" />
              <div className="relative flex h-full min-h-[350px] items-center justify-center">
                <div className="text-center text-white">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-6xl backdrop-blur-md">
                    S
                  </div>
                  <h3 className="mt-7 text-2xl font-black">{namaSekolah}</h3>
                  <p className="mt-2 text-sm text-blue-100">
                    Sekolah Menengah Kejuruan
                  </p>
                </div>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                TENTANG SEKOLAH
              </span>
<<<<<<< HEAD
              <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
=======
              <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
>>>>>>> 288fe97 (Updated)
                {namaSekolah}
              </h3>
              <p className="mt-5 leading-8 text-slate-600">
                {namaSekolah} merupakan lembaga pendidikan menengah kejuruan
                yang berkomitmen menghasilkan lulusan yang memiliki kompetensi
                sesuai dengan kebutuhan dunia kerja dan perkembangan teknologi.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <InfoBox
                  icon="01"
                  title="Visi"
                  text="Menjadi SMK yang unggul, kompeten, berkarakter, dan menghasilkan lulusan yang mampu bersaing."
                />
                <InfoBox
                  icon="02"
                  title="Misi"
                  text="Menyelenggarakan pendidikan kejuruan yang berkualitas sesuai kebutuhan dunia industri."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section
        id="jurusan"
        className="scroll-mt-20 bg-slate-50/50 py-24 lg:py-28"
      >
=======
      <section id="jurusan" className="scroll-mt-20 bg-slate-50 py-20 lg:py-24">
>>>>>>> 288fe97 (Updated)
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="KOMPETENSI KEAHLIAN"
            title="Pilih Jurusan Sesuai Minat dan Bakat"
            description="Kembangkan kemampuan dan keahlian untuk mempersiapkan masa depan."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Jurusan
              number="01"
              title="Teknik Komputer dan Jaringan"
              short="TKJ"
              description="Mempelajari jaringan komputer, sistem operasi, server, dan teknologi informasi."
            />
            <Jurusan
              number="02"
              title="Teknik Mesin"
              short="TM"
              description="Mempelajari teknologi mesin, perawatan, produksi, dan teknik manufaktur."
            />
            <Jurusan
              number="03"
              title="Teknik Kendaraan Ringan"
              short="TKR"
              description="Mempelajari teknologi kendaraan, mesin otomotif, dan perawatan kendaraan."
            />
            <Jurusan
              number="04"
              title="Teknik Konstruksi"
              short="TK"
              description="Mempelajari konstruksi bangunan, gambar teknik, dan pekerjaan konstruksi."
            />
            <Jurusan
              number="05"
              title="Akuntansi"
              short="AKL"
              description="Mempelajari pengelolaan keuangan, akuntansi, dan administrasi."
            />
            <Jurusan
              number="06"
              title="Rekayasa Perangkat Lunak"
              short="RPL"
              description="Mempelajari pemrograman, aplikasi, website, database, dan teknologi digital."
            />
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section id="fasilitas" className="scroll-mt-20 bg-white py-24 lg:py-28">
=======
      <section id="fasilitas" className="scroll-mt-20 bg-white py-20 lg:py-24">
>>>>>>> 288fe97 (Updated)
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="FASILITAS"
            title="Fasilitas Pembelajaran"
            description="Didukung fasilitas yang menunjang kegiatan belajar teori maupun praktik."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Facility
              number="01"
              title="Laboratorium Komputer"
              text="Laboratorium komputer untuk mendukung pembelajaran teknologi."
            />
            <Facility
              number="02"
              title="Workshop Praktik"
              text="Tempat praktik siswa sesuai kompetensi keahlian."
            />
            <Facility
              number="03"
              title="Perpustakaan"
              text="Menyediakan berbagai sumber belajar untuk siswa."
            />
            <Facility
              number="04"
              title="Lapangan Olahraga"
              text="Fasilitas olahraga dan kegiatan ekstrakurikuler."
            />
            <Facility
              number="05"
              title="Ruang Ibadah"
              text="Fasilitas untuk mendukung kegiatan keagamaan."
            />
            <Facility
              number="06"
              title="Internet Sekolah"
              text="Akses internet untuk mendukung pembelajaran digital."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
<<<<<<< HEAD
          SECTION GURU & STAF PROFESIONAL (Hierarki Terstruktur)
      ========================================================== */}
      <section
        id="guru"
        className="scroll-mt-20 bg-slate-50/80 py-24 lg:py-28 border-t border-slate-200/60"
      >
=======
          PANGGIL KOMPONEN GURU YANG DIPISAH DI SINI[cite: 1]
      ========================================================== */}

      <section id="kegiatan" className="scroll-mt-20 bg-white py-20 lg:py-24">
>>>>>>> 288fe97 (Updated)
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="TENAGA PENGAJAR & STAF"
            title="Civitas Akademika Profesional"
            description="Mengenal lebih dekat para pendidik berdedikasi tinggi dan staf ahli yang membimbing siswa."
          />

          {/* Search Bar & Tabs Filter Guru */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQueryGuru}
                onChange={(e) => setSearchQueryGuru(e.target.value)}
                placeholder="Cari guru, mapel, atau jabatan..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center w-full sm:w-auto">
              {[
                { id: "semua", label: "Semua Anggota" },
                { id: "guru", label: "Dewan Guru" },
                { id: "staf", label: "Staf & Administrasi" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabGuru(tab.id)}
                  className={`rounded-2xl px-5 py-3 text-xs font-bold transition-all duration-300 ${
                    activeTabGuru === tab.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-16 space-y-16">
            {filteredPimpinan.length === 0 && filteredGuruStaf.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
                <span className="text-4xl">📂</span>
                <h3 className="mt-3 text-base font-bold text-slate-700">
                  Tidak ada guru/staf yang ditemukan
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Coba ubah kata kunci pencarian Anda.
                </p>
              </div>
            ) : (
              <>
                {/* 1. Spotlight Pimpinan Sekolah (Atas) */}
                {filteredPimpinan.length > 0 &&
                  activeTabGuru === "semua" &&
                  searchQueryGuru === "" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-1.5 rounded-full bg-blue-600"></div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            Pimpinan Sekolah
                          </h3>
                          <p className="text-xs text-slate-500">
                            Jajaran pimpinan tertinggi institusi
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
                        {filteredPimpinan.map((guru, index) => (
                          <div
                            key={guru.id || index}
                            onClick={() => setSelectedGuru(guru)}
                            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xl shadow-slate-100 transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-2xl flex items-center gap-5"
                          >
                            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-blue-50 shadow-inner">
                              {guru.image_profile || guru.image ? (
                                <img
                                  src={`${repoimages}${guru.image_profile || guru.image}`}
                                  alt={guru.nama || guru.name}
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl font-black text-blue-600">
                                  {(guru.nama || guru.name || "G").charAt(0)}
                                </div>
                              )}
                              <span className="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow">
                                Top
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                {guru.status_guru ||
                                  guru.position ||
                                  "Pimpinan Sekolah"}
                              </span>
                              <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition">
                                {guru.nama || guru.name}
                              </h4>
                              <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                                {guru.mapel ||
                                  guru.subject ||
                                  "Manajemen & Strategi Akademik"}
                              </p>
                              <span className="inline-block text-xs font-bold text-blue-600 pt-1 group-hover:underline">
                                Lihat Profil →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 2. Dewan Guru & Staf Lainnya */}
                <div className="space-y-6">
                  {activeTabGuru === "semua" &&
                    searchQueryGuru === "" &&
                    filteredPimpinan.length > 0 && (
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                        <div className="h-7 w-1.5 rounded-full bg-slate-400"></div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            Dewan Guru & Staf
                          </h3>
                          <p className="text-xs text-slate-500">
                            Tenaga pendidik profesional dan staf pendukung
                          </p>
                        </div>
                      </div>
                    )}

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {(activeTabGuru === "semua" && searchQueryGuru === ""
                      ? filteredGuruStaf
                      : [...filteredPimpinan, ...filteredGuruStaf]
                    ).map((guru, index) => (
                      <div
                        key={guru.id || index}
                        onClick={() => setSelectedGuru(guru)}
                        className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-3xl font-black text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shadow-inner">
                            {guru.image_profile || guru.image ? (
                              <img
                                src={`${repoimages}${guru.image_profile || guru.image}`}
                                alt={guru.nama || guru.name}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              (guru.nama || guru.name || "G").charAt(0)
                            )}
                          </div>

                          <h4 className="mt-5 text-base font-bold text-slate-900 transition group-hover:text-blue-600">
                            {guru.nama || guru.name}
                          </h4>

                          <p className="mt-1 text-xs font-semibold text-blue-600">
                            {guru.status_guru ||
                              guru.position ||
                              "Guru Pengajar"}
                          </p>

                          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                            {guru.mapel ||
                              guru.subject ||
                              guru.bidang ||
                              "Staf & Administrasi Sekolah"}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <span className="inline-block text-xs font-bold text-slate-400 group-hover:text-blue-600 transition">
                            Lihat Detail →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="kegiatan" className="scroll-mt-20 bg-white py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="KEGIATAN SISWA"
            title="Aktif, Kreatif dan Berprestasi"
            description="Sekolah tidak hanya tentang belajar di dalam kelas."
          />
          <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <Activity number="01" title="Olahraga" />
            <Activity number="02" title="Seni & Budaya" />
            <Activity number="03" title="Pramuka" />
            <Activity number="04" title="Organisasi Siswa" />
          </div>
        </div>
      </section>

      <section
        id="prestasi"
<<<<<<< HEAD
        className="scroll-mt-20 bg-slate-50/50 py-24 lg:py-28"
=======
        className="scroll-mt-20 bg-slate-50 py-20 lg:py-24"
>>>>>>> 288fe97 (Updated)
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="PRESTASI"
            title="Prestasi Siswa"
            description="Pencapaian siswa menjadi bagian dari semangat untuk terus berkembang."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Achievement year="2026" title="Juara Kompetensi Siswa" />
            <Achievement year="2026" title="Juara Olahraga Tingkat Kabupaten" />
            <Achievement year="2025" title="Lomba Teknologi Informasi" />
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section id="berita" className="scroll-mt-20 bg-white py-24 lg:py-28">
=======
      <section id="berita" className="scroll-mt-20 bg-white py-20 lg:py-24">
>>>>>>> 288fe97 (Updated)
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="BERITA TERBARU"
            title="Informasi Sekolah"
            description="Berita dan informasi terbaru dari sekolah."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <News
              number="01"
              date="20 Agustus 2026"
              title="Penerimaan Peserta Didik Baru Tahun 2026"
            />
            <News
              number="02"
              date="18 Agustus 2026"
              title="Siswa Meraih Prestasi Tingkat Kabupaten"
            />
            <News
              number="03"
              date="15 Agustus 2026"
              title="Workshop Teknologi untuk Siswa"
            />
          </div>
        </div>
      </section>

      <section
        id="ppdb"
        className="scroll-mt-20 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-16"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="text-center lg:text-left">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-100 sm:text-sm">
              PENERIMAAN PESERTA DIDIK BARU
            </span>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Siapkan Masa Depanmu Bersama Kami
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-blue-100">
              Bergabunglah bersama siswa-siswi hebat dan kembangkan kompetensimu
              untuk masa depan.
            </p>
          </div>
          <Link
            to="/ppdb"
<<<<<<< HEAD
            className="shrink-0 rounded-2xl bg-white px-8 py-4 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
=======
            className="shrink-0 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
>>>>>>> 288fe97 (Updated)
          >
            Daftar Sekarang <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

<<<<<<< HEAD
      <section id="kontak" className="scroll-mt-20 bg-white py-24 lg:py-28">
=======
      <section id="kontak" className="scroll-mt-20 bg-white py-20 lg:py-24">
>>>>>>> 288fe97 (Updated)
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="KONTAK"
            title="Hubungi Sekolah"
            description="Silakan hubungi kami untuk mendapatkan informasi lebih lanjut."
          />
          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <ContactItem number="01" title="Alamat" text={alamatSekolah} />
              <ContactItem number="02" title="Telepon" text={teleponSekolah} />
              <ContactItem number="03" title="Email" text={emailSekolah} />
              <ContactItem number="04" title="Website" text={websiteSekolah} />
            </div>
<<<<<<< HEAD
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm sm:p-8">
=======
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
>>>>>>> 288fe97 (Updated)
              <div className="mb-7">
                <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                  HUBUNGI KAMI
                </span>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Kirim Pesan
                </h3>
              </div>
              <div className="space-y-4">
                <InputField type="text" placeholder="Nama Lengkap" />
                <InputField type="email" placeholder="Email" />
                <InputField type="text" placeholder="Nomor WhatsApp" />
                <textarea
                  rows="5"
                  placeholder="Pesan Anda..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Kirim Pesan <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />

      {/* =========================================================
<<<<<<< HEAD
          MODAL DETAIL PROFIL GURU (Glassmorphic Popup)
      ========================================================== */}
      {selectedGuru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-slate-100">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 text-white sm:p-8">
              <button
                onClick={() => setSelectedGuru(null)}
                className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10 p-1 shadow-inner backdrop-blur-md ring-2 ring-white/20">
                  {selectedGuru.image_profile || selectedGuru.image ? (
                    <img
                      src={`${repoimages}${selectedGuru.image_profile || selectedGuru.image}`}
                      alt="Foto"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white">
                      {(selectedGuru.nama || selectedGuru.name || "G").charAt(
                        0,
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1 pr-6">
                  <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold text-blue-300 ring-1 ring-inset ring-blue-400/30">
                    {selectedGuru.status_guru ||
                      selectedGuru.position ||
                      "Guru Pengajar"}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">
                    {selectedGuru.nama || selectedGuru.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 p-6 sm:p-8 bg-slate-50/50 max-h-[60vh] overflow-y-auto">
              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>📚</span> Mata Pelajaran / Bidang Keahlian
                </div>
                <p className="mt-1.5 text-sm font-bold text-slate-800">
                  {selectedGuru.mapel || selectedGuru.subject || "-"}
                </p>
=======
          FLOATING CHAT AI WIDGET
      ========================================================== */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 flex h-[480px] w-[350px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all sm:w-[380px]">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-bold backdrop-blur">
                  ✨
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Asisten AI Sekolah</h4>
                  <p className="text-[11px] text-blue-100">
                    Siap membantu 24/7
                  </p>
                </div>
>>>>>>> 288fe97 (Updated)
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-lg p-1 text-blue-100 hover:bg-white/10 hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

<<<<<<< HEAD
              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>🎓</span> Pendidikan Terakhir
                </div>
                <p className="mt-1.5 text-sm font-bold text-slate-800">
                  {selectedGuru.pendidikan || selectedGuru.education || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>📝</span> Biografi & Latar Belakang
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {selectedGuru.bio ||
                    selectedGuru.description ||
                    "Belum ada informasi biografi yang ditambahkan untuk pengajar ini."}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedGuru(null)}
                className="w-full rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-600"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FLOATING CHAT AI WIDGET
      ========================================================== */}
      <FloatingChatAI />
=======
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3 text-sm">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"}`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="mt-1 text-[10px] text-slate-400 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex items-start">
                  <div className="rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="border-t border-slate-200 bg-white p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="Ketik pertanyaan..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  disabled={!inputChat.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9-7-9-7-9 7 9 7zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 transition hover:scale-105"
        >
          {isChatOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500"></span>
              </span>
            </>
          )}
        </button>
      </div>
>>>>>>> 288fe97 (Updated)
    </div>
  );
}

/* ================================================================
<<<<<<< HEAD
   SUB COMPONENTS (Modern Professional Clean UI)
=======
   SUB COMPONENTS
>>>>>>> 288fe97 (Updated)
================================================================ */

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-600/20">
          S
        </div>
        <h2 className="mt-6 text-xl font-black text-slate-900">
          Memuat Website Sekolah
        </h2>
        <p className="mt-2 text-sm text-slate-500">Mohon tunggu sebentar...</p>
        <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase sm:text-sm">
        {label}
      </span>
<<<<<<< HEAD
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
=======
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
>>>>>>> 288fe97 (Updated)
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-7 text-slate-600">{description}</p>
      )}
    </div>
  );
}

function Stat({ number, text }) {
  return (
    <div>
<<<<<<< HEAD
      <strong className="block text-2xl font-black text-white">{number}</strong>
      <span className="mt-1 block text-xs leading-5 text-slate-400">
=======
      <strong className="block text-2xl font-black text-slate-950">
        {number}
      </strong>
      <span className="mt-1 block text-xs leading-5 text-slate-500">
>>>>>>> 288fe97 (Updated)
        {text}
      </span>
    </div>
  );
}

function HeroCard({ className, icon, title, text }) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-xs font-black text-blue-400">
        {icon}
      </div>
      <div>
<<<<<<< HEAD
        <strong className="block text-sm font-bold text-white">{title}</strong>
        <span className="text-xs text-slate-400">{text}</span>
=======
        <strong className="block text-sm font-bold text-slate-900">
          {title}
        </strong>
        <span className="text-xs text-slate-500">{text}</span>
>>>>>>> 288fe97 (Updated)
      </div>
    </div>
  );
}

function InfoBox({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 transition hover:border-blue-300 hover:bg-blue-50/40 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-600/20">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Jurusan({ number, title, short, description }) {
  return (
    <article className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xs font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          {number}
        </div>
<<<<<<< HEAD
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20">
=======
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
>>>>>>> 288fe97 (Updated)
          {short}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
      <a
        href="#jurusan"
        className="mt-5 inline-flex items-center font-bold text-blue-600 transition hover:text-blue-800"
      >
        Lihat Jurusan{" "}
        <span className="ml-2 transition group-hover:translate-x-1">→</span>
      </a>
    </article>
  );
}

function Facility({ number, title, text }) {
  return (
    <div className="group flex gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xs font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function Activity({ number, title }) {
  return (
    <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {number}
      </div>
      <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Kegiatan siswa untuk mengembangkan kemampuan, karakter, dan kreativitas.
      </p>
    </div>
  );
}

function Achievement({ year, title }) {
  return (
    <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-sm font-black text-amber-600">
          #
        </div>
        <div>
          <span className="text-sm font-bold text-blue-600">{year}</span>
          <h3 className="mt-1 font-bold leading-6 text-slate-900">{title}</h3>
        </div>
      </div>
    </div>
  );
}

function News({ number, date, title }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-5xl font-black text-white transition group-hover:from-blue-700 group-hover:to-indigo-800">
        {number}
      </div>
      <div className="p-6">
        <span className="text-sm font-medium text-blue-600">{date}</span>
        <h3 className="mt-3 text-xl font-bold leading-7 text-slate-900">
          {title}
        </h3>
        <a
          href="#berita"
          className="mt-5 inline-flex items-center font-bold text-blue-600 hover:text-blue-800"
        >
          Baca Selengkapnya <span className="ml-2">→</span>
        </a>
      </div>
    </article>
  );
}

function ContactItem({ number, title, text }) {
  return (
    <div className="flex gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/60 p-5 transition hover:border-blue-300 hover:bg-blue-50/40">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-600/20">
        {number}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="mt-1 break-words text-sm leading-6 text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
}

function InputField({ type, placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    />
  );
}

export default Website;
