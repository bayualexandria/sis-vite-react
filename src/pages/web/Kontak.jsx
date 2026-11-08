import { useState, useEffect } from "react";
import axios from "axios";
import NavbarSection from "./components/NavbarSection";
import FooterSection from "./components/FooterSection";
import FloatingChatAI from "./components/FloatingChatAI";
import repo from "../../utils/repo";

export default function KontakPage() {
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Formulir Pesan
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    subjek: "",
    pesan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

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
  const websiteSekolah = sekolah?.website || "Website belum tersedia";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.pesan) return;

    setIsSubmitting(true);

    // Simulasi pengiriman pesan
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setFormData({
        nama: "",
        email: "",
        telepon: "",
        subjek: "",
        pesan: "",
      });

      // Reset notifikasi sukses setelah 5 detik
      setTimeout(() => setSubmittedSuccess(false), 5000);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-600/20 animate-pulse">
            S
          </div>
          <h2 className="mt-6 text-xl font-black text-slate-900">
            Memuat Informasi Kontak
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
            📞 HUBUNGI SEKOLAH KAMI
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Layanan &{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Pusat Kontak
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Punya pertanyaan mengenai PPDB, program keahlian, atau layanan
            pendidikan lainnya? Tim {namaSekolah} siap membantu Anda.
          </p>
        </div>
      </section>

      {/* KONTAK DETAIL & FORMULIR */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Kiri: Informasi Kontak */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                  INFORMASI RESMI
                </span>
                <h2 className="mt-2 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                  Saluran Komunikasi
                </h2>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  Silakan hubungi kami melalui salah satu saluran berikut atau
                  kunjungi kampus utama sekolah pada jam operasional kerja.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ContactBox
                  icon="📍"
                  title="Alamat Sekolah"
                  detail={alamatSekolah}
                />
                <ContactBox
                  icon="📞"
                  title="Telepon / WA"
                  detail={teleponSekolah}
                />
                <ContactBox
                  icon="✉️"
                  title="Email Resmi"
                  detail={emailSekolah}
                />
                <ContactBox
                  icon="🌐"
                  title="Website Resmi"
                  detail={websiteSekolah}
                />
              </div>

              {/* Jam Operasional */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    🕒
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Jam Operasional Kantor
                    </h3>
                    <p className="text-xs text-slate-500">
                      Layanan Administrasi & Informasi PPDB
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex justify-between">
                    <span>Senin - Jumat:</span>
                    <strong className="text-slate-800">
                      07:30 - 15:30 WIB
                    </strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Sabtu:</span>
                    <strong className="text-slate-800">
                      08:00 - 12:00 WIB
                    </strong>
                  </li>
                  <li className="flex justify-between text-rose-500 font-semibold">
                    <span>Minggu & Hari Libur Nasional:</span>
                    <span>Tutup</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Kanan: Formulir Pesan */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100">
              <div className="mb-6">
                <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                  KIRIM PESAN
                </span>
                <h3 className="mt-1 text-2xl font-black text-slate-900">
                  Formulir Konsultasi
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Isi formulir di bawah ini dan tim kami akan segera
                  membalasnya.
                </p>
              </div>

              {submittedSuccess && (
                <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs font-semibold flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <div>
                    <strong className="block text-emerald-900 font-bold">
                      Pesan Berhasil Terkirim!
                    </strong>
                    <span>
                      Terima kasih, tim sekolah kami akan segera menghubungi
                      Anda.
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="nama@email.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleChange}
                      placeholder="08123456789"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Subjek Pertanyaan
                  </label>
                  <input
                    type="text"
                    name="subjek"
                    value={formData.subjek}
                    onChange={handleChange}
                    placeholder="Contoh: Informasi Pendaftaran PPDB"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Pesan Anda <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                    placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda tanyakan..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      <span>Mengirim Pesan...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Pesan Sekarang</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* EMBED GOOGLE MAPS LOKASI */}
      <section className="py-12 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
              LOKASI KAMPUS
            </span>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Peta Lokasi {namaSekolah}
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg h-96 w-full bg-slate-100 relative">
            <iframe
              title="Lokasi Sekolah"
              src="https://maps.google.com/maps?q=lokasi%20sekolah&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-full w-full border-0"
              allowFullScreen=""
              loading="lazy"
            />
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

function ContactBox({ icon, title, detail }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-xl shadow-inner mb-3">
        {icon}
      </div>
      <h3 className="font-extrabold text-slate-900 text-sm">{title}</h3>
      <p className="mt-1 break-words text-xs leading-relaxed text-slate-600">
        {detail}
      </p>
    </div>
  );
}
