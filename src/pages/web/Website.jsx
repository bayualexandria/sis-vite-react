import axios from "axios";
import { useEffect, useState } from "react";
import repo from "../../utils/repo";

function Website() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);

  const userProfile = async () => {
    try {
      const response = await axios.get(`${repo}api/profile-sekolah`);

      console.log("Data sekolah:", response.data);
      setSekolah(response.data.data);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-5 text-6xl">🏫</div>

          <h3 className="text-xl font-bold text-slate-800">
            Memuat Website Sekolah...
          </h3>

          <p className="mt-2 text-sm text-slate-500">Mohon tunggu sebentar</p>

          <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-800">
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-2xl shadow-md">
              🏫
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-extrabold text-slate-900 sm:text-base">
                {namaSekolah}
              </h2>

              <span className="hidden text-xs text-slate-500 sm:block">
                Sekolah Menengah Kejuruan
              </span>
            </div>
          </a>

          <div className="hidden items-center gap-5 lg:flex">
            <NavLink href="#home" text="Beranda" />
            <NavLink href="#about" text="Profil" />
            <NavLink href="#jurusan" text="Jurusan" />
            <NavLink href="#fasilitas" text="Fasilitas" />
            <NavLink href="#prestasi" text="Prestasi" />
            <NavLink href="#berita" text="Berita" />
            <NavLink href="#kontak" text="Kontak" />
          </div>

          <a
            href="#ppdb"
            className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
          >
            PPDB 2026
          </a>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-xs font-bold tracking-wide text-blue-700 sm:text-sm">
              🎓 PENERIMAAN PESERTA DIDIK BARU
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Wujudkan Masa Depan
              <span className="block text-blue-600">Bersama SMK</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {namaSekolah} merupakan sekolah kejuruan yang mempersiapkan
              peserta didik menjadi generasi yang kompeten, mandiri, kreatif,
              dan siap menghadapi dunia kerja.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#ppdb"
                className="rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Daftar Sekarang →
              </a>

              <a
                href="#jurusan"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-600"
              >
                Lihat Jurusan
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Stat number="10+" text="Tahun Berdiri" />
              <Stat number="500+" text="Siswa" />
              <Stat number="30+" text="Guru & Staff" />
              <Stat number="6+" text="Kompetensi Keahlian" />
            </div>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-blue-100 sm:h-96 sm:w-96" />

            <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-full border-8 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-[110px] shadow-2xl sm:h-80 sm:w-80 sm:text-[140px]">
              🏫
            </div>

            <HeroCard
              className="left-0 top-12 sm:left-4"
              icon="💻"
              title="Kompetensi"
              text="Siap Kerja"
            />

            <HeroCard
              className="bottom-10 right-0 sm:right-4"
              icon="🏆"
              title="Prestasi"
              text="Siswa Berprestasi"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PROFIL
      ===================================================== */}
      <section id="about" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            label="PROFIL SEKOLAH"
            title="Membangun Generasi Kompeten dan Berkarakter"
            description="Pendidikan kejuruan yang mempersiapkan siswa menghadapi dunia kerja, dunia industri, dan pendidikan tinggi."
          />

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner">
              <div className="text-[150px] drop-shadow-xl">🏫</div>
            </div>

            <div>
              <span className="text-sm font-bold tracking-widest text-blue-600">
                TENTANG SEKOLAH
              </span>

              <h2 className="mt-3 text-3xl font-black text-slate-900">
                {namaSekolah}
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                {namaSekolah} merupakan lembaga pendidikan menengah kejuruan
                yang berkomitmen menghasilkan lulusan yang memiliki kompetensi
                sesuai kebutuhan dunia kerja.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Pembelajaran dilaksanakan melalui teori, praktik, proyek,
                kegiatan organisasi siswa, serta pengalaman langsung yang
                mendukung kesiapan siswa memasuki dunia kerja.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <InfoBox
                  icon="🎯"
                  title="Visi"
                  text="Menjadi SMK yang unggul, kompeten, berkarakter, dan menghasilkan lulusan yang mampu bersaing."
                />

                <InfoBox
                  icon="💡"
                  title="Misi"
                  text="Menyelenggarakan pendidikan kejuruan yang berkualitas sesuai kebutuhan dunia industri."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          JURUSAN
      ===================================================== */}
      <section id="jurusan" className="scroll-mt-24 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            label="KOMPETENSI KEAHLIAN"
            title="Pilih Jurusan Sesuai Minat dan Bakat"
            description="Kembangkan kemampuan dan keahlian untuk mempersiapkan masa depan."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Jurusan
              icon="💻"
              title="Teknik Komputer dan Jaringan"
              short="TKJ"
              description="Mempelajari jaringan komputer, sistem operasi, server, dan teknologi informasi."
            />

            <Jurusan
              icon="⚙️"
              title="Teknik Mesin"
              short="TM"
              description="Mempelajari teknologi mesin, perawatan, produksi, dan teknik manufaktur."
            />

            <Jurusan
              icon="🚗"
              title="Teknik Kendaraan Ringan"
              short="TKR"
              description="Mempelajari teknologi kendaraan, mesin otomotif, dan perawatan kendaraan."
            />

            <Jurusan
              icon="🏗️"
              title="Teknik Konstruksi"
              short="TK"
              description="Mempelajari konstruksi bangunan, gambar teknik, dan pekerjaan konstruksi."
            />

            <Jurusan
              icon="📊"
              title="Akuntansi"
              short="AKL"
              description="Mempelajari pengelolaan keuangan, akuntansi, dan administrasi."
            />

            <Jurusan
              icon="📱"
              title="Rekayasa Perangkat Lunak"
              short="RPL"
              description="Mempelajari pemrograman, aplikasi, website, database, dan teknologi digital."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FASILITAS
      ===================================================== */}
      <section id="fasilitas" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            label="FASILITAS"
            title="Fasilitas Pembelajaran"
            description="Didukung fasilitas yang menunjang kegiatan belajar teori maupun praktik."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Facility
              icon="💻"
              title="Laboratorium Komputer"
              text="Laboratorium komputer untuk mendukung pembelajaran teknologi."
            />

            <Facility
              icon="🔧"
              title="Workshop Praktik"
              text="Tempat praktik siswa sesuai kompetensi keahlian."
            />

            <Facility
              icon="📚"
              title="Perpustakaan"
              text="Menyediakan berbagai sumber belajar untuk siswa."
            />

            <Facility
              icon="🏃"
              title="Lapangan Olahraga"
              text="Fasilitas olahraga dan kegiatan ekstrakurikuler."
            />

            <Facility
              icon="🕌"
              title="Ruang Ibadah"
              text="Fasilitas untuk mendukung kegiatan keagamaan."
            />

            <Facility
              icon="🌐"
              title="Internet Sekolah"
              text="Akses internet untuk mendukung pembelajaran digital."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          KEGIATAN
      ===================================================== */}
      <section id="kegiatan" className="scroll-mt-24 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            label="KEGIATAN SISWA"
            title="Aktif, Kreatif dan Berprestasi"
            description="Sekolah tidak hanya tentang belajar di kelas."
          />

          <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <Activity icon="⚽" title="Olahraga" />
            <Activity icon="🎭" title="Seni & Budaya" />
            <Activity icon="🏕️" title="Pramuka" />
            <Activity icon="🤝" title="Organisasi Siswa" />
          </div>
        </div>
      </section>

      {/* =====================================================
          PRESTASI
      ===================================================== */}
      <section id="prestasi" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            label="PRESTASI"
            title="Prestasi Siswa"
            description="Bangga dengan pencapaian dan prestasi siswa."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Achievement icon="🏆" title="Juara Kompetensi Siswa" year="2026" />

            <Achievement
              icon="🥇"
              title="Juara Olahraga Tingkat Kabupaten"
              year="2026"
            />

            <Achievement
              icon="🥈"
              title="Lomba Teknologi Informasi"
              year="2025"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          BERITA
      ===================================================== */}
      <section id="berita" className="scroll-mt-24 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            label="BERITA TERBARU"
            title="Informasi Sekolah"
            description="Berita dan informasi terbaru dari sekolah."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <News
              image="🎓"
              date="20 Agustus 2026"
              title="Penerimaan Peserta Didik Baru Tahun 2026"
            />

            <News
              image="🏆"
              date="18 Agustus 2026"
              title="Siswa Meraih Prestasi Tingkat Kabupaten"
            />

            <News
              image="💻"
              date="15 Agustus 2026"
              title="Workshop Teknologi untuk Siswa"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PPDB
      ===================================================== */}
      <section
        id="ppdb"
        className="scroll-mt-24 bg-gradient-to-r from-blue-600 to-indigo-700 py-16"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 text-white lg:flex-row lg:px-8">
          <div>
            <span className="text-sm font-bold tracking-wider text-blue-100">
              🎓 PENERIMAAN PESERTA DIDIK BARU
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Siapkan Masa Depanmu Bersama Kami
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-blue-100">
              Bergabunglah bersama siswa-siswi hebat dan kembangkan kompetensimu
              untuk masa depan.
            </p>
          </div>

          <button className="shrink-0 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
            Daftar Sekarang →
          </button>
        </div>
      </section>

      {/* =====================================================
          KONTAK
      ===================================================== */}
      <section id="kontak" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            label="KONTAK"
            title="Hubungi Sekolah"
            description="Silakan hubungi kami untuk mendapatkan informasi lebih lanjut."
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div className="space-y-5">
              <ContactItem
                icon="📍"
                title="Alamat"
                text={sekolah?.alamat || "Alamat sekolah belum tersedia"}
              />

              <ContactItem
                icon="📱"
                title="Telepon"
                text={sekolah?.telepon || "Nomor telepon belum tersedia"}
              />

              <ContactItem
                icon="✉️"
                title="Email"
                text={sekolah?.email || "Email belum tersedia"}
              />

              <ContactItem
                icon="🌐"
                title="Website"
                text={sekolah?.website || "Website belum tersedia"}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <input
                  type="text"
                  placeholder="Nomor WhatsApp"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <textarea
                  rows="5"
                  placeholder="Pesan Anda..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-blue-700">
                  Kirim Pesan →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl">
                🏫
              </div>

              <div>
                <h2 className="font-bold text-white">{namaSekolah}</h2>

                <span className="text-xs text-slate-400">
                  Sekolah Menengah Kejuruan
                </span>
              </div>
            </div>

            <p className="mt-5 max-w-md leading-7 text-slate-400">
              Mempersiapkan generasi muda yang kompeten, berkarakter, mandiri
              dan siap menghadapi dunia kerja.
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Menu</h3>

            <div className="grid gap-3">
              <FooterLink href="#home" text="Beranda" />
              <FooterLink href="#about" text="Profil" />
              <FooterLink href="#jurusan" text="Jurusan" />
              <FooterLink href="#fasilitas" text="Fasilitas" />
              <FooterLink href="#berita" text="Berita" />
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Kontak</h3>

            <div className="space-y-3 text-sm leading-6 text-slate-400">
              <p>📍 {sekolah?.alamat || "Alamat belum tersedia"}</p>

              <p>📱 {sekolah?.telepon || "Nomor belum tersedia"}</p>

              <p>✉️ {sekolah?.email || "Email belum tersedia"}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-5 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {namaSekolah}. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function NavLink({ href, text }) {
  return (
    <a
      href={href}
      className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
    >
      {text}
    </a>
  );
}

function SectionHeader({ label, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="text-sm font-bold tracking-widest text-blue-600">
        {label}
      </span>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
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
      <strong className="block text-2xl font-black text-slate-900">
        {number}
      </strong>

      <span className="mt-1 block text-xs leading-5 text-slate-500">
        {text}
      </span>
    </div>
  );
}

function HeroCard({ className, icon, title, text }) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-xl ${className}`}
    >
      <div className="text-2xl">{icon}</div>

      <div>
        <strong className="block text-sm font-bold text-slate-800">
          {title}
        </strong>

        <span className="text-xs text-slate-500">{text}</span>
      </div>
    </div>
  );
}

function InfoBox({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
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

function Jurusan({ icon, title, short, description }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl transition group-hover:scale-110">
          {icon}
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          {short}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-3 leading-7 text-slate-600">{description}</p>

      <a
        href="#jurusan"
        className="mt-5 inline-block font-bold text-blue-600 transition hover:text-blue-800"
      >
        Lihat Jurusan →
      </a>
    </div>
  );
}

function Facility({ icon, title, text }) {
  return (
    <div className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-3xl transition group-hover:scale-110">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function Activity({ icon, title }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div className="text-5xl transition group-hover:scale-110">{icon}</div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Kegiatan siswa untuk mengembangkan kemampuan, karakter dan kreativitas.
      </p>
    </div>
  );
}

function Achievement({ icon, title, year }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-4xl">
        {icon}
      </div>

      <div>
        <span className="text-sm font-bold text-blue-600">{year}</span>

        <h3 className="mt-1 font-bold text-slate-900">{title}</h3>
      </div>
    </div>
  );
}

function News({ image, date, title }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-7xl transition group-hover:scale-[1.02]">
        {image}
      </div>

      <div className="p-6">
        <span className="text-sm font-medium text-blue-600">{date}</span>

        <h3 className="mt-3 text-xl font-bold text-slate-900">{title}</h3>

        <a
          href="#berita"
          className="mt-5 inline-block font-bold text-blue-600 hover:text-blue-800"
        >
          Baca Selengkapnya →
        </a>
      </div>
    </article>
  );
}

function ContactItem({ icon, title, text }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
        {icon}
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
