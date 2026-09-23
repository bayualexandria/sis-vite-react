import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  GraduationCap,
  Menu,
  School,
  UserRoundPlus,
  Users,
} from "lucide-react";
import repo from "../../utils/repo";

export const WebsitePPDB = () => {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);

  const userProfile = async () => {
    try {
      const response = await axios.get(`${repo}api/profile-sekolah`);

      console.log("Data sekolah:", response.data);

      setSekolah(response.data?.data || null);
    } catch (error) {
      console.error("Gagal mengambil data sekolah:", error);
      setSekolah(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userProfile();
  }, []);

  const stats = [
    {
      value: "250+",
      label: "Pendaftar",
    },
    {
      value: "120",
      label: "Kuota Siswa",
    },
    {
      value: "2026/2027",
      label: "Tahun Ajaran",
    },
    {
      value: "100%",
      label: "Pendaftaran Online",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: UserRoundPlus,
      title: "Buat Akun",
      description:
        "Daftarkan akun orang tua atau wali menggunakan email dan nomor telepon aktif.",
    },
    {
      number: "02",
      icon: ClipboardList,
      title: "Isi Formulir",
      description:
        "Lengkapi data calon siswa, orang tua, alamat, dan informasi pendukung lainnya.",
    },
    {
      number: "03",
      icon: FileText,
      title: "Upload Dokumen",
      description: "Unggah dokumen persyaratan PPDB sesuai ketentuan sekolah.",
    },
    {
      number: "04",
      icon: FileCheck2,
      title: "Verifikasi",
      description:
        "Admin sekolah akan melakukan pemeriksaan data dan dokumen pendaftaran.",
    },
    {
      number: "05",
      icon: BadgeCheck,
      title: "Pengumuman",
      description:
        "Pantau hasil verifikasi dan pengumuman penerimaan melalui akun PPDB.",
    },
    {
      number: "06",
      icon: GraduationCap,
      title: "Daftar Ulang",
      description:
        "Calon siswa yang diterima dapat melanjutkan proses daftar ulang.",
    },
  ];

  const requirements = [
    "Kartu Keluarga",
    "Akta Kelahiran",
    "Pas foto calon siswa",
    "KTP orang tua atau wali",
    "Dokumen pendukung lainnya",
  ];

  const schedule = [
    {
      title: "Pendaftaran Online",
      date: "01 Oktober - 30 November 2026",
      status: "Dibuka",
    },
    {
      title: "Verifikasi Berkas",
      date: "01 - 05 Desember 2026",
      status: "Terjadwal",
    },
    {
      title: "Pengumuman",
      date: "08 Desember 2026",
      status: "Terjadwal",
    },
    {
      title: "Daftar Ulang",
      date: "09 - 15 Desember 2026",
      status: "Terjadwal",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#beranda" className="flex items-center gap-3">
            {sekolah?.image_profile ? (
              <img
                src={repo + sekolah.image_profile}
                alt={sekolah.nama_sekolah || "Logo sekolah"}
                className="h-11 w-11 rounded-2xl object-contain"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                <School size={23} />
              </div>
            )}

            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                PPDB Online
              </h1>

              <p className="text-xs font-medium text-slate-500">
                {loading
                  ? "Memuat..."
                  : sekolah?.nama_sekolah || "Nama Sekolah"}
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a href="#beranda" className="transition hover:text-blue-600">
              Beranda
            </a>

            <a href="#alur" className="transition hover:text-blue-600">
              Alur PPDB
            </a>

            <a href="#persyaratan" className="transition hover:text-blue-600">
              Persyaratan
            </a>

            <a href="#jadwal" className="transition hover:text-blue-600">
              Jadwal
            </a>

            <a href="#kontak" className="transition hover:text-blue-600">
              Kontak
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Masuk
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              Daftar Sekarang
              <ArrowRight size={17} />
            </button>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 lg:hidden">
            <Menu size={21} />
          </button>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section
          id="beranda"
          className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
        >
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />

          <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                PPDB Tahun Ajaran 2026/2027
              </div>

              <h2 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Penerimaan Peserta Didik Baru
                <span className="mt-2 block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Lebih Mudah & Modern
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Daftarkan putra dan putri Anda di{" "}
                <strong className="text-slate-900">
                  {loading
                    ? "sekolah kami"
                    : sekolah?.nama_sekolah || "sekolah kami"}
                </strong>{" "}
                melalui sistem PPDB online yang cepat, aman, dan transparan.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                  Mulai Pendaftaran
                  <ArrowRight size={18} />
                </button>

                <button className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                  Lihat Informasi PPDB
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Pendaftaran Online
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Proses Transparan
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Mudah Dipantau
                </div>
              </div>
            </div>

            {/* ================= HERO CARD ================= */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-linear-to-r from-blue-100 to-indigo-100 blur-2xl" />

              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      Informasi Pendaftaran
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      PPDB Online 2026
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <GraduationCap size={25} />
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Periode Pendaftaran
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <CalendarDays className="text-blue-600" size={21} />

                    <div>
                      <p className="font-bold text-slate-900">
                        01 Oktober - 30 November
                      </p>

                      <p className="text-sm text-slate-500">Tahun 2026</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <Users className="text-indigo-600" size={22} />

                    <p className="mt-3 text-2xl font-bold">120</p>

                    <p className="mt-1 text-sm text-slate-500">Kuota Siswa</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <ClipboardList className="text-emerald-600" size={22} />

                    <p className="mt-3 text-2xl font-bold">250+</p>

                    <p className="mt-1 text-sm text-slate-500">Pendaftar</p>
                  </div>
                </div>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-bold text-white transition hover:bg-slate-800">
                  Daftar PPDB
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 px-5 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
            {stats.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center px-4 py-8 text-center"
              >
                <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {item.value}
                </p>

                <p className="mt-2 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= ALUR ================= */}
        <section id="alur" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                Alur Pendaftaran
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Proses PPDB yang Mudah
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Ikuti tahapan berikut untuk menyelesaikan proses pendaftaran
                calon peserta didik baru.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={index}
                    className="group relative rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                  >
                    <span className="absolute top-6 right-7 text-5xl font-black text-slate-100">
                      {step.number}
                    </span>

                    <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= PERSYARATAN ================= */}
        <section id="persyaratan" className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                Persyaratan
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Siapkan Dokumen Pendaftaran
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-600">
                Sebelum melakukan pendaftaran, pastikan seluruh dokumen
                persyaratan telah disiapkan.
              </p>

              <div className="mt-8 space-y-4">
                {requirements.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={19} />
                    </div>

                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl sm:p-9">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <FileText size={27} />
              </div>

              <h3 className="mt-7 text-2xl font-bold">
                Pastikan dokumen terbaca dengan jelas
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                Upload dokumen dalam format JPG, JPEG, PNG, atau PDF sesuai
                batas ukuran yang ditentukan.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-4 text-sm">
                  <span className="text-slate-400">Format</span>
                  <span className="font-semibold">JPG, PNG, PDF</span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-4 text-sm">
                  <span className="text-slate-400">Maks. Ukuran</span>
                  <span className="font-semibold">2 MB / File</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status Dokumen</span>

                  <span className="font-semibold text-emerald-400">
                    Wajib Lengkap
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= JADWAL ================= */}
        <section id="jadwal" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                Jadwal PPDB
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Jadwal Pendaftaran
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Perhatikan setiap tanggal penting agar proses PPDB dapat
                diselesaikan tepat waktu.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between ${
                    index !== schedule.length - 1
                      ? "border-b border-slate-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <CalendarDays size={21} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>

                      <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                      item.status === "Dibuka"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-5 py-20 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 px-6 py-14 text-center text-white shadow-2xl shadow-blue-600/20 sm:px-10 sm:py-18">
            <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">
              <GraduationCap className="mx-auto" size={45} />

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Siap Bergabung Bersama Kami?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
                Segera lakukan pendaftaran PPDB dan lengkapi seluruh data calon
                peserta didik melalui sistem pendaftaran online.
              </p>

              <button className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5">
                Daftar Sekarang
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer id="kontak" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              {sekolah?.logo ? (
                <img
                  src={sekolah.logo}
                  alt={sekolah.nama_sekolah || "Logo sekolah"}
                  className="h-10 w-10 rounded-xl object-contain"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <School size={21} />
                </div>
              )}

              <div>
                <h3 className="font-bold text-slate-900">
                  {sekolah?.nama_sekolah || "PPDB Online"}
                </h3>

                <p className="text-xs text-slate-500">
                  Penerimaan Peserta Didik Baru
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
              Sistem penerimaan peserta didik baru yang memberikan kemudahan
              bagi orang tua dalam proses pendaftaran sekolah.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Menu</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
              <a href="#beranda" className="hover:text-blue-600">
                Beranda
              </a>

              <a href="#alur" className="hover:text-blue-600">
                Alur PPDB
              </a>

              <a href="#persyaratan" className="hover:text-blue-600">
                Persyaratan
              </a>

              <a href="#jadwal" className="hover:text-blue-600">
                Jadwal
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Kontak</h3>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-500">
              <p>{sekolah?.alamat || "Alamat sekolah belum tersedia"}</p>

              <p>{sekolah?.email || "Email sekolah belum tersedia"}</p>

              <p>{sekolah?.no_telp || "Nomor telepon belum tersedia"}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
            <p>
              © {new Date().getFullYear()}{" "}
              {sekolah?.nama_sekolah || "PPDB Online"}.
            </p>

            <p>Sistem Informasi Sekolah</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
