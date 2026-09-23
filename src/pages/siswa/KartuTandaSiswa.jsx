import React, { useCallback, useEffect } from "react";
import { Modal } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import repo from "../../utils/repo";
import axios from "axios";

const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 54;

// Rasio 85.6 : 54
// 540px x 340px sangat dekat dengan rasio kartu ID-1
const CARD_WIDTH_PX = 540;
const CARD_HEIGHT_PX = 340;

function KartuTandaSiswa({ siswa }) {

  const [open, setOpen] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [sekolah, setSekolah] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const profileSekolah = useCallback(async () => {
    try {
      let response = await axios
        .get(`${repo}api/profile-sekolah`)
        .then((res) => res.data);
      setSekolah(response.data);
    } catch (error) {
      return error;
    }
  }, []);
  useEffect(() => {
    profileSekolah();
  }, [profileSekolah]);

  const profileImage = siswa?.image_profile
    ? `${repo}${siswa.image_profile}`
    : null;

  // ============================================================
  // WAIT FOR IMAGES
  // ============================================================
  const waitForImages = async (element) => {
    const images = Array.from(element.querySelectorAll("img"));

    if (!images.length) {
      return;
    }

    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          const done = () => resolve();

          img.addEventListener("load", done, {
            once: true,
          });

          img.addEventListener("error", done, {
            once: true,
          });
        });
      }),
    );
  };

  // ============================================================
  // WAIT FOR QR CANVAS
  // ============================================================
  const waitForQRCode = async (element) => {
    for (let i = 0; i < 20; i++) {
      const qrCanvas = element.querySelector('[data-qr-code="true"] canvas');

      if (qrCanvas && qrCanvas.width > 0 && qrCanvas.height > 0) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.warn("QR Code canvas tidak ditemukan.");
  };

  // ============================================================
  // SANITIZE FILE NAME
  // ============================================================
  const sanitizeFileName = (name) => {
    return String(name || "siswa")
      .replace(/[<>:"/\\|?*]+/g, "")
      .replace(/\s+/g, "_")
      .trim();
  };

  // ============================================================
  // DOWNLOAD PDF
  // ============================================================
  const handleDownloadPDF = async () => {
    const element = document.getElementById("kartu-siswa");

    if (!element) {
      console.error("Elemen kartu siswa tidak ditemukan.");

      return;
    }

    try {
      setIsDownloading(true);

      // --------------------------------------------------------
      // Pastikan kartu terlihat
      // --------------------------------------------------------
      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        throw new Error("Ukuran kartu tidak valid.");
      }

      // --------------------------------------------------------
      // Tunggu gambar
      // --------------------------------------------------------
      await waitForImages(element);

      // --------------------------------------------------------
      // Tunggu QR Code
      // --------------------------------------------------------
      await waitForQRCode(element);

      // --------------------------------------------------------
      // Tunggu browser repaint
      // --------------------------------------------------------
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      // --------------------------------------------------------
      // Ukuran kartu aktual
      // --------------------------------------------------------
      const rect = element.getBoundingClientRect();

      const width = Math.ceil(rect.width);
      const height = Math.ceil(rect.height);

      console.log("Ukuran kartu:", {
        width,
        height,
      });

      // --------------------------------------------------------
      // Pastikan QR benar-benar ada
      // --------------------------------------------------------
      const qrCanvas = element.querySelector('[data-qr-code="true"] canvas');

      if (!qrCanvas) {
        console.warn("QR Code canvas tidak ditemukan.");
      } else {
        console.log("QR Code:", {
          width: qrCanvas.width,
          height: qrCanvas.height,
        });
      }

      // --------------------------------------------------------
      // HTML2CANVAS
      //
      // PENTING:
      // Jangan clone element.
      //
      // Karena QRCodeCanvas menggunakan <canvas>.
      // cloneNode() tidak membawa pixel QR Code.
      // --------------------------------------------------------
      const canvas = await html2canvas(element, {
        scale: 4,

        useCORS: true,

        allowTaint: false,

        backgroundColor: "#ffffff",

        logging: false,

        foreignObjectRendering: false,

        imageTimeout: 30000,

        width,

        height,

        x: 0,

        y: 0,

        scrollX: 0,

        scrollY: 0,

        windowWidth: document.documentElement.clientWidth,

        windowHeight: document.documentElement.clientHeight,

        onclone: (clonedDocument) => {
          const clonedCard = clonedDocument.getElementById("kartu-siswa");

          if (!clonedCard) {
            return;
          }

          // ----------------------------------------------------
          // Jangan mengubah layout Tailwind.
          // Hanya memastikan overflow tidak memotong konten.
          // ----------------------------------------------------
          clonedCard.style.overflow = "visible";

          // ----------------------------------------------------
          // Pastikan canvas QR terlihat
          // ----------------------------------------------------
          const clonedQr = clonedCard.querySelectorAll(
            '[data-qr-code="true"] canvas',
          );

          clonedQr.forEach((canvas) => {
            canvas.style.display = "block";
            canvas.style.visibility = "visible";
            canvas.style.opacity = "1";
          });

          // ----------------------------------------------------
          // Pastikan foto terlihat
          // ----------------------------------------------------
          const clonedImages = clonedCard.querySelectorAll("img");

          clonedImages.forEach((img) => {
            img.style.display = "block";
            img.style.visibility = "visible";
            img.style.opacity = "1";
          });
        },
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas hasil kartu kosong.");
      }

      // --------------------------------------------------------
      // PNG
      // --------------------------------------------------------
      const imageData = canvas.toDataURL("image/png", 1.0);

      // --------------------------------------------------------
      // PDF
      // --------------------------------------------------------
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [CARD_WIDTH_MM, CARD_HEIGHT_MM],
        compress: true,
      });

      // --------------------------------------------------------
      // Isi satu halaman penuh
      // --------------------------------------------------------
      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        CARD_WIDTH_MM,
        CARD_HEIGHT_MM,
        undefined,
        "FAST",
      );

      // --------------------------------------------------------
      // Nama file
      // --------------------------------------------------------
      const fileName = sanitizeFileName(siswa?.name || "Kartu-Siswa");

      pdf.save(`${fileName}-KTS.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);

      alert("Gagal membuat PDF kartu siswa. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* =====================================================
          BUTTON OPEN
      ====================================================== */}
      <button
        type="button"
        onClick={handleOpen}
        title="Lihat Kartu Tanda Siswa"
        className="
          group
          inline-flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-slate-200
          bg-white
          text-slate-500
          shadow-sm
          outline-none
          transition-all
          duration-200
          hover:border-sky-200
          hover:bg-sky-50
          hover:text-sky-600
          hover:shadow
          focus:ring-2
          focus:ring-sky-500/20
          active:scale-95
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="
            h-5
            w-5
            transition-transform
            duration-200
            group-hover:scale-110
          "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </button>

      {/* =====================================================
          MODAL
      ====================================================== */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="kartu-siswa-title"
        aria-describedby="kartu-siswa-description"
      >
        <div
          className="
            fixed
            inset-0
            flex
            items-center
            justify-center
            p-4
            sm:p-6
            outline-none
          "
        >
          <div
            className="
              relative
              flex
              max-h-[95vh]
              w-full
              max-w-4xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >
            {/* =================================================
                HEADER
            ================================================== */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white
                px-5
                py-4
                sm:px-6
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-sky-50
                    text-sky-600
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M5.25 6.75h.008v.008H5.25V6.75Zm0 3h.008v.008H5.25V9.75Zm0 3h.008v.008H5.25v-.008Zm0 3h.008v.008H5.25v-.008ZM8.25 6.75h3.75M8.25 9.75h3.75M8.25 12.75h3.75M8.25 15.75h3.75M5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h2
                    id="kartu-siswa-title"
                    className="
                      truncate
                      text-base
                      font-bold
                      text-slate-800
                      sm:text-lg
                    "
                  >
                    Kartu Tanda Siswa
                  </h2>

                  <p
                    id="kartu-siswa-description"
                    className="
                      mt-0.5
                      truncate
                      text-xs
                      text-slate-500
                      sm:text-sm
                    "
                  >
                    Preview dan cetak kartu identitas siswa
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="
                  ml-3
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                  focus:outline-none
                  focus:ring-2
                  focus:ring-sky-500/20
                  active:scale-95
                "
                aria-label="Tutup"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* =================================================
                STUDENT INFO BAR
            ================================================== */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-4
                border-b
                border-slate-100
                bg-slate-50/70
                px-5
                py-3
                sm:px-6
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-sky-100
                    text-sm
                    font-bold
                    text-sky-700
                  "
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={siswa?.name || "Siswa"}
                      crossOrigin="anonymous"
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    String(siswa?.name || "S")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {siswa?.name || "-"}
                  </p>

                  <p className="text-xs text-slate-400">
                    NIS: {siswa?.nis || "-"}
                    <span className="mx-1">•</span>
                    {siswa?.kelas || "-"}
                  </p>
                </div>
              </div>

              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-emerald-100
                  bg-emerald-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-emerald-600
                  sm:flex
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-500
                  "
                />
                Kartu Siap
              </div>
            </div>

            {/* =================================================
                BODY
            ================================================== */}
            <div
              className="
                flex
                min-h-0
                flex-1
                justify-center
                overflow-auto
                bg-slate-100
                p-4
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  min-h-full
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-100
                  p-3
                  sm:p-8
                "
              >
                {/* =================================================
                    KARTU SISWA
                ================================================== */}
                <div
                  id="kartu-siswa"
                  className="
                    relative
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    shadow-2xl
                  "
                  style={{
                    width: `${CARD_WIDTH_PX}px`,
                    height: `${CARD_HEIGHT_PX}px`,
                    backgroundColor: "#FFFFFF",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                >
                  {/* =================================================
                      HEADER KARTU
                  ================================================== */}
                  <div
                    className="
                      relative
                      overflow-hidden
                      px-6
                      py-4
                    "
                    style={{
                      height: "96px",
                      backgroundColor: "#0284C7",
                      color: "#FFFFFF",
                    }}
                  >
                    {/* Dekorasi */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "210px",
                        height: "210px",
                        right: "-50px",
                        top: "-85px",
                        backgroundColor: "rgba(14,165,233,0.55)",
                      }}
                    />

                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "230px",
                        height: "230px",
                        right: "-90px",
                        bottom: "-150px",
                        backgroundColor: "rgba(255,255,255,0.10)",
                      }}
                    />

                    <div className="relative flex items-center gap-4">
                      {/* Logo */}
                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          shadow
                        "
                        style={{
                          width: "64px",
                          height: "64px",
                          backgroundColor: "#FFFFFF",
                        }}
                      >
                        {sekolah.image_profile ? (
                          <img
                            src={repo + sekolah.image_profile}
                            alt={sekolah?.nama_sekolah || "Siswa"}
                            crossOrigin="anonymous"
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <span
                            style={{
                              color: "#0284C7",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            SEKOLAH
                          </span>
                        )}
                      </div>

                      <div>
                        <p
                          style={{
                            margin: 0,
                            color: "#E0F2FE",
                            fontSize: "10px",
                            fontWeight: 500,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                          }}
                        >
                          Kartu Identitas
                        </p>

                        <h1
                          style={{
                            margin: "2px 0",
                            color: "#FFFFFF",
                            fontSize: "25px",
                            lineHeight: "1.1",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          KARTU TANDA SISWA
                        </h1>

                        <p
                          style={{
                            margin: 0,
                            color: "#E0F2FE",
                            fontSize: "9px",
                          }}
                        >
                          {sekolah.nama_sekolah}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      BODY KARTU
                  ================================================== */}
                  <div
                    className="flex"
                    style={{
                      gap: "14px",
                      padding: "16px 22px",
                    }}
                  >
                    {/* FOTO */}
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                      "
                      style={{
                        width: "100px",
                        height: "132px",
                        border: "2px solid #E0F2FE",
                        backgroundColor: "#F1F5F9",
                      }}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={siswa?.name || "Siswa"}
                          crossOrigin="anonymous"
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <span
                          style={{
                            color: "#94A3B8",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          FOTO
                        </span>
                      )}
                    </div>

                    {/* DATA SISWA */}
                    <div
                      style={{
                        width: "245px",
                        minWidth: 0,
                        paddingTop: "1px",
                      }}
                    >
                      <DataRow label="NIS" value={siswa?.nis} />

                      <DataRow label="Nama" value={siswa?.name} />

                      <DataRow label="Tempat/Tgl Lahir" value={siswa?.ttl} />

                      <DataRow
                        label="Jenis Kelamin"
                        value={siswa?.jenis_kelamin}
                      />

                      <DataRow label="Alamat" value={siswa?.alamat} />
                    </div>

                    {/* QR CODE */}
                    <div
                      data-qr-code="true"
                      className="
                        flex
                        shrink-0
                        flex-col
                        items-center
                        justify-center
                      "
                      style={{
                        width: "82px",
                      }}
                    >
                      <div
                        className="
                          rounded-xl
                          p-1
                          shadow-sm
                        "
                        style={{
                          border: "1px solid #E2E8F0",
                          backgroundColor: "#FFFFFF",
                        }}
                      >
                        <QRCodeCanvas
                          value={String(siswa?.nis || "")}
                          size={100}
                          level="H"
                          includeMargin={true}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />
                      </div>

                      <span
                        style={{
                          marginTop: "4px",
                          color: "#94A3B8",
                          fontSize: "7px",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        SCAN DATA SISWA
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      FOOTER KARTU
                  ================================================== */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      flex
                      items-center
                      justify-between
                    "
                    style={{
                      height: "38px",
                      padding: "0 22px",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#94A3B8",
                        fontSize: "8px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Kartu ini adalah identitas resmi siswa.
                    </p>

                    <p
                      style={{
                        margin: 0,
                        color: "#0284C7",
                        fontSize: "9px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      TAHUN AJARAN 2026/2027
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                FOOTER MODAL
            ================================================== */}
            <div
              className="
                flex
                shrink-0
                flex-col
                gap-3
                border-t
                border-slate-200
                bg-white
                px-5
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-6
              "
            >
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-500">
                  Ukuran kartu standar ID-1
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  85,6 × 54 mm • Siap dicetak
                </p>
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-800
                    focus:outline-none
                    focus:ring-2
                    focus:ring-slate-500/10
                    active:scale-[0.98]
                    sm:flex-none
                  "
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-sky-600
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    shadow-sky-600/20
                    transition
                    hover:bg-sky-700
                    hover:shadow-md
                    hover:shadow-sky-600/20
                    focus:outline-none
                    focus:ring-2
                    focus:ring-sky-500/30
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:flex-none
                  "
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="
                          h-4
                          w-4
                          animate-spin
                        "
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Membuat PDF...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3"
                        />
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ===============================================================
// DATA ROW
// ===============================================================
function DataRow({ label, value }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : String(value);

  return (
    <div
      style={{
        display: "grid",

        // Label lebih kecil agar area value
        // lebih luas.
        gridTemplateColumns: "92px minmax(0, 1fr)",

        columnGap: "4px",

        marginBottom: "5px",

        fontSize: "10px",

        lineHeight: "1.25",

        alignItems: "start",
      }}
    >
      <span
        style={{
          color: "#94A3B8",
          fontWeight: 500,

          // Label boleh turun baris
          // jika diperlukan.
          whiteSpace: "normal",

          overflowWrap: "break-word",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#334155",
          fontWeight: 600,

          // TIDAK menggunakan:
          // overflow: hidden
          // textOverflow: ellipsis
          // whiteSpace: nowrap

          whiteSpace: "normal",

          overflowWrap: "anywhere",

          wordBreak: "break-word",
        }}
      >
        : {displayValue}
      </span>
    </div>
  );
}

export default KartuTandaSiswa;
