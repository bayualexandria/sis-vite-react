import { useState, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../../utils/repositories";
import axios from "axios";
import repo from "../../../utils/repo";

/* =========================================================
   SWEET ALERT
========================================================= */

const templateModalSuccess = withReactContent(Swal).mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,

  customClass: {
    popup: "z-[99999] rounded-xl shadow-2xl",
  },

  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

/* =========================================================
   ICONS
========================================================= */

const CloseIcon = ({ className = "size-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const ClassroomIcon = ({ className = "size-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
    />
  </svg>
);

const ChevronDownIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const SpinnerIcon = ({ className = "size-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={`${className} animate-spin`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const DownloadIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

function JadwalMapelByKelas({ kelas }) {
  const [jadwalList, setJadwalList] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHari, setSelectedHari] = useState("");
  const [sekolah, setSekolah] = useState(null);
  const [guruList, setGuruList] = useState([]); // Diubah menjadi array untuk menampung list guru

  // Ref untuk mengambil elemen QR Code secara tersembunyi
  const qrRefKepsek = useRef(null);
  const qrRefWali = useRef(null);

  /* =====================================================
     GET DATA JADWAL KELAS & SORTING
  ===================================================== */

  const getDataKelas = async () => {
    setLoading(true);
    try {
      const response = await api
        .get(`jadwal-mapel/kelas/${kelas.kelas_id}`)
        .then((res) => res.data);

      const rawData = response?.data || [];

      const urutanHari = {
        Senin: 1,
        Selasa: 2,
        Rabu: 3,
        Kamis: 4,
        Jumat: 5,
        Sabtu: 6,
        Minggu: 7,
      };

      const sortedData = rawData.sort((a, b) => {
        const dayA = urutanHari[a.hari] || 99;
        const dayB = urutanHari[b.hari] || 99;

        if (dayA !== dayB) {
          return dayA - dayB;
        }

        const jamA = a.jam_mulai || "";
        const jamB = b.jam_mulai || "";
        return jamA.localeCompare(jamB);
      });

      setJadwalList(sortedData);
    } catch (e) {
      console.error("Error get jadwal kelas:", e);

      if (e.message === "Failed to fetch" || e.code === "ERR_NETWORK") {
        templateModalSuccess.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     GET DATA SEKOLAH
  ===================================================== */
  const getDataSekolah = async () => {
    try {
      const response = await axios.get(`${repo}api/profile-sekolah`);
      setSekolah(response.data?.data || null);
    } catch (error) {
      console.error("Gagal mengambil data sekolah:", error);
    }
  };

  /* =====================================================
     GET DATA GURU
  ===================================================== */

  const getDataGuru = async () => {
    try {
      const response = await api.get(`guru/`);
      // Menyimpan data array guru (pastikan mengambil array dari response.data.data atau response.data)
      const dataGuru = response.data?.data || response.data || [];
      setGuruList(Array.isArray(dataGuru) ? dataGuru : []);
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
    }
  };

  /* =====================================================
     OPEN / CLOSE MODAL
  ===================================================== */

  const handleOpen = () => {
    setSelectedHari("");
    setOpen(true);
    getDataKelas();
    getDataSekolah();
    getDataGuru();
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  // Mencari Kepala Sekolah berdasarkan status_guru
  const kepalaSekolah = guruList.find(
    (g) =>
      g.status_guru?.toLowerCase() === "kepala sekolah" ||
      g.status_guru === "Kepala Sekolah",
  );

  const namaKepsek =
    kepalaSekolah?.nama_guru ||
    kepalaSekolah?.nama ||
    kepalaSekolah?.name ||
    "Kepala Sekolah";
  const nipKepsek = kepalaSekolah?.nip || "-";

  /* =====================================================
     DOWNLOAD PDF GENERATOR (DENGAN QRCodeCanvas)
  ===================================================== */

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. KOP HEADER UTAMA BERWARNA UNGU ELEGAN
    doc.setFillColor(109, 40, 217); // Warna Ungu Utama (#6D28D9)
    doc.rect(0, 0, pageWidth, 28, "F");

    // Garis Aksen Bawah Header
    doc.setFillColor(245, 158, 11); // Warna Kuning/Gold Aksen
    doc.rect(0, 28, pageWidth, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(sekolah?.nama_sekolah || "SEKOLAH", pageWidth / 2, 11, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.text("JADWAL PELAJARAN / KEGIATAN PEMBELAJARAN", pageWidth / 2, 19, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `KELAS: ${kelas.nama_kelas} ${kelas.jurusan || ""} — TAHUN AJARAN 2028/2029`,
      pageWidth / 2,
      24,
      {
        align: "center",
      },
    );

    // 2. PEMETAAN TABEL MATRIKS JADWAL BERDASARKAN WAKTU
    const tableColumn = [
      "WAKTU",
      "SENIN",
      "SELASA",
      "RABU",
      "KAMIS",
      "JUMAT",
      "SABTU",
    ];

    const jamUnikMap = {};
    filteredJadwal.forEach((item) => {
      const jamMulai = item.jam_mulai ? item.jam_mulai.substring(0, 5) : "";
      const jamSelesai = item.jam_selesai
        ? item.jam_selesai.substring(0, 5)
        : "";
      const keyJam =
        jamMulai && jamSelesai
          ? `${jamMulai} - ${jamSelesai}`
          : "07.30 - 10.30";

      if (!jamUnikMap[keyJam]) {
        jamUnikMap[keyJam] = {
          Senin: "-",
          Selasa: "-",
          Rabu: "-",
          Kamis: "-",
          Jumat: "-",
          Sabtu: "-",
        };
      }

      const hariFormatted = item.hari
        ? item.hari.charAt(0).toUpperCase() + item.hari.slice(1).toLowerCase()
        : "";
      if (jamUnikMap[keyJam][hariFormatted] !== undefined) {
        jamUnikMap[keyJam][hariFormatted] =
          `${item.nama_mapel || item.mapel || "-"}\n(${item.nama_guru || item.guru || "-"})`;
      }
    });

    const tableRows = [];
    Object.keys(jamUnikMap).forEach((jam) => {
      const row = jamUnikMap[jam];
      tableRows.push([
        jam,
        row.Senin,
        row.Selasa,
        row.Rabu,
        row.Kamis,
        row.Jumat,
        row.Sabtu,
      ]);
    });

    const finalRows =
      tableRows.length > 0
        ? tableRows
        : filteredJadwal.map((item) => [
            `${item.jam_mulai || ""} - ${item.jam_selesai || ""}`,
            item.hari === "Senin"
              ? `${item.nama_mapel}\n(${item.nama_guru})`
              : "",
            item.hari === "Selasa"
              ? `${item.nama_mapel}\n(${item.nama_guru})`
              : "",
            item.hari === "Rabu"
              ? `${item.nama_mapel}\n(${item.nama_guru})`
              : "",
            item.hari === "Kamis"
              ? `${item.nama_mapel}\n(${item.nama_guru})`
              : "",
            item.hari === "Jumat"
              ? `${item.nama_mapel}\n(${item.nama_guru})`
              : "",
            item.hari === "Sabtu"
              ? `${item.nama_mapel}\n(${item.nama_guru})`
              : "",
          ]);

    autoTable(doc, {
      head: [tableColumn],
      body: finalRows,
      startY: 35,
      theme: "grid",
      headStyles: {
        fillColor: [79, 70, 229], // Indigo Header
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [30, 41, 59],
        valign: "middle",
        halign: "center",
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 26, fontStyle: "bold", fillColor: [241, 245, 249] },
        1: { cellWidth: 26 },
        2: { cellWidth: 26 },
        3: { cellWidth: 26 },
        4: { cellWidth: 26 },
        5: { cellWidth: 26 },
        6: { cellWidth: 24 },
      },
    });

    // 3. KOTAK KETERANGAN / CATATAN
    let currentY = doc.lastAutoTable.finalY + 8;
    if (currentY > pageHeight - 85) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, currentY, pageWidth - 28, 28, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("KETERANGAN & CATATAN:", 18, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      "• Kegiatan Pembelajaran aktif dilaksanakan setiap hari Senin s.d. Jumat pukul 07.30 WIB.",
      18,
      currentY + 12,
    );
    doc.text(
      "• Harap siswa hadir 10 menit sebelum kegiatan dimulai serta mengenakan seragam sesuai jadwal.",
      18,
      currentY + 17,
    );
    doc.text(
      `• Wali Kelas bertanggung jawab penuh terhadap ketertiban kelas ${kelas.nama_kelas}.`,
      18,
      currentY + 22,
    );

    // 4. BAGIAN TANDA TANGAN DIGITAL DENGAN QRCodeCanvas ASLI
    currentY += 34;
    if (currentY + 45 > pageHeight - 10) {
      doc.addPage();
      currentY = 20;
    }

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const namaWaliKelas =
      kelas.nama_wali_kelas ||
      kelas.wali_kelas ||
      kelas.name ||
      "Nama Wali Kelas, S.Pd.";
    const nipWaliKelas = kelas.nip_wali_kelas || kelas.nip || "-";

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    doc.text(`Biak, ${todayStr}`, pageWidth - 45, currentY, {
      align: "center",
    });

    doc.text("Mengetahui,", 45, currentY, { align: "center" });
    doc.text("Kepala Sekolah", 45, currentY + 4, { align: "center" });

    doc.text("Wali Kelas,", pageWidth - 45, currentY + 4, { align: "center" });

    // Ambil elemen canvas dari QRCodeCanvas tersembunyi
    const canvasKepsek = qrRefKepsek.current?.querySelector("canvas");
    const canvasWali = qrRefWali.current?.querySelector("canvas");

    const qrSize = 20; // ukuran QR di PDF (mm)

    // Tambahkan QR Code Kepala Sekolah jika ada
    if (canvasKepsek) {
      const qrDataURL = canvasKepsek.toDataURL("image/png");
      doc.addImage(
        qrDataURL,
        "PNG",
        45 - qrSize / 2,
        currentY + 7,
        qrSize,
        qrSize,
      );
    }

    // Tambahkan QR Code Wali Kelas jika ada
    if (canvasWali) {
      const qrDataURL = canvasWali.toDataURL("image/png");
      doc.addImage(
        qrDataURL,
        "PNG",
        pageWidth - 45 - qrSize / 2,
        currentY + 7,
        qrSize,
        qrSize,
      );
    }

    // Label Teks di Bawah QR Code
    const textY = currentY + 31;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`( ${namaKepsek} )`, 45, textY, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`NIP. ${nipKepsek}`, 45, textY + 4, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`( ${namaWaliKelas} )`, pageWidth - 45, textY, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`NIP. ${nipWaliKelas}`, pageWidth - 45, textY + 4, {
      align: "center",
    });

    // 5. SIMPAN FILE PDF
    doc.save(
      `Jadwal_Pelajaran_Kelas_${kelas.nama_kelas}_${kelas.jurusan || ""}.pdf`,
    );
  };

  /* =====================================================
     OPTIONS & FILTER HARI
  ===================================================== */

  const hariOptions = [
    { value: "Senin", label: "Senin" },
    { value: "Selasa", label: "Selasa" },
    { value: "Rabu", label: "Rabu" },
    { value: "Kamis", label: "Kamis" },
    { value: "Jumat", label: "Jumat" },
    { value: "Sabtu", label: "Sabtu" },
    { value: "Minggu", label: "Minggu" },
  ];

  const filteredJadwal = selectedHari
    ? jadwalList.filter(
        (item) => item.hari?.toLowerCase() === selectedHari.toLowerCase(),
      )
    : jadwalList;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* Container QR Code Tersembunyi (digunakan untuk generate canvas PDF) */}
      <div style={{ display: "none" }}>
        <div ref={qrRefKepsek}>
          <QRCodeCanvas
            value={`${namaKepsek}||${nipKepsek}`}
            size={128}
            level="H"
          />
        </div>
        <div ref={qrRefWali}>
          <QRCodeCanvas
            value={`${kelas.name || kelas.nama_wali_kelas || ""}||${kelas.nip || kelas.nip_wali_kelas || ""}`}
            size={128}
            level="H"
          />
        </div>
      </div>

      <button
        onClick={handleOpen}
        type="button"
        title="Detail Jadwal"
        className="
          inline-flex h-10 items-center justify-center gap-2
          rounded-xl
          border border-sky-500
          bg-sky-500
          px-4
          text-xs font-bold text-white
          shadow-sm shadow-sky-500/20
          transition-all duration-200
          hover:-translate-y-0.5
          hover:bg-sky-600
          hover:border-sky-600
          hover:shadow-lg hover:shadow-sky-500/20
          active:translate-y-0
          focus:outline-none
          focus:ring-4 focus:ring-sky-500/20
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Jadwal mapel
      </button>

      {open && (
        <div
          className="
            fixed inset-0 z-[9990]
            flex items-center justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-jadwal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            className="
              relative flex max-h-[90vh] w-full max-w-2xl
              flex-col overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white
              shadow-2xl shadow-slate-950/20
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            {/* HEADER */}
            <div
              className="
                flex shrink-0 items-center justify-between
                border-b border-slate-100
                px-5 py-4
                dark:border-slate-800
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex size-10 items-center justify-center
                    rounded-xl
                    bg-sky-50
                    text-sky-500
                    dark:bg-sky-950/40
                  "
                >
                  <ClassroomIcon className="size-5" />
                </div>

                <div>
                  <h2
                    id="detail-jadwal-title"
                    className="
                      text-base font-bold
                      text-slate-800
                      dark:text-white
                    "
                  >
                    Jadwal Kelas {kelas.nama_kelas} {kelas.jurusan}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Daftar mata pelajaran berdasarkan jadwal kelas
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="
                  flex size-9 items-center justify-center
                  rounded-xl
                  border border-slate-200
                  bg-white
                  text-slate-400
                  transition
                  hover:border-rose-200
                  hover:bg-rose-50
                  hover:text-rose-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:hover:border-rose-900
                  dark:hover:bg-rose-950/30
                "
                aria-label="Tutup modal"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* FILTER HARI & TOMBOL DOWNLOAD */}
            <div className="flex items-center justify-between gap-3 px-5 pt-4">
              <div className="relative flex-1">
                <select
                  value={selectedHari}
                  onChange={(e) => setSelectedHari(e.target.value)}
                  className="
                    h-10 w-full appearance-none rounded-xl
                    border border-slate-200 bg-white px-4 pr-10
                    text-xs font-medium text-slate-700
                    outline-none transition-all
                    focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10
                    dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
                  "
                >
                  <option value="">Semua Hari</option>
                  {hariOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDownIcon />
                </div>
              </div>

              {/* Tombol Download PDF */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={loading || jadwalList.length === 0}
                className="
                  inline-flex h-10 items-center justify-center gap-2
                  rounded-xl
                  border border-emerald-500
                  bg-emerald-500
                  px-4
                  text-xs font-bold text-white
                  shadow-sm shadow-emerald-500/20
                  transition-all duration-200
                  hover:bg-emerald-600
                  hover:border-emerald-600
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <DownloadIcon className="size-4" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* BODY / CONTENT */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <SpinnerIcon className="size-8 text-sky-500 mb-2" />
                  <p className="text-sm font-medium">Memuat data jadwal...</p>
                </div>
              ) : filteredJadwal.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th className="w-24 px-4 py-3">Hari</th>
                        <th className="px-4 py-3">Jam</th>
                        <th className="px-4 py-3">Mata Pelajaran</th>
                        <th className="px-4 py-3">Guru Pengampu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                      {filteredJadwal.map((item, index) => (
                        <tr
                          key={item.jadwal_id || index}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                        >
                          <td className="w-24 px-4 py-3 font-semibold">
                            {item.hari || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.jam_mulai
                              ? `${item.jam_mulai} - ${item.jam_selesai}`
                              : "-"}
                          </td>
                          <td className="px-4 py-3 font-medium text-sky-600 dark:text-sky-400">
                            {item.nama_mapel || item.mapel || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {item.nama_guru || item.guru || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <ClassroomIcon className="size-12 mb-2 opacity-40" />
                  <p className="text-sm font-medium">
                    {selectedHari
                      ? `Tidak ada jadwal untuk hari ${selectedHari}.`
                      : "Belum ada jadwal mata pelajaran untuk kelas ini."}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 items-center justify-end border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JadwalMapelByKelas;
