import { useState, useEffect } from "react";
import Groq from "groq-sdk";
import {
  Search,
  Sparkles,
  Bot,
  Settings,
  Send,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import Main from "./components/Main";

// System Prompt diperbarui dengan Alur Pendaftaran & Dokumen Persyaratan lengkap
const PPDB_SYSTEM_PROMPT = `Anda adalah Asisten AI Resmi Pusat Bantuan PPDB (Penerimaan Peserta Didik Baru). 
Jawablah pertanyaan orang tua dan calon siswa secara ramah, ringkas, jelas, dan akurat dalam Bahasa Indonesia. 

Rincian pengetahuan resmi PPDB:
1. ALUR PENDAFTARAN PPDB:
   - Tahap 1: Pendaftaran Akun (pembuatan & aktivasi akun calon peserta didik)
   - Tahap 2: Pengisian Biodata & Berkas (melengkapi data diri dan mengunggah scan dokumen persyaratan)
   - Tahap 3: Verifikasi Berkas Panitia (pengecekan keabsahan dokumen oleh panitia PPDB)
   - Tahap 4: Tes Seleksi / Wawancara (pelaksanaan tes akademik/bakat/wawancara sesuai jadwal)
   - Tahap 5: Pengumuman Hasil Akhir (pengumuman kelulusan dan informasi daftar ulang)

2. DOKUMEN PERSYARATAN WAJIB:
   - Scan Ijazah atau Surat Keterangan Kelulusan (SKL)
   - Kartu Keluarga (KK) - minimal terbit 1 tahun sebelum pendaftaran
   - Akta Kelahiran / Surat Kenal Lahir
   - KTP Orang Tua / Wali
   - Pas foto berwarna terbaru

3. JALUR PENDAFTARAN: Zonasi, Afirmasi, Prestasi, dan Perpindahan Tugas Orang Tua.

Gunakan format poin-poin singkat agar mudah dibaca.`;

const DEFAULT_MODELS = [
  "llama-3.1-8b-instant",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3-32b",
];

const EXCLUDED_MODEL_KEYWORDS = [
  "whisper",
  "guard",
  "tts",
  "orpheus",
  "canopylabs",
  "playai",
  "distil-whisper",
  "allam",
  "compound",
];

export default function PusatBantuan() {
  const defaultEnvKey =
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_GROQ_API_KEY) ||
    (typeof process !== "undefined" && process.env?.REACT_APP_GROQ_API_KEY) ||
    "";

  const [apiKey, setApiKey] = useState(defaultEnvKey);
  const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS);
  const [model, setModel] = useState("llama-3.1-8b-instant");
  const [fetchingModels, setFetchingModels] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");

  const fetchGroqModels = async (keyToUse) => {
    const cleanKey = (keyToUse || apiKey).trim();
    if (!cleanKey) return;

    setFetchingModels(true);
    try {
      const groq = new Groq({
        apiKey: cleanKey,
        dangerouslyAllowBrowser: true,
      });

      const response = await groq.models.list();
      const chatModels = (response.data || [])
        .map((m) => m.id)
        .filter((id) => {
          const lower = id.toLowerCase();
          return !EXCLUDED_MODEL_KEYWORDS.some((kw) => lower.includes(kw));
        });

      if (chatModels.length > 0) {
        setAvailableModels(chatModels);
        if (!chatModels.includes(model)) {
          const preferred =
            chatModels.find((id) => id === "llama-3.1-8b-instant") ||
            chatModels.find((id) => id.includes("llama")) ||
            chatModels.find(
              (id) => id.includes("qwen") || id.includes("gpt-oss"),
            ) ||
            chatModels[0];
          setModel(preferred);
        }
      }
    } catch (err) {
      console.warn("Gagal memuat daftar model otomatis:", err);
    } finally {
      setFetchingModels(false);
    }
  };

  useEffect(() => {
    if (apiKey.trim().startsWith("gsk_")) {
      fetchGroqModels(apiKey);
    }
  }, [apiKey]);

  const getSimulatedResponse = (question) => {
    const q = question.toLowerCase();
    if (
      q.includes("alur") ||
      q.includes("tahap") ||
      q.includes("cara daftar") ||
      q.includes("seleksi") ||
      q.includes("wawancara") ||
      q.includes("pengumuman")
    ) {
      return `Berikut adalah **5 Tahapan Alur Pendaftaran PPDB**:\n\n1. **Pendaftaran Akun:** Membuat dan mengaktivasi akun calon peserta didik di portal PPDB.\n2. **Pengisian Biodata & Berkas:** Melengkapi data diri serta mengunggah dokumen persyaratan (Ijazah/SKL, KK, Akta, KTP Orang Tua, Pas Foto).\n3. **Verifikasi Berkas Panitia:** Panitia PPDB memeriksa kelengkapan dan keabsahan dokumen yang diunggah.\n4. **Tes Seleksi / Wawancara:** Mengikuti tes seleksi dan/atau wawancara sesuai jadwal dan jalur yang dipilih.\n5. **Pengumuman Hasil Akhir:** Melihat status kelulusan akhir dan melanjutkan proses daftar ulang.\n\n*(Tips: Masukkan Groq API Key Anda via tombol ⚙️ di bawah untuk jawaban AI dinamis penuh).*`;
    }
    if (
      q.includes("dokumen") ||
      q.includes("syarat") ||
      q.includes("berkas") ||
      q.includes("ijazah") ||
      q.includes("ktp") ||
      q.includes("foto")
    ) {
      return `Berikut adalah daftar **dokumen persyaratan wajib** yang harus disiapkan dan dipindai (scan) untuk pendaftaran PPDB:\n\n1. **Scan Ijazah atau Surat Keterangan Kelulusan (SKL)** asli/legalisir.\n2. **Kartu Keluarga (KK)** (minimal terbit 1 tahun sebelum pendaftaran).\n3. **Akta Kelahiran** atau Surat Kenal Lahir.\n4. **KTP Orang Tua / Wali**.\n5. **Pas Foto** berwarna terbaru.\n\n*(Tips: Masukkan Groq API Key Anda via tombol ⚙️ di bawah untuk jawaban AI dinamis penuh).*`;
    }
    if (q.includes("zonasi") || q.includes("kk")) {
      return "Untuk **Jalur Zonasi**, syarat utamanya adalah Kartu Keluarga (KK) yang diterbitkan minimal **1 tahun** sebelum tanggal pendaftaran, beserta dokumen pelengkap seperti Scan Ijazah/SKL, Akta Kelahiran, KTP Orang Tua, dan Pas Foto.";
    }
    return `Terima kasih atas pertanyaan "${question}". Alur pendaftaran dimulai dari **Pendaftaran Akun → Pengisian Biodata & Berkas → Verifikasi Berkas Panitia → Tes Seleksi / Wawancara → Pengumuman Hasil Akhir**, dengan dokumen wajib meliputi Scan Ijazah/SKL, KK, Akta Kelahiran, KTP Orang Tua, dan Pas Foto.\n\n*(Catatan: Masukkan Groq API Key di menu ⚙️ untuk mengaktifkan model Groq LLM secara real-time).*`;
  };

  const handleAskGroq = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const promptText = (customPrompt || query).trim();
    if (!promptText || loading) return;

    setLoading(true);
    setAiAnswer("");
    if (!customPrompt) setQuery(promptText);

    try {
      if (!apiKey.trim()) {
        await new Promise((r) => setTimeout(r, 600));
        setAiAnswer(getSimulatedResponse(promptText));
      } else {
        const groq = new Groq({
          apiKey: apiKey.trim(),
          dangerouslyAllowBrowser: true,
        });

        const completion = await groq.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: PPDB_SYSTEM_PROMPT },
            { role: "user", content: promptText },
          ],
          temperature: 0.5,
          max_tokens: 600,
        });

        const reply =
          completion.choices?.[0]?.message?.content ||
          "Maaf, tidak ada respons dari server Groq AI.";
        setAiAnswer(reply);
      }
    } catch (err) {
      console.error("Groq Error:", err);
      const isTermsError = err?.message?.includes("model_terms_required");
      setAiAnswer(
        isTermsError
          ? `⚠️ Model **${model}** memerlukan persetujuan syarat di Groq Console. Silakan klik ikon **⚙️** di atas dan ganti model ke **llama-3.1-8b-instant**.`
          : `⚠️ **Gagal terhubung ke Groq:** ${
              err?.message ||
              "Periksa kembali API Key atau ganti pilihan model di menu ⚙️."
            }`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-16 px-4 sm:px-6 min-h-full flex flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center w-full relative z-10">
          {/* Badge AI */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 text-blue-50 text-xs font-medium mb-4 backdrop-blur-md shadow-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Didukung <span className="font-semibold text-white">
              Groq SDK
            </span>{" "}
            (`groq-sdk`)
          </div>

          {/* Judul Utama */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Pusat Bantuan & Konsultasi PPDB AI
          </h1>

          {/* Subtitle */}
          <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Tanyakan apa saja seputar alur pendaftaran, verifikasi berkas, tes
            seleksi, atau dokumen persyaratan PPDB dan dijawab seketika oleh AI.
          </p>

          {/* Form Search Bar */}
          <form
            onSubmit={(e) => handleAskGroq(e)}
            className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white p-2 flex items-center gap-2"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tanya AI, misal: Bagaimana alur pendaftaran dan syarat berkas PPDB?"
              className="flex-1 py-3 px-2 text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
              title="Pengaturan Groq API Key & Model"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Berpikir...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Tanya AI</span>
                </>
              )}
            </button>
          </form>

          {/* Panel Pengaturan Groq API Key & Model */}
          {showSettings && (
            <div className="max-w-2xl mx-auto mt-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-left text-xs space-y-3">
              <div className="flex justify-between items-center text-white font-semibold">
                <span>Konfigurasi Groq SDK (`groq-sdk`)</span>
                <span className="text-[10px] bg-blue-500/50 px-2 py-0.5 rounded">
                  Chat Models Only
                </span>
              </div>
              <div>
                <label className="block text-blue-200 mb-1">
                  Groq API Key (gsk_...)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan API Key Groq Anda (gsk_...)..."
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-blue-200">
                    Pilih Model Groq ({availableModels.length} tersedia)
                  </label>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={() => fetchGroqModels(apiKey)}
                      disabled={fetchingModels}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${fetchingModels ? "animate-spin" : ""}`}
                      />
                      Muat Ulang Model
                    </button>
                  )}
                </div>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quick Tags / Tombol Cepat AI */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs">
            <span className="text-blue-200">Coba tanyakan:</span>
            {[
              "Alur Pendaftaran PPDB",
              "Dokumen Syarat Pendaftaran",
              "Verifikasi Berkas & Tes Seleksi",
              "Pengumuman Hasil Akhir",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  handleAskGroq(null, tag);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition backdrop-blur-xs cursor-pointer border border-white/10"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Kotak Hasil Jawaban AI */}
          {(aiAnswer || loading) && (
            <div className="max-w-2xl mx-auto mt-8 bg-white text-slate-800 p-6 rounded-2xl shadow-xl text-left border border-slate-100">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Jawaban Asisten Groq AI
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {apiKey
                        ? `Model: ${model}`
                        : "Mode Simulasi (API Key Kosong)"}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Selesai
                </span>
              </div>

              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
                  <p className="text-xs font-medium">
                    Groq AI sedang memproses jawaban...
                  </p>
                </div>
              ) : (
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {aiAnswer}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Main>
  );
}
