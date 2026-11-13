import { useCallback, useEffect, useState } from "react";
import {
  User,
  Upload,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  FileText,
  Users,
  AlertCircle,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";
import Main from "./components/Main";
import api from "../../../utils/repositories";
import repo from "../../../utils/repo";

export default function FormulirPPDB() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Mengambil dan membersihkan username dari localStorage
  const rawUsername = localStorage.getItem("username") || "user";
  const username = rawUsername.replace(/^["'](.+)["']$/, "$1").trim();

  // Status sukses ditentukan murni berdasarkan keberadaan data dari server via dataCalonSiswa
  const [isSuccess, setIsSuccess] = useState(false);

  // State Formulir
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    nisn: "",
    agama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    sekolahAsal: "",
    tahunLulus: "",
    alamatLengkap: "",
    nikAyah: "",
    namaAyah: "",
    pekerjaanAyah: "",
    nikIbu: "",
    namaIbu: "",
    pekerjaanIbu: "",
    namaWali: "",
    pekerjaanWali: "",
    nomorTelepon: "",
    ijazahFile: null,
    kkFile: null,
    aktaFile: null,
    ktpOrtuFile: null,
    pasFotoFile: null,
  });

  const [errors, setErrors] = useState({
    namaLengkap: "",
    nik: "",
    nisn: "",
    agama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    sekolahAsal: "",
    tahunLulus: "",
    alamatLengkap: "",
    nikAyah: "",
    namaAyah: "",
    pekerjaanAyah: "",
    nikIbu: "",
    namaIbu: "",
    pekerjaanIbu: "",
    nomorTelepon: "",
    ijazahFile: "",
    kkFile: "",
    aktaFile: "",
    ktpOrtuFile: "",
    pasFotoFile: "",
  });

  const [previewFile, setPreviewFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = () => {
    let newErrors = { ...errors };
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.namaLengkap.trim()) {
        newErrors.namaLengkap = "Nama lengkap siswa wajib diisi.";
        isValid = false;
      }
      if (!formData.nik.trim()) {
        newErrors.nik = "NIK wajib diisi.";
        isValid = false;
      } else if (formData.nik.length < 16) {
        newErrors.nik = "NIK harus 16 digit.";
        isValid = false;
      }
      if (!formData.nisn.trim()) {
        newErrors.nisn = "NISN wajib diisi.";
        isValid = false;
      } else if (formData.nisn.length < 10) {
        newErrors.nisn = "NISN harus 10 digit.";
        isValid = false;
      }
      if (!formData.agama) {
        newErrors.agama = "Pilih agama.";
        isValid = false;
      }
      if (!formData.jenisKelamin) {
        newErrors.jenisKelamin = "Pilih jenis kelamin.";
        isValid = false;
      }
      if (!formData.tempatLahir.trim()) {
        newErrors.tempatLahir = "Tempat lahir wajib diisi.";
        isValid = false;
      }
      if (!formData.tanggalLahir) {
        newErrors.tanggalLahir = "Tanggal lahir wajib diisi.";
        isValid = false;
      }
      if (!formData.sekolahAsal.trim()) {
        newErrors.sekolahAsal = "Sekolah asal wajib diisi.";
        isValid = false;
      }
      if (!formData.tahunLulus.trim()) {
        newErrors.tahunLulus = "Tahun lulus wajib diisi.";
        isValid = false;
      }
      if (!formData.alamatLengkap.trim()) {
        newErrors.alamatLengkap = "Alamat lengkap wajib diisi.";
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.nikAyah.trim()) {
        newErrors.nikAyah = "NIK Ayah wajib diisi.";
        isValid = false;
      }
      if (!formData.namaAyah.trim()) {
        newErrors.namaAyah = "Nama Ayah wajib diisi.";
        isValid = false;
      }
      if (!formData.pekerjaanAyah.trim()) {
        newErrors.pekerjaanAyah = "Pekerjaan Ayah wajib diisi.";
        isValid = false;
      }
      if (!formData.nikIbu.trim()) {
        newErrors.nikIbu = "NIK Ibu wajib diisi.";
        isValid = false;
      }
      if (!formData.namaIbu.trim()) {
        newErrors.namaIbu = "Nama Ibu wajib diisi.";
        isValid = false;
      }
      if (!formData.pekerjaanIbu.trim()) {
        newErrors.pekerjaanIbu = "Pekerjaan Ibu wajib diisi.";
        isValid = false;
      }
      if (!formData.nomorTelepon.trim()) {
        newErrors.nomorTelepon = "Nomor telepon wajib diisi.";
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!formData.ijazahFile) {
        newErrors.ijazahFile = "Scan Ijazah wajib diunggah.";
        isValid = false;
      }
      if (!formData.kkFile) {
        newErrors.kkFile = "Scan KK wajib diunggah.";
        isValid = false;
      }
      if (!formData.aktaFile) {
        newErrors.aktaFile = "Scan Akta Kelahiran wajib diunggah.";
        isValid = false;
      }
      if (!formData.ktpOrtuFile) {
        newErrors.ktpOrtuFile = "Scan KTP Orang Tua wajib diunggah.";
        isValid = false;
      }
      if (!formData.pasFotoFile) {
        newErrors.pasFotoFile = "Pas Foto wajib diunggah.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    const data = new FormData();
    data.append("nama_lengkap", formData.namaLengkap);
    data.append("id_user_calon_siswa", username);
    data.append("nik", formData.nik);
    data.append("nisn", formData.nisn);
    data.append("jenis_kelamin", formData.jenisKelamin);
    data.append("agama", formData.agama);
    data.append("ttl", `${formData.tempatLahir}, ${formData.tanggalLahir}`);
    data.append("alamat", formData.alamatLengkap);
    data.append("sekolah_asal", formData.sekolahAsal);
    data.append("tahun_lulus", formData.tahunLulus);

    data.append("nik_ayah", formData.nikAyah);
    data.append("nama_ayah", formData.namaAyah);
    data.append("pekerjaan_ayah", formData.pekerjaanAyah);
    data.append("nik_ibu", formData.nikIbu);
    data.append("nama_ibu", formData.namaIbu);
    data.append("pekerjaan_ibu", formData.pekerjaanIbu);
    data.append("nama_wali", formData.namaWali || "");
    data.append("pekerjaan_wali", formData.pekerjaanWali || "");
    data.append("nomor_telepon", formData.nomorTelepon);

    const documents = [
      { file: formData.ijazahFile, type: "Ijazah" },
      { file: formData.kkFile, type: "Kartu Keluarga" },
      { file: formData.aktaFile, type: "Akta Lahir" },
      { file: formData.ktpOrtuFile, type: "KTP Orang Tua" },
      { file: formData.pasFotoFile, type: "Pas Foto" },
    ];

    documents.forEach((doc) => {
      if (doc.file && typeof doc.file !== "string") {
        data.append("dokumen", doc.file);
        data.append("jenis_dokumen", doc.type);
      }
    });

    try {
      const response = await api.post("ppdb/formulir", data);

      if (response.status === 200 || response.data?.status === 200) {
        await dataCalonSiswa();
      } else {
        setErrorMessage(
          response.data?.message || "Gagal mengirim formulir pendaftaran.",
        );
      }
    } catch (error) {
      const errRes = error.response?.data;

      if (errRes && typeof errRes.message === "object") {
        const messages = Object.values(errRes.message).join(", ");
        setErrorMessage(messages);
      } else {
        setErrorMessage(
          errRes?.message ||
            "Terjadi kesalahan jaringan atau server tidak merespons.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk mendapatkan nama file
  const getFileNameFromPath = (filePath) => {
    if (!filePath) return "-";
    if (typeof filePath !== "string") return filePath.name || "File Terpilih";
    return filePath.replace(/\\/g, "/").split("/").pop();
  };

  // Helper untuk mengubah path relatif Windows dari server menjadi URL valid
  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (typeof filePath !== "string") return URL.createObjectURL(filePath);

    const normalizedPath = filePath.replace(/\\/g, "/");

    if (
      normalizedPath.startsWith("http://") ||
      normalizedPath.startsWith("https://")
    ) {
      return normalizedPath;
    }

    const rawBaseUrl = api.defaults.baseURL || repo;
    const cleanBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "");

    return `${cleanBaseUrl.replace(/\/$/, "")}/${normalizedPath.replace(/^\//, "")}`;
  };

  // ================= PENGAMBILAN DATA SISWA & DOKUMEN =================
  const dataCalonSiswa = useCallback(async () => {
    try {
      // 1. Ambil data utama siswa
      const response = await api.get(`ppdb/data-siswa/${username}`);
      const resData = response.data?.data || response.data;

      if (resData) {
        setFormData((prev) => ({
          ...prev,
          namaLengkap: resData.calon_siswa?.nama_lengkap || "",
          nik: resData.calon_siswa?.nik || "",
          nisn: resData.calon_siswa?.nisn || "",
          agama: resData.calon_siswa?.agama || "",
          jenisKelamin: resData.calon_siswa?.jenis_kelamin || "",
          sekolahAsal: resData.calon_siswa?.sekolah_asal || "",
          tahunLulus: resData.calon_siswa?.tahun_lulus || "",
          alamatLengkap: resData.calon_siswa?.alamat || "",
          ttl: resData.calon_siswa?.ttl || "",
          nikAyah: resData.orang_tua?.nik_ayah || "",
          namaAyah: resData.orang_tua?.nama_ayah || "",
          pekerjaanAyah: resData.orang_tua?.pekerjaan_ayah || "",
          nikIbu: resData.orang_tua?.nik_ibu || "",
          namaIbu: resData.orang_tua?.nama_ibu || "",
          pekerjaanIbu: resData.orang_tua?.pekerjaan_ibu || "",
          namaWali: resData.orang_tua?.nama_wali || "",
          pekerjaanWali: resData.orang_tua?.pekerjaan_wali || "",
          nomorTelepon: resData.orang_tua?.nomor_telepon || "",
        }));

        // 2. Ambil data dokumen persyaratan (Response berupa Array of Objects)
        try {
          const docResponse = await api.get(
            `ppdb/dokumen-persyaratan/${username}`,
          );
          const docDataList = docResponse.data?.data || docResponse.data;

          if (Array.isArray(docDataList)) {
            const ijazahItem = docDataList.find(
              (item) => item.jenis_dokumen === "Ijazah",
            );
            const kkItem = docDataList.find(
              (item) => item.jenis_dokumen === "Kartu Keluarga",
            );
            const aktaItem = docDataList.find(
              (item) => item.jenis_dokumen === "Akta Lahir",
            );
            const ktpOrtuItem = docDataList.find(
              (item) => item.jenis_dokumen === "KTP Orang Tua",
            );
            const pasFotoItem = docDataList.find(
              (item) => item.jenis_dokumen === "Pas Foto",
            );

            setFormData((prev) => ({
              ...prev,
              ijazahFile: ijazahItem?.path_file || prev.ijazahFile,
              kkFile: kkItem?.path_file || prev.kkFile,
              aktaFile: aktaItem?.path_file || prev.aktaFile,
              ktpOrtuFile: ktpOrtuItem?.path_file || prev.ktpOrtuFile,
              pasFotoFile: pasFotoItem?.path_file || prev.pasFotoFile,
            }));
          }
        } catch (docErr) {
          console.error("Gagal memuat dokumen persyaratan:", docErr);
        }

        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Belum ada data pendaftaran:", error);
      setIsSuccess(false);
    }
  }, [username]);

  useEffect(() => {
    dataCalonSiswa();
  }, [dataCalonSiswa]);

  const openPreview = (file) => {
    if (!file) return;
    const fileUrl = getFileUrl(file);
    const fileName = getFileNameFromPath(file);

    let fileType = "";
    if (typeof file === "string") {
      const cleanPath = file.replace(/\\/g, "/");
      const extension = cleanPath.split(".").pop().toLowerCase();
      if (["pdf"].includes(extension)) {
        fileType = "application/pdf";
      } else if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
        fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;
      }
    } else {
      fileType = file.type;
    }

    setPreviewFile({ url: fileUrl, type: fileType, name: fileName });
  };

  return (
    <Main>
      <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-8 w-full">
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* ================= HEADER BRANDING ================= */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <GraduationCap className="w-7 h-7 text-blue-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Formulir PPDB Online
                </h1>
                <p className="text-xs sm:text-sm text-blue-200">
                  Tahun Ajaran 2026/2027
                </p>
              </div>
            </div>

            {/* PROGRESS STEPPER */}
            {!isSuccess && (
              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                {[
                  { step: 1, title: "Data Siswa", icon: User },
                  { step: 2, title: "Data Orang Tua", icon: Users },
                  { step: 3, title: "Upload Berkas", icon: FileText },
                ].map((item) => {
                  const isActive = currentStep === item.step;
                  const isPassed = currentStep > item.step;

                  return (
                    <div key={item.step} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? "bg-emerald-500 text-white"
                            : isActive
                              ? "bg-white text-blue-600 shadow-md"
                              : "bg-white/10 text-white/60"
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          item.step
                        )}
                      </div>
                      <div className="hidden sm:block text-left">
                        <p
                          className={`text-xs font-semibold ${isActive ? "text-white" : "text-white/60"}`}
                        >
                          {item.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= TAMPILAN SUKSES DENGAN DETAIL DATA ================= */}
          {isSuccess ? (
            <div className="p-6 sm:p-10 space-y-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Pendaftaran Berhasil! 🎉
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                    Formulir calon siswa atas nama{" "}
                    <span className="font-semibold text-slate-800">
                      {formData.namaLengkap || "Pendaftar"}
                    </span>{" "}
                    telah tersimpan dengan aman di sistem database. Data Anda
                    sekarang terkunci dan sedang menunggu verifikasi panitia.
                  </p>
                </div>
              </div>

              {/* KARTU RINCIAN / DETAIL DATA */}
              <div className="space-y-6 max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Rincian Data
                    Pendaftaran
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                    Terkunci & Tersimpan
                  </span>
                </div>

                {/* Bagian 1: Data Pribadi Siswa */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    1. Data Pribadi Calon Siswa
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block">
                        ID Pendaftar (User):
                      </span>
                      <strong className="text-slate-800">{username}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">
                        Nama Lengkap:
                      </span>
                      <strong className="text-slate-800">
                        {formData.namaLengkap || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">NIK:</span>
                      <strong className="text-slate-800">
                        {formData.nik || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">NISN:</span>
                      <strong className="text-slate-800">
                        {formData.nisn || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">
                        Jenis Kelamin:
                      </span>
                      <strong className="text-slate-800">
                        {formData.jenisKelamin || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Agama:</span>
                      <strong className="text-slate-800">
                        {formData.agama || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">
                        Tempat, Tanggal Lahir:
                      </span>
                      <strong className="text-slate-800">
                        {formData.ttl || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">
                        Sekolah Asal & Tahun Lulus:
                      </span>
                      <strong className="text-slate-800">
                        {formData.sekolahAsal} ({formData.tahunLulus})
                      </strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">
                        Alamat Lengkap:
                      </span>
                      <strong className="text-slate-800">
                        {formData.alamatLengkap || "-"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Data Orang Tua / Wali */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    2. Data Orang Tua / Wali
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block">
                        Nama Ayah / Pekerjaan:
                      </span>
                      <strong className="text-slate-800">
                        {formData.namaAyah} ({formData.pekerjaanAyah})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">NIK Ayah:</span>
                      <strong className="text-slate-800">
                        {formData.nikAyah || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">
                        Nama Ibu / Pekerjaan:
                      </span>
                      <strong className="text-slate-800">
                        {formData.namaIbu} ({formData.pekerjaanIbu})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">NIK Ibu:</span>
                      <strong className="text-slate-800">
                        {formData.nikIbu || "-"}
                      </strong>
                    </div>
                    {formData.namaWali && (
                      <div>
                        <span className="text-slate-400 block">
                          Nama Wali / Pekerjaan:
                        </span>
                        <strong className="text-slate-800">
                          {formData.namaWali} ({formData.pekerjaanWali || "-"})
                        </strong>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block">
                        Nomor Telepon / WhatsApp:
                      </span>
                      <strong className="text-slate-800">
                        {formData.nomorTelepon || "-"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bagian 3: Berkas Persyaratan Terunggah Beserta Path URL */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3. Berkas Persyaratan Terunggah
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-xs bg-white p-4 rounded-xl border border-slate-200">
                    {[
                      { label: "Scan Ijazah", file: formData.ijazahFile },
                      { label: "Scan Kartu Keluarga", file: formData.kkFile },
                      { label: "Scan Akta Kelahiran", file: formData.aktaFile },
                      {
                        label: "Scan KTP Orang Tua",
                        file: formData.ktpOrtuFile,
                      },
                      { label: "Pas Foto Terbaru", file: formData.pasFotoFile },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 gap-2"
                      >
                        <span className="text-slate-600 font-medium">
                          {item.label}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-mono text-[11px] bg-slate-200/60 px-2 py-0.5 rounded max-w-[240px] truncate">
                            {getFileNameFromPath(item.file)}
                          </span>
                          {item.file && (
                            <button
                              type="button"
                              onClick={() => openPreview(item.file)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= FORM BODY ================= */
            <form onSubmit={handleNext} className="p-6 sm:p-8 space-y-5">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: DATA SISWA */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="w-4 h-4 text-blue-600" /> Data Pribadi
                    Calon Siswa
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nama Lengkap Siswa *
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      placeholder="Contoh: Budi Santoso"
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.namaLengkap
                          ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                          : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                      }`}
                    />
                    {errors.namaLengkap && (
                      <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                        {errors.namaLengkap}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        NIK (Nomor Induk Kependudukan) *
                      </label>
                      <input
                        type="number"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        placeholder="16 digit NIK"
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.nik
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      />
                      {errors.nik && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.nik}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        NISN *
                      </label>
                      <input
                        type="number"
                        name="nisn"
                        value={formData.nisn}
                        onChange={handleChange}
                        placeholder="10 digit NISN"
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.nisn
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      />
                      {errors.nisn && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.nisn}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Agama *
                      </label>
                      <select
                        name="agama"
                        value={formData.agama}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-700 ${
                          errors.agama
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      >
                        <option value="">-- Pilih Agama --</option>
                        <option value="Islam">Islam</option>
                        <option value="Kristen Protestan">
                          Kristen Protestan
                        </option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                      {errors.agama && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.agama}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Jenis Kelamin *
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-700 ${
                          errors.jenisKelamin
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      >
                        <option value="">-- Pilih Jenis Kelamin --</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      {errors.jenisKelamin && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.jenisKelamin}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tempat Lahir *
                      </label>
                      <input
                        type="text"
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleChange}
                        placeholder="Kota kelahiran"
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.tempatLahir
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      />
                      {errors.tempatLahir && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.tempatLahir}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-700 ${
                          errors.tanggalLahir
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      />
                      {errors.tanggalLahir && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.tanggalLahir}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Sekolah Asal *
                      </label>
                      <input
                        type="text"
                        name="sekolahAsal"
                        value={formData.sekolahAsal}
                        onChange={handleChange}
                        placeholder="Contoh: SMPN 1"
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.sekolahAsal
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      />
                      {errors.sekolahAsal && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.sekolahAsal}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tahun Lulus *
                      </label>
                      <input
                        type="number"
                        name="tahunLulus"
                        value={formData.tahunLulus}
                        onChange={handleChange}
                        placeholder="Contoh: 2026"
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.tahunLulus
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      />
                      {errors.tahunLulus && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.tahunLulus}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      name="alamatLengkap"
                      rows="3"
                      value={formData.alamatLengkap}
                      onChange={handleChange}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.alamatLengkap
                          ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                          : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                      }`}
                    />
                    {errors.alamatLengkap && (
                      <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                        {errors.alamatLengkap}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: DATA ORANG TUA / WALI */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Users className="w-4 h-4 text-blue-600" /> Data Orang Tua /
                    Wali
                  </h3>

                  {/* Bagian Ayah */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Informasi Ayah Kandung
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          NIK Ayah *
                        </label>
                        <input
                          type="number"
                          name="nikAyah"
                          value={formData.nikAyah}
                          onChange={handleChange}
                          placeholder="16 digit NIK Ayah"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.nikAyah
                              ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                              : "border-slate-200 focus:ring-blue-600/20"
                          }`}
                        />
                        {errors.nikAyah && (
                          <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                            {errors.nikAyah}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Nama Ayah *
                        </label>
                        <input
                          type="text"
                          name="namaAyah"
                          value={formData.namaAyah}
                          onChange={handleChange}
                          placeholder="Nama lengkap Ayah"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.namaAyah
                              ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                              : "border-slate-200 focus:ring-blue-600/20"
                          }`}
                        />
                        {errors.namaAyah && (
                          <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                            {errors.namaAyah}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Pekerjaan Ayah *
                      </label>
                      <input
                        type="text"
                        name="pekerjaanAyah"
                        value={formData.pekerjaanAyah}
                        onChange={handleChange}
                        placeholder="Pekerjaan Ayah"
                        className={`w-full px-3 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.pekerjaanAyah
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20"
                        }`}
                      />
                      {errors.pekerjaanAyah && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.pekerjaanAyah}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bagian Ibu */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Informasi Ibu Kandung
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          NIK Ibu *
                        </label>
                        <input
                          type="number"
                          name="nikIbu"
                          value={formData.nikIbu}
                          onChange={handleChange}
                          placeholder="16 digit NIK Ibu"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.nikIbu
                              ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                              : "border-slate-200 focus:ring-blue-600/20"
                          }`}
                        />
                        {errors.nikIbu && (
                          <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                            {errors.nikIbu}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Nama Ibu *
                        </label>
                        <input
                          type="text"
                          name="namaIbu"
                          value={formData.namaIbu}
                          onChange={handleChange}
                          placeholder="Nama lengkap Ibu"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.namaIbu
                              ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                              : "border-slate-200 focus:ring-blue-600/20"
                          }`}
                        />
                        {errors.namaIbu && (
                          <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                            {errors.namaIbu}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Pekerjaan Ibu *
                      </label>
                      <input
                        type="text"
                        name="pekerjaanIbu"
                        value={formData.pekerjaanIbu}
                        onChange={handleChange}
                        placeholder="Pekerjaan Ibu"
                        className={`w-full px-3 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.pekerjaanIbu
                            ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                            : "border-slate-200 focus:ring-blue-600/20"
                        }`}
                      />
                      {errors.pekerjaanIbu && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {errors.pekerjaanIbu}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bagian Wali (Opsional) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Informasi Wali (Opsional)
                      </h4>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        Tidak Wajib
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Nama Wali
                        </label>
                        <input
                          type="text"
                          name="namaWali"
                          value={formData.namaWali}
                          onChange={handleChange}
                          placeholder="Nama wali (jika ada)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Pekerjaan Wali
                        </label>
                        <input
                          type="text"
                          name="pekerjaanWali"
                          value={formData.pekerjaanWali}
                          onChange={handleChange}
                          placeholder="Pekerjaan wali"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nomor Telepon Utama */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      No. Telepon / WhatsApp Orang Tua *
                    </label>
                    <input
                      type="tel"
                      name="nomorTelepon"
                      value={formData.nomorTelepon}
                      onChange={handleChange}
                      placeholder="081234567890"
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.nomorTelepon
                          ? "border-red-400 bg-red-50/20 focus:ring-red-400/20"
                          : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"
                      }`}
                    />
                    {errors.nomorTelepon && (
                      <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                        {errors.nomorTelepon}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: UPLOAD BERKAS PERSYARATAN */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Upload Berkas
                    Persyaratan
                  </h3>

                  {[
                    {
                      name: "ijazahFile",
                      label: "Scan Ijazah / Surat Keterangan Lulus (PDF/JPG)",
                      errorKey: errors.ijazahFile,
                    },
                    {
                      name: "kkFile",
                      label: "Scan Kartu Keluarga (PDF/JPG)",
                      errorKey: errors.kkFile,
                    },
                    {
                      name: "aktaFile",
                      label: "Scan Akta Kelahiran (PDF/JPG)",
                      errorKey: errors.aktaFile,
                    },
                    {
                      name: "ktpOrtuFile",
                      label: "Scan KTP Orang Tua (Ayah / Ibu) (PDF/JPG)",
                      errorKey: errors.ktpOrtuFile,
                    },
                    {
                      name: "pasFotoFile",
                      label: "Pas Foto Terbaru 3x4 (JPG/PNG)",
                      errorKey: errors.pasFotoFile,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {item.label} <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-2xl p-3.5 text-center bg-slate-50 transition-colors flex items-center justify-between px-4 ${
                          item.errorKey
                            ? "border-red-400 bg-red-50/20"
                            : "border-slate-200 hover:border-blue-500"
                        }`}
                      >
                        <input
                          type="file"
                          name={item.name}
                          accept=".pdf, .jpg, .jpeg, .png"
                          onChange={handleChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-2 text-slate-600 text-xs truncate mr-2 pointer-events-none">
                          <Upload className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">
                            {formData[item.name]
                              ? `File terpilih: ${getFileNameFromPath(formData[item.name])}`
                              : "Klik atau tarik file ke sini (PDF / JPG / PNG)"}
                          </span>
                        </div>

                        {formData[item.name] && (
                          <button
                            type="button"
                            onClick={() => openPreview(formData[item.name])}
                            className="relative z-10 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </button>
                        )}
                      </div>
                      {item.errorKey && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                          {item.errorKey}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2 text-blue-900 text-xs shadow-sm">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="font-medium leading-relaxed">
                      Tolong periksa kembali data Anda sebelum melakukan kirim
                      pendaftaran. Pastikan data diri, informasi orang tua, dan
                      dokumen yang diunggah sudah benar.
                    </p>
                  </div>
                </div>
              )}

              {/* NAVIGASI TOMBOL */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {currentStep === 3
                          ? "Kirim Pendaftaran"
                          : "Langkah Selanjutnya"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ================= MODAL PREVIEW FILE (PDF / GAMBAR) ================= */}
        {previewFile && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
                    {previewFile.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 uppercase truncate max-w-md">
                    {previewFile.url}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-900/5">
                {previewFile.url &&
                previewFile.url.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={previewFile.url}
                    title="PDF Preview"
                    className="w-full h-[60vh] rounded-xl border border-slate-200 bg-white"
                  />
                ) : (
                  <img
                    src={previewFile.url}
                    alt="Preview"
                    className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-md border border-slate-200"
                  />
                )}
              </div>

              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <a
                  href={previewFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka di Tab Baru
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Main>
  );
}
