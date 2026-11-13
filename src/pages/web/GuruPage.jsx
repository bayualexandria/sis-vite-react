import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/NavbarSection";
import Footer from "./components/FooterSection";
import FloatingChatAI from "./components/FloatingChatAI";

import repo from "../../utils/repo";
import api from "../../utils/repositories";
import repoimages from "../../utils/repoimages";

export default function GuruPage() {
  const [listGuru, setListGuru] = useState([]);
  const [sekolah, setSekolah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("semua");
  const [selectedGuru, setSelectedGuru] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSekolah, resGuru] = await Promise.all([
          axios.get(`${repo}api/profile-sekolah`),
          api.get("/guru/"),
        ]);

        const dataGuruMentah = resGuru.data?.data || resGuru.data || [];

        // Fungsi helper bobot hierarki jabatan
        const getHierarkiBobot = (guru) => {
          const jabatan = (
            guru.status_guru ||
            guru.position ||
            ""
          ).toLowerCase();
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
          if (jabatan.includes("guru") || jabatan.includes("pengajar"))
            return 4;
          return 5;
        };

        const dataGuruTerurut = [...dataGuruMentah].sort((a, b) => {
          return getHierarkiBobot(a) - getHierarkiBobot(b);
        });

        setSekolah(resSekolah.data?.data || null);
        setListGuru(dataGuruTerurut);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pisahkan Pimpinan Utama untuk ditaruh di section khusus atas
  const pimpinanUtama = listGuru.filter((guru) => {
    const jabatan = (guru.status_guru || guru.position || "").toLowerCase();
    return jabatan.includes("kepala sekolah") || jabatan.includes("wakil");
  });

  const sisaGuruStaf = listGuru.filter((guru) => {
    const jabatan = (guru.status_guru || guru.position || "").toLowerCase();
    return !jabatan.includes("kepala sekolah") && !jabatan.includes("wakil");
  });

  // Filter pencarian & tab
  const filterByQueryAndTab = (list) => {
    return list.filter((guru) => {
      const query = searchQuery.toLowerCase();
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

      if (activeTab === "guru") {
        return (
          matchesSearch &&
          (jabatan.includes("guru") || jabatan.includes("pengajar"))
        );
      } else if (activeTab === "staf") {
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
  };

  const filteredPimpinan = filterByQueryAndTab(pimpinanUtama);
  const filteredGuruStaf = filterByQueryAndTab(sisaGuruStaf);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar sekolah={sekolah} repo={repo} isDetailPage={true} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 h-[200px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-blue-400 uppercase backdrop-blur-md">
            ✨ Civitas Akademika Profesional
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Tenaga Pengajar &{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Staf Ahli
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Mengenal lebih dekat para pendidik berdedikasi tinggi dan tenaga
            kependidikan profesional yang berkomitmen mencetak generasi unggul.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/80 border border-slate-800 p-2 backdrop-blur-xl transition focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10">
              <span className="pl-4 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama guru, mata pelajaran, atau posisi..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "semua", label: "Semua Anggota" },
              { id: "guru", label: "Dewan Guru" },
              { id: "staf", label: "Staf & Administrasi" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-6 py-2.5 text-xs font-bold transition-all duration-300 ${
                  activeTab === tab.id
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

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-20 sm:px-6 lg:px-8 w-full space-y-20">
        {loading ? (
          <div className="py-28 text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-sm font-medium text-slate-500">
              Memuat data tenaga pendidik...
            </p>
          </div>
        ) : filteredPimpinan.length === 0 && filteredGuruStaf.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center shadow-sm">
            <span className="text-5xl">📂</span>
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Tidak ada data ditemukan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Coba gunakan kata kunci pencarian yang lain.
            </p>
          </div>
        ) : (
          <>
            {/* SECTION 1: PIMPINAN SEKOLAH */}
            {filteredPimpinan.length > 0 &&
              activeTab === "semua" &&
              searchQuery === "" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-1.5 rounded-full bg-blue-600"></div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
                        Pimpinan Sekolah
                      </h2>
                      <p className="text-xs text-slate-500">
                        Jajaran pimpinan tertinggi yang menahkodai visi dan misi
                        institusi
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
                    {filteredPimpinan.map((guru, index) => (
                      <div
                        key={guru.id || index}
                        onClick={() => setSelectedGuru(guru)}
                        className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-8 shadow-xl shadow-slate-100 transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
                      >
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-blue-50 shadow-inner">
                          {guru.image_profile || guru.image ? (
                            <img
                              src={`${repoimages}${guru.image_profile || guru.image}`}
                              alt={guru.nama || guru.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl font-black text-blue-600">
                              {(guru.nama || guru.name || "G").charAt(0)}
                            </div>
                          )}
                          <span className="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow">
                            Top
                          </span>
                        </div>

                        <div className="space-y-2">
                          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            {guru.status_guru ||
                              guru.position ||
                              "Pimpinan Sekolah"}
                          </span>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition">
                            {guru.nama || guru.name}
                          </h3>
                          <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                            {guru.mapel ||
                              guru.subject ||
                              guru.bio ||
                              "Memimpin manajemen dan strategi akademik sekolah."}
                          </p>
                          <span className="inline-block text-xs font-bold text-blue-600 pt-1 group-hover:underline">
                            Lihat Profil Lengkap →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* SECTION 2: DEWAN GURU & STAF LAINNYA */}
            <div className="space-y-8">
              {activeTab === "semua" &&
                searchQuery === "" &&
                filteredPimpinan.length > 0 && (
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                    <div className="h-8 w-1.5 rounded-full bg-slate-400"></div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
                        Dewan Guru & Staf Pengajar
                      </h2>
                      <p className="text-xs text-slate-500">
                        Tenaga pendidik profesional dan staf pendukung
                        operasional sekolah
                      </p>
                    </div>
                  </div>
                )}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {(activeTab === "semua" && searchQuery === ""
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

                      <h3 className="mt-5 font-bold text-slate-900 text-base transition group-hover:text-blue-600">
                        {guru.nama || guru.name}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-blue-600">
                        {guru.status_guru || guru.position || "Guru Pengajar"}
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
                        Detail Profil →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* MODERN PROFESSIONAL DETAIL MODAL */}
      {selectedGuru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-slate-100">
            {/* Modal Header dengan Banner Gradient Mewah */}
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
                      alt={selectedGuru.nama || selectedGuru.name}
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

            {/* Modal Body dengan Desain Clean Card */}
            <div className="space-y-4 p-6 sm:p-8 bg-slate-50/50 max-h-[60vh] overflow-y-auto">
              <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>📚</span> Mata Pelajaran / Bidang Keahlian
                </div>
                <p className="mt-1.5 text-sm font-bold text-slate-800">
                  {selectedGuru.mapel || selectedGuru.subject || "-"}
                </p>
              </div>

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

      {/* Footer Reusable */}
      <Footer sekolah={sekolah} isDetailPage={true} />

      {/* Floating Chat AI Reusable */}
      <FloatingChatAI
        alamatSekolah={sekolah?.alamat}
        teleponSekolah={sekolah?.telepon}
        emailSekolah={sekolah?.email}
      />
    </div>
  );
}
