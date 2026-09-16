import { Box, Modal } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import React from "react";
import repo from "../../utils/repo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const style = {
  position: "absolute",
  top: "90%",
  left: "50%",
  transform: "translate(-50%, -80%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #FFF",
  boxShadow: 24,
  borderRadius: 1,
  p: 3,
};

function KartuTandaSiswa({ siswa }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("kartu-siswa");

    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png");

      // Ukuran kartu ID-1: 85.6 x 54 mm
      const cardWidth = 85.6;
      const cardHeight = 54;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [cardWidth, cardHeight],
      });

      pdf.addImage(imageData, "PNG", 0, 0, cardWidth, cardHeight);

      pdf.save(`${siswa.nama}-KTS.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
    }
  };

  return (
    <>
      <div className="cursor-pointer outline-none" onClick={handleOpen}>
        <div className="rounded-md p-1 flex flex-row justify-center items-center font-bold border border-lime-500 text-sm gap-x-1 hover:bg-white hover:text-lime-500 cursor-pointer bg-lime-500 text-white transition duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          <p>Tambah data</p>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-full overflow-hidden overflow-y-auto  rounded-lg ">
            <div className="absolute top-1 right-1">
              <button
                className="outline-none w-5 h-5 border border-slate-300 flex justify-center items-center rounded-full text-slate-500 transition duration-200 hover:border-slate-500 hover:bg-white"
                onClick={handleClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-3 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-sky-700 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3"
                  />
                </svg>
                Download Kartu PDF
              </button>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div
                  id="kartu-siswa"
                  className="relative h-[340px] w-[540px] overflow-hidden rounded-2xl shadow-2xl"
                  style={{
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {/* Header */}
                  <div
                    className="relative h-24 overflow-hidden px-6 py-4"
                    style={{
                      backgroundColor: "#0284C7",
                      color: "#FFFFFF",
                    }}
                  >
                    <div
                      className="absolute -right-10 -top-20 h-52 w-52 rounded-full"
                      style={{
                        backgroundColor: "rgba(14, 165, 233, 0.5)",
                      }}
                    />

                    <div
                      className="absolute -right-20 -bottom-32 h-56 w-56 rounded-full"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    />

                    <div className="relative flex items-center gap-4">
                      {/* Logo */}
                      <div
                        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow"
                        style={{
                          backgroundColor: "#FFFFFF",
                        }}
                      >
                        <img
                          src={repo + siswa.image_profile}
                          alt={siswa.name}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p
                          className="text-xs font-medium uppercase tracking-widest"
                          style={{ color: "#E0F2FE" }}
                        >
                          Kartu Identitas
                        </p>

                        <h1 className="text-2xl font-extrabold tracking-wide">
                          KARTU TANDA SISWA
                        </h1>

                        <p className="text-xs" style={{ color: "#E0F2FE" }}>
                          NAMA SEKOLAH
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex gap-5 px-6 py-5">
                    {/* Foto */}
                    <div
                      className="flex h-36 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2"
                      style={{
                        borderColor: "#E0F2FE",
                        backgroundColor: "#F1F5F9",
                      }}
                    >
                      {repo + siswa.image_profile ? (
                        <img
                          src={repo + siswa.image_profile}
                          alt={siswa.name}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#94A3B8" }}
                        >
                          FOTO
                        </span>
                      )}
                    </div>

                    {/* Data siswa */}
                    <div className="flex-1 space-y-2 text-sm">
                      <DataRow label="NIS" value={siswa.nis} />
                      <DataRow label="Nama" value={siswa.name} />
                      <DataRow label="Kelas" value={siswa.kelas} />

                      <DataRow
                        label="Tempat/Tgl Lahir"
                        value={siswa.tempatTanggalLahir}
                      />

                      <DataRow
                        label="Jenis Kelamin"
                        value={siswa.jenis_kelamin}
                      />

                      <DataRow label="Alamat" value={siswa.alamat} />
                    </div>

                    {/* QR */}
                    <div className="flex shrink-0 flex-col items-center justify-center">
                      <div
                        className="rounded-xl border p-0.5 shadow-sm"
                        style={{
                          borderColor: "#E2E8F0",
                          backgroundColor: "#FFFFFF",
                        }}
                      >
                        <QRCodeCanvas
                          value={siswa.nis}
                          size={82}
                          level="H"
                          includeMargin
                        />
                      </div>

                      <span
                        className="mt-1 text-[9px] font-medium"
                        style={{ color: "#94A3B8" }}
                      >
                        SCAN DATA SISWA
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3"
                    style={{
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <p
                      className="text-[10px] font-medium"
                      style={{ color: "#94A3B8" }}
                    >
                      Kartu ini adalah identitas resmi siswa.
                    </p>

                    <p
                      className="text-xs font-bold"
                      style={{ color: "#0284C7" }}
                    >
                      TAHUN AJARAN 2026/2027
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="grid grid-cols-[105px_1fr]">
      <span className="font-medium" style={{ color: "#94A3B8" }}>
        {label}
      </span>

      <span className="font-semibold" style={{ color: "#334155" }}>
        : {value || "-"}
      </span>
    </div>
  );
}
export default KartuTandaSiswa;
