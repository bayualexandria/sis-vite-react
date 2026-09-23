import axios from "axios";
import { useEffect, useState } from "react";
import repo from "../../utils/repo";
import { Link } from "react-router-dom";

function Website() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  const userProfile = async () => {
    try {
      const response = await axios.get(`${repo}api/profile-sekolah`);

      setSekolah(response.data?.data || null);
    } catch (error) {
      console.error("Gagal mengambil data sekolah:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userProfile();
  }, []);

  const namaSekolah = sekolah?.nama_sekolah || "SMK Nama Sekolah";

  const alamatSekolah = sekolah?.alamat || "Alamat sekolah belum tersedia";

  const teleponSekolah = sekolah?.telepon || "Nomor telepon belum tersedia";

  const emailSekolah = sekolah?.email || "Email sekolah belum tersedia";

  const websiteSekolah = sekolah?.website || "Website belum tersedia";

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-800">
      {/* =========================================================
          NAVBAR
      ========================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="#home"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-3"
          >
            {sekolah.nama_sekolah ? (
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
                  src={repo + sekolah.image_profile}
                  alt="Logo Pendidikan"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20">
                S
              </div>
            )}

            <div className="min-w-0">
              <h1 className="truncate text-sm font-extrabold text-slate-900 sm:text-base">
                {namaSekolah}
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Sekolah Menengah Kejuruan
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <NavLink href="#home" text="Beranda" />
            <NavLink href="#about" text="Profil" />
            <NavLink href="#jurusan" text="Jurusan" />
            <NavLink href="#fasilitas" text="Fasilitas" />
            <NavLink href="#prestasi" text="Prestasi" />
            <NavLink href="#berita" text="Berita" />
            <NavLink href="#kontak" text="Kontak" />
          </nav>

          {/* Desktop CTA */}
          <Link
            to="/ppdb"
            className="hidden shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl lg:inline-flex"
          >
            PPDB 2026
          </Link>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 lg:hidden"
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
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
            mobileMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="grid gap-1">
              <MobileNavLink
                href="#home"
                text="Beranda"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="#about"
                text="Profil"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="#jurusan"
                text="Jurusan"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="#fasilitas"
                text="Fasilitas"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="#prestasi"
                text="Prestasi"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="#berita"
                text="Berita"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="#kontak"
                text="Kontak"
                onClick={closeMobileMenu}
              />

              <a
                href="/ppdb"
                onClick={closeMobileMenu}
                className="mt-2 rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white"
              >
                PPDB 2026
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section
        id="home"
        className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          {/* Hero Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold tracking-wide text-blue-700 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              PENERIMAAN PESERTA DIDIK BARU 2026
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Wujudkan Masa Depan
              <span className="mt-2 block text-blue-600">Bersama Kami</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {namaSekolah} hadir untuk mempersiapkan peserta didik menjadi
              generasi yang kompeten, berkarakter, mandiri, kreatif, dan siap
              menghadapi dunia kerja.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ppdb"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Daftar Sekarang
                <span className="ml-2">→</span>
              </a>

              <a
                href="#jurusan"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600"
              >
                Lihat Jurusan
              </a>
            </div>

            {/* Statistics */}
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-slate-200 pt-8 sm:grid-cols-4">
              <Stat number="10+" text="Tahun Berdiri" />
              <Stat number="500+" text="Siswa" />
              <Stat number="30+" text="Guru & Staff" />
              <Stat number="6+" text="Kompetensi Keahlian" />
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative flex min-h-[430px] items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-blue-100 sm:h-96 sm:w-96" />

            <div className="absolute h-80 w-80 rounded-full border border-blue-200 sm:h-[420px] sm:w-[420px]" />

            <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-[2.5rem] border-8 border-white bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-900/20 sm:h-80 sm:w-80">
              <div className="text-center text-white">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 text-5xl backdrop-blur">
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
          PROFIL
      ========================================================== */}
      <section id="about" className="scroll-mt-20 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="PROFIL SEKOLAH"
            title="Membangun Generasi Kompeten dan Berkarakter"
            description="Pendidikan kejuruan yang mempersiapkan siswa menghadapi dunia kerja, dunia industri, dan pendidikan tinggi."
          />

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-900/10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10" />

              <div className="relative flex h-full min-h-[350px] items-center justify-center">
                <div className="text-center text-white">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-6xl backdrop-blur">
                    S
                  </div>

                  <h3 className="mt-7 text-2xl font-black">{namaSekolah}</h3>

                  <p className="mt-2 text-sm text-blue-100">
                    Sekolah Menengah Kejuruan
                  </p>
                </div>
              </div>
            </div>

            {/* About Content */}
            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-blue-600">
                TENTANG SEKOLAH
              </span>

              <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {namaSekolah}
              </h3>

              <p className="mt-5 leading-8 text-slate-600">
                {namaSekolah} merupakan lembaga pendidikan menengah kejuruan
                yang berkomitmen menghasilkan lulusan yang memiliki kompetensi
                sesuai dengan kebutuhan dunia kerja dan perkembangan teknologi.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Pembelajaran dilaksanakan melalui teori, praktik, proyek,
                kegiatan organisasi siswa, serta pengalaman langsung yang
                mendukung kesiapan siswa memasuki dunia kerja.
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

      {/* =========================================================
          JURUSAN
      ========================================================== */}
      <section id="jurusan" className="scroll-mt-20 bg-slate-50 py-20 lg:py-24">
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

      {/* =========================================================
          FASILITAS
      ========================================================== */}
      <section id="fasilitas" className="scroll-mt-20 bg-white py-20 lg:py-24">
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
          KEGIATAN
      ========================================================== */}
      <section
        id="kegiatan"
        className="scroll-mt-20 bg-slate-50 py-20 lg:py-24"
      >
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

      {/* =========================================================
          PRESTASI
      ========================================================== */}
      <section id="prestasi" className="scroll-mt-20 bg-white py-20 lg:py-24">
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

      {/* =========================================================
          BERITA
      ========================================================== */}
      <section id="berita" className="scroll-mt-20 bg-slate-50 py-20 lg:py-24">
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

      {/* =========================================================
          PPDB
      ========================================================== */}
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

          <button
            type="button"
            className="shrink-0 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            Daftar Sekarang
            <span className="ml-2">→</span>
          </button>
        </div>
      </section>

      {/* =========================================================
          KONTAK
      ========================================================== */}
      <section id="kontak" className="scroll-mt-20 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="KONTAK"
            title="Hubungi Sekolah"
            description="Silakan hubungi kami untuk mendapatkan informasi lebih lanjut."
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-4">
              <ContactItem number="01" title="Alamat" text={alamatSekolah} />

              <ContactItem number="02" title="Telepon" text={teleponSekolah} />

              <ContactItem number="03" title="Email" text={emailSekolah} />

              <ContactItem number="04" title="Website" text={websiteSekolah} />
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <span className="text-xs font-bold tracking-[0.2em] text-blue-600">
                  HUBUNGI KAMI
                </span>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Kirim Pesan
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Silakan isi formulir berikut untuk menghubungi pihak sekolah.
                </p>
              </div>

              <div className="space-y-4">
                <InputField type="text" placeholder="Nama Lengkap" />

                <InputField type="email" placeholder="Email" />

                <InputField type="text" placeholder="Nomor WhatsApp" />

                <textarea
                  rows="5"
                  placeholder="Pesan Anda..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Kirim Pesan
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {/* School */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
                S
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-bold text-white">{namaSekolah}</h3>

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

          {/* Menu */}
          <div>
            <h3 className="mb-5 font-bold text-white">Menu</h3>

            <div className="grid gap-3">
              <FooterLink href="#home" text="Beranda" />
              <FooterLink href="#about" text="Profil" />
              <FooterLink href="#jurusan" text="Jurusan" />
              <FooterLink href="#fasilitas" text="Fasilitas" />
              <FooterLink href="#prestasi" text="Prestasi" />
              <FooterLink href="#berita" text="Berita" />
              <FooterLink href="#kontak" text="Kontak" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-bold text-white">Kontak</h3>

            <div className="space-y-4 text-sm leading-6 text-slate-400">
              <p>{alamatSekolah}</p>

              <p>{teleponSekolah}</p>

              <p className="break-all">{emailSekolah}</p>

              <p className="break-all">{websiteSekolah}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
          © {new Date().getFullYear()} {namaSekolah}. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

/* ================================================================
   LOADING
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

/* ================================================================
   NAVIGATION
================================================================ */

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
    >
      {text}
    </a>
  );
}

/* ================================================================
   SECTION HEADER
================================================================ */

function SectionHeader({ label, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="text-xs font-bold tracking-[0.2em] text-blue-600 sm:text-sm">
        {label}
      </span>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 leading-7 text-slate-600">{description}</p>
      )}
    </div>
  );
}

/* ================================================================
   STAT
================================================================ */

function Stat({ number, text }) {
  return (
    <div>
      <strong className="block text-2xl font-black text-slate-950">
        {number}
      </strong>

      <span className="mt-1 block text-xs leading-5 text-slate-500">
        {text}
      </span>
    </div>
  );
}

/* ================================================================
   HERO CARD
================================================================ */

function HeroCard({ className, icon, title, text }) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">
        {icon}
      </div>

      <div>
        <strong className="block text-sm font-bold text-slate-900">
          {title}
        </strong>

        <span className="text-xs text-slate-500">{text}</span>
      </div>
    </div>
  );
}

/* ================================================================
   INFO BOX
================================================================ */

function InfoBox({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/50">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
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

/* ================================================================
   JURUSAN
================================================================ */

function Jurusan({ number, title, short, description }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          {number}
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          {short}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-3 leading-7 text-slate-600">{description}</p>

      <a
        href="#jurusan"
        className="mt-5 inline-flex items-center font-bold text-blue-600 transition hover:text-blue-800"
      >
        Lihat Jurusan
        <span className="ml-2 transition group-hover:translate-x-1">→</span>
      </a>
    </article>
  );
}

/* ================================================================
   FACILITY
================================================================ */

function Facility({ number, title, text }) {
  return (
    <div className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {number}
      </div>

      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

/* ================================================================
   ACTIVITY
================================================================ */

function Activity({ number, title }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
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

/* ================================================================
   ACHIEVEMENT
================================================================ */

function Achievement({ year, title }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
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

/* ================================================================
   NEWS
================================================================ */

function News({ number, date, title }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
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
          Baca Selengkapnya
          <span className="ml-2">→</span>
        </a>
      </div>
    </article>
  );
}

/* ================================================================
   CONTACT
================================================================ */

function ContactItem({ number, title, text }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/40">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
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

/* ================================================================
   INPUT
================================================================ */

function InputField({ type, placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    />
  );
}

/* ================================================================
   FOOTER LINK
================================================================ */

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

export default Website;
