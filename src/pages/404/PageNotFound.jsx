import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-6 py-12 transition-colors duration-300 dark:bg-slate-950">
      {/* Background Decoration */}
      <div
        className="
          pointer-events-none absolute -left-32 -top-32
          h-72 w-72 rounded-full
          bg-sky-200/40 blur-3xl
          dark:bg-sky-500/10
        "
      />

      <div
        className="
          pointer-events-none absolute -bottom-32 -right-32
          h-80 w-80 rounded-full
          bg-blue-200/40 blur-3xl
          dark:bg-blue-500/10
        "
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Icon */}
        <div
          className="
            mx-auto mb-7 flex size-20 items-center justify-center
            rounded-2xl
            border border-slate-200
            bg-white
            text-sky-500
            shadow-lg shadow-slate-200/50
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-sky-400
            dark:shadow-black/20
          "
        >
          <SearchX className="size-10" strokeWidth={1.7} />
        </div>

        {/* 404 */}
        <h1
          className="
            text-8xl font-black tracking-tight
            text-slate-800
            sm:text-9xl
            dark:text-white
          "
        >
          404
        </h1>

        {/* Title */}
        <h2
          className="
            mt-4 text-2xl font-bold tracking-tight
            text-slate-800
            sm:text-3xl
            dark:text-slate-100
          "
        >
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto mt-3 max-w-md
            text-sm leading-6
            text-slate-500
            sm:text-base
            dark:text-slate-400
          "
        >
          Maaf, halaman yang kamu cari tidak tersedia atau mungkin sudah
          dipindahkan ke halaman lain.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex w-full items-center justify-center gap-2
              rounded-xl
              bg-sky-500
              px-5 py-3
              text-sm font-semibold
              text-white
              shadow-lg shadow-sky-500/20
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-sky-600
              hover:shadow-xl hover:shadow-sky-500/25
              focus:outline-none
              focus:ring-2
              focus:ring-sky-400
              focus:ring-offset-2
              sm:w-auto
              dark:focus:ring-offset-slate-950
            "
          >
            <ArrowLeft className="size-4" />
            Kembali
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              inline-flex w-full items-center justify-center gap-2
              rounded-xl
              border border-slate-200
              bg-white
              px-5 py-3
              text-sm font-semibold
              text-slate-700
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:border-slate-300
              hover:bg-slate-50
              focus:outline-none
              focus:ring-2
              focus:ring-slate-300
              focus:ring-offset-2
              sm:w-auto
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-200
              dark:hover:border-slate-600
              dark:hover:bg-slate-800
              dark:focus:ring-slate-600
              dark:focus:ring-offset-slate-950
            "
          >
            <Home className="size-4" />
            Beranda
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-slate-200 pt-5 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Sistem Informasi Sekolah
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
