import { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
import Groq from "groq-sdk";
import axios from "axios";
import repo from "../../../utils/repo";

// Inisialisasi Groq Client (Gratis & Bebas Langganan)
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Diperlukan untuk pemanggilan API langsung di sisi client (React)
});

export default function FloatingChatAI() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sekolah, setSekolah] = useState(null);
=======

export default function FloatingChatAI({
  alamatSekolah,
  teleponSekolah,
  emailSekolah,
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
>>>>>>> 288fe97 (Updated)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "ai",
<<<<<<< HEAD
      text: "Halo! Saya Asisten AI Sekolah. Ada yang bisa saya bantu terkait PPDB, Jurusan, atau informasi sekolah?",
=======
      text: "Halo! Saya Asisten AI Sekolah. Ada yang bisa saya bantu terkait PPDB, Jurusan, atau informasi guru/sekolah?",
>>>>>>> 288fe97 (Updated)
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputChat, setInputChat] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef(null);

<<<<<<< HEAD
  // Ambil profil data sekolah dari backend API
  useEffect(() => {
    const userProfile = async () => {
      try {
        const response = await axios.get(`${repo}api/profile-sekolah`);
        setSekolah(response.data?.data || null);
      } catch (error) {
        console.error("Gagal mengambil data sekolah:", error);
      }
    };
    userProfile();
  }, []);

  // Auto scroll ke pesan paling bawah saat ada percakapan baru
=======
  // Auto scroll ke pesan paling bawah
>>>>>>> 288fe97 (Updated)
  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatOpen]);

<<<<<<< HEAD
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputChat.trim() || isAiTyping) return;

    const userText = inputChat.trim();
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
=======
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: inputChat,
>>>>>>> 288fe97 (Updated)
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

<<<<<<< HEAD
    // Update state pesan pengguna & reset input
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setInputChat("");
    setIsAiTyping(true);

    try {
      // 1. Susun System Prompt / Context AI
      const systemMessage = {
        role: "system",
        content: `
          Kamu adalah Asisten AI resmi untuk sekolah ${sekolah?.nama_sekolah || "kami"}.
          Tugasmu adalah menjawab pertanyaan calon siswa atau orang tua secara ramah, profesional, dan membantu.
          
          Berikut data acuan sekolah saat ini:
          - Nama Sekolah: ${sekolah?.nama_sekolah || "Sekolah Menengah Kejuruan"}
          - Alamat Sekolah: ${sekolah?.alamat || "Belum tersedia"}
          - No. Telepon / WhatsApp: ${sekolah?.no_hp || sekolah?.no_telp || "Belum tersedia"}
          - Email Resmi: ${sekolah?.email || "Belum tersedia"}
          - Program Keahlian / Jurusan: TKJ (Teknik Komputer & Jaringan), RPL (Rekayasa Perangkat Lunak), TKR (Teknik Kendaraan Ringan), Teknik Mesin, Akuntansi (AKL), dan Teknik Konstruksi.
          - Informasi PPDB: Pendaftaran PPDB Online Tahun Ajaran ${new Date().getFullYear} sudah dibuka melalui menu PPDB di website.
          - Persyaratan Dokumen PPDB Kartu Keluarga, Akta Kelahiran, Pas foto calon siswa, KTP orang tua atau wali dan Dokumen pendukung lainnya
          - Jadwal Pendaftaran 
            1. Pendaftaran Online 01 - 30 Juni ${new Date().getFullYear}
            2. Verifikasi Berkas 01 - 10 Juli ${new Date().getFullYear}
            3. Pengumuman 11 Juli ${new Date().getFullYear}
            4. Daftar Ulang 12 - 15 Juli ${new Date().getFullYear}
          
          Jawablah dengan singkat, jelas, dan selalu gunakan Bahasa Indonesia yang sopan.
        `,
      };

      // 2. Format riwayat percakapan agar AI memiliki konteks ingatan (Memory)
      const conversationHistory = updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // 3. Panggil API Groq dengan model Llama 3.3 (Versi Terbaru & Gratis)
      const chatCompletion = await groq.chat.completions.create({
        messages: [systemMessage, ...conversationHistory],
        model: "openai/gpt-oss-20b",
        temperature: 0.7,
        max_tokens: 500,
      });

      const replyText =
        chatCompletion.choices[0]?.message?.content ||
        "Maaf, saya tidak dapat memproses jawaban saat ini.";
=======
    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = inputChat;
    setInputChat("");
    setIsAiTyping(true);

    setTimeout(() => {
      let replyText =
        "Terima kasih telah bertanya! Untuk informasi lebih rinci silakan hubungi kontak kami atau kunjungi halaman PPDB.";

      const lower = currentInput.toLowerCase();
      if (lower.includes("ppdb") || lower.includes("daftar")) {
        replyText =
          "Pendaftaran PPDB 2026 sudah dibuka! Anda bisa mendaftar dengan klik tombol 'PPDB 2026' di menu atas.";
      } else if (lower.includes("jurusan") || lower.includes("prodi")) {
        replyText =
          "Kami memiliki beberapa kompetensi keahlian unggulan seperti TKJ, Teknik Mesin, TKR, RPL, Akuntansi, dan Konstruksi.";
      } else if (lower.includes("guru") || lower.includes("pengajar")) {
        replyText =
          "Kami memiliki tenaga pengajar profesional. Anda dapat melihat daftar lengkap guru beserta profilnya pada bagian menu Guru.";
      } else if (lower.includes("alamat") || lower.includes("lokasi")) {
        replyText = `Alamat kami berlokasi di: ${alamatSekolah || "Alamat belum tersedia"}`;
      } else if (lower.includes("kontak") || lower.includes("telepon")) {
        replyText = `Anda dapat menghubungi kami melalui Telepon: ${teleponSekolah || "-"} atau Email: ${emailSekolah || "-"}`;
      }
>>>>>>> 288fe97 (Updated)

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
<<<<<<< HEAD
    } catch (error) {
      console.error("Gagal terhubung ke Groq API:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Maaf, terjadi masalah koneksi dengan server AI. Silakan periksa VITE_GROQ_API_KEY di file .env Anda.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
=======
      setIsAiTyping(false);
    }, 1200);
>>>>>>> 288fe97 (Updated)
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
<<<<<<< HEAD
      {/* Window Chat Floating */}
=======
      {/* Window Chat */}
>>>>>>> 288fe97 (Updated)
      {isChatOpen && (
        <div className="mb-4 flex h-[480px] w-[350px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all sm:w-[380px]">
          {/* Header Chat */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-bold backdrop-blur">
                ✨
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600" />
              </div>
              <div>
<<<<<<< HEAD
                <h4 className="text-sm font-bold">
                  Asisten AI {sekolah.nama_sekolah}
                </h4>
                <p className="text-[11px] text-blue-100">
                  Powered by Groq AI (Free & Fast)
                </p>
=======
                <h4 className="text-sm font-bold">Asisten AI Sekolah</h4>
                <p className="text-[11px] text-blue-100">Siap membantu 24/7</p>
>>>>>>> 288fe97 (Updated)
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
<<<<<<< HEAD
              className="rounded-lg p-1 text-blue-100 hover:bg-white/10 hover:text-white transition"
              aria-label="Tutup Chat"
            >
              ✕
            </button>
          </div>

          {/* Daftar Pesan Chat */}
=======
              className="rounded-lg p-1 text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Message List */}
>>>>>>> 288fe97 (Updated)
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3 text-sm">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
<<<<<<< HEAD
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap ${
=======
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
>>>>>>> 288fe97 (Updated)
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="mt-1 text-[10px] text-slate-400 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

<<<<<<< HEAD
            {/* Indikator Typing */}
=======
>>>>>>> 288fe97 (Updated)
            {isAiTyping && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

<<<<<<< HEAD
          {/* Form Input Chat */}
=======
          {/* Input Form */}
>>>>>>> 288fe97 (Updated)
          <form
            onSubmit={handleSendMessage}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Ketik pertanyaan..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
<<<<<<< HEAD
                disabled={!inputChat.trim() || isAiTyping}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
              >
                →
=======
                disabled={!inputChat.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9-7-9-7-9 7 9 7zm0 0v-8"
                  />
                </svg>
>>>>>>> 288fe97 (Updated)
              </button>
            </div>
          </form>
        </div>
      )}

<<<<<<< HEAD
      {/* Tombol Trigger Floating Icon */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 transition hover:scale-105 active:scale-95"
      >
        {isChatOpen ? "✕" : "💬"}
=======
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 transition hover:scale-105"
      >
        {isChatOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500"></span>
            </span>
          </>
        )}
>>>>>>> 288fe97 (Updated)
      </button>
    </div>
  );
}
