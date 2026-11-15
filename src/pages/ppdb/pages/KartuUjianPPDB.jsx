import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  X,
  Printer,
  GraduationCap,
  ShieldCheck,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../../utils/repositories"; // Sesuaikan path import api jika berbeda
import repo from "../../../utils/repo"; // Sesuaikan path import repo jika berbeda

export default function KartuUjianModal({
  isOpen,
  onClose,
  user,
  calonSiswa,
  pendaftaran,
}) {
  const [pasFotoUrl, setPasFotoUrl] = useState(null);

  // Ambil username dengan aman
  const username =
    user?.username ||
    localStorage
      .getItem("username")
      ?.replace(/^["'](.+)["']$/, "$1")
      .trim();

  // Fetch dokumen persyaratan untuk mencari pas foto jika modal terbuka
  useEffect(() => {
    if (isOpen && username) {
      const fetchPasFoto = async () => {
        try {
          const response = await api.get(
            `ppdb/dokumen-persyaratan/${username}`,
            {
              withCredentials: true,
            },
          );
          const docList = response.data?.data || response.data;

          if (Array.isArray(docList)) {
            // Cari dokumen yang jenis_dokumen-nya "Pas Foto"
            const pasFotoItem = docList.find(
              (item) => item.jenis_dokumen === "Pas Foto",
            );

            if (pasFotoItem && pasFotoItem.path_file) {
              const rawPath = pasFotoItem.path_file.replace(/\\/g, "/");
              if (
                rawPath.startsWith("http://") ||
                rawPath.startsWith("https://")
              ) {
                setPasFotoUrl(rawPath);
              } else {
                const rawBaseUrl = api.defaults.baseURL || repo;
                const cleanBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "");
                const fullUrl = `${cleanBaseUrl.replace(/\/$/, "")}/${rawPath.replace(/^\//, "")}`;
                setPasFotoUrl(fullUrl);
              }
            } else {
              setPasFotoUrl(null);
            }
          }
        } catch (error) {
          console.error("Gagal mengambil dokumen persyaratan:", error);
        }
      };

      fetchPasFoto();
    }
  }, [isOpen, username]);

  if (!isOpen) return null;

  // Fallback data jika beberapa field dari API belum terisi
  const nomorPeserta =
    pendaftaran?.nomor_pendaftaran || user?.username || "PPDB-2026-0001";
  const namaLengkap =
    calonSiswa?.calon_siswa?.nama_lengkap ||
    user?.nama_lengkap ||
    "Nama Peserta";
  const nisn = calonSiswa?.calon_siswa?.nisn || "-";
  const asalSekolah = calonSiswa?.calon_siswa?.sekolah_asal || "-";
  const jalur =
    calonSiswa?.jalur_pendaftaran ||
    pendaftaran?.jalur ||
    "Jalur Reguler / Prestasi";
  const tempatLahir = calonSiswa?.calon_siswa?.ttl || "-";

  // Prioritaskan state pasFotoUrl yang diambil dari endpoint dokumen-persyaratan, fallback ke calonSiswa.foto_url
  const fotoSiswa = pasFotoUrl || calonSiswa?.foto_url || null;

  // Fungsi cetak menggunakan metode lembar cetak terisolasi (Print Window) + konversi QR Canvas ke Gambar
  const handlePrintPDF = () => {
    // 1. Ambil elemen canvas QR code dan ubah menjadi Data URL (Base64 gambar)
    const canvas = document.querySelector("#printable-kartu-ujian canvas");
    const qrDataUrl = canvas ? canvas.toDataURL("image/png") : "";

    // 2. Clone elemen kartu ujian agar aman dimanipulasi
    const printElement = document.getElementById("printable-kartu-ujian");
    if (!printElement) return;
    const clonedElement = printElement.cloneNode(true);

    // 3. Ganti elemen <canvas> di dalam kloningan dengan tag <img> agar QR code tampil sempurna saat dicetak
    const clonedCanvas = clonedElement.querySelector("canvas");
    if (clonedCanvas && qrDataUrl) {
      const img = document.createElement("img");
      img.src = qrDataUrl;
      img.style.width = "85px";
      img.style.height = "85px";
      clonedCanvas.parentNode.replaceChild(img, clonedCanvas);
    }

    const printContent = clonedElement.innerHTML;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      alert(
        "Mohon izinkan pop-up pada browser Anda untuk mencetak kartu ujian.",
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Kartu Ujian - ${nomorPeserta}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background-color: #ffffff;
              color: #0f172a;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-container {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
              background: #ffffff;
              border: 2px solid #1e293b;
              border-radius: 1rem;
              overflow: hidden;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="print-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
          >
            {/* Header Modal (Tidak ikut tercetak) */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-800">
                  Pratinjau Kartu Tanda Peserta Ujian & Barcode
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Area Kartu Ujian */}
            <div className="p-6 sm:p-8 bg-slate-100/70">
              <div
                id="printable-kartu-ujian"
                className="bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* KOP KARTU */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-blue-600">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-blue-600 rounded-xl">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-blue-300 font-semibold">
                        Panitia Penerimaan Peserta Didik Baru
                      </p>
                      <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                        KARTU TANDA PESERTA UJIAN
                      </h2>
                      <p className="text-xs text-slate-300">
                        Tahun Ajaran 2026/2027
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold rounded-md uppercase">
                      Terverifikasi
                    </span>
                  </div>
                </div>

                {/* BODY KARTU */}
                <div className="p-6 space-y-6">
                  {/* Nomor Peserta Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 block">
                        Nomor Peserta Ujian
                      </span>
                      <span className="text-lg font-mono font-extrabold text-slate-900 tracking-wider">
                        {nomorPeserta}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Jalur Pendaftaran
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {jalur}
                      </span>
                    </div>
                  </div>

                  {/* Biodata & Pas Foto */}
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Kotak Pas Foto 3x4 */}
                    <div className="w-28 h-36 shrink-0 mx-auto sm:mx-0 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center overflow-hidden">
                      {fotoSiswa ? (
                        <img
                          src={fotoSiswa}
                          alt="Pas Foto Peserta"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2 text-slate-400">
                          <User className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] font-medium block">
                            Pas Foto 3x4
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tabel Informasi Siswa */}
                    <div className="flex-1 w-full space-y-2.5 text-xs">
                      <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">
                          Nama Lengkap
                        </span>
                        <span className="col-span-2 font-bold text-slate-900 uppercase">
                          : {namaLengkap}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">NISN</span>
                        <span className="col-span-2 font-semibold text-slate-800">
                          : {nisn}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">TTL</span>
                        <span className="col-span-2 font-semibold text-slate-800">
                          : {tempatLahir}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">
                          Asal Sekolah
                        </span>
                        <span className="col-span-2 font-semibold text-slate-800">
                          : {asalSekolah}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Jadwal & Lokasi Tes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Jadwal Pelaksanaan
                        </p>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          22 Mei 2026 • 08:00 WIT - Selesai
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Lokasi / Ruang Ujian
                        </p>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          Ruang Lab Komputer 1 / Online
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Barcode Verifikasi */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <div className="space-y-1 max-w-xs">
                      <p className="font-bold text-slate-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Tata Tertib Singkat:
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                        <li>Kartu ini wajib dibawa saat verifikasi & tes.</li>
                        <li>
                          Tunjukkan barcode kepada panitia saat kedatangan.
                        </li>
                      </ul>
                    </div>

                    {/* Barcode / QR Code Section */}
                    <div className="flex flex-col items-center bg-white p-2.5 border border-slate-200 rounded-xl shadow-xs shrink-0">
                      <QRCodeCanvas
                        value={nomorPeserta}
                        size={85}
                        level={"M"}
                        includeMargin={false}
                      />
                      <span className="text-[9px] font-mono font-bold text-slate-700 mt-1 tracking-tighter">
                        Scan untuk Verifikasi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons (Tidak ikut tercetak) */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={handlePrintPDF}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan sebagai PDF</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
