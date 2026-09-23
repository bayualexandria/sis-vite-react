import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Main from "../components/Main/Main";
import api from "../utils/repositories";

/* =========================================================
   ICONS
========================================================= */

const Icons = {
  Users: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  ),

  Student: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5 12 5l9 5.5-9 5.5-9-5.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 13.2V17c0 1.5 2.24 3 5 3s5-1.5 5-3v-3.8"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5v5" />
    </svg>
  ),

  Book: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
      />
    </svg>
  ),

  Calendar: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),

  Activity: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12h4l3-8 4 16 3-8h4"
      />
    </svg>
  ),

  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  ),
};

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  to,
  title,
  description,
  count,
  loading,
  icon: Icon,
  iconWrapper,
  accent,
}) {
  return (
    <Link
      to={to}
      className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200 bg-white p-5 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        dark:border-slate-800 dark:bg-slate-900
      "
    >
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 ${accent}`}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconWrapper}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              bg-slate-50 text-slate-400
              transition-all
              group-hover:bg-slate-900 group-hover:text-white
              dark:bg-slate-800 dark:text-slate-400
              dark:group-hover:bg-white dark:group-hover:text-slate-900
            "
          >
            <Icons.ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <div className="mt-1">
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            ) : (
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {count}
              </span>
            )}
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="min-w-[150px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
        {item.payload.name}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
        {item.value}
      </p>

      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
        Data terdaftar
      </p>
    </div>
  );
}

/* =========================================================
   PROFESSIONAL CHART
========================================================= */

function SchoolChart({ guru, siswa, loading }) {
  const chartData = useMemo(
    () => [
      {
        name: "Guru",
        total: guru,
      },
      {
        name: "Siswa",
        total: siswa,
      },
    ],
    [guru, siswa],
  );

  const totalData = guru + siswa;

  return (
    <div
      className="
        rounded-2xl border border-slate-200 bg-white
        p-5 shadow-sm sm:p-6
        dark:border-slate-800 dark:bg-slate-900
      "
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex h-10 w-10 items-center justify-center rounded-xl
                bg-slate-100 text-slate-700
                dark:bg-slate-800 dark:text-slate-200
              "
            >
              <Icons.Activity className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Statistik Sekolah
              </h3>

              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Perbandingan data Guru dan Siswa
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-2.5 dark:bg-slate-800">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Total Data
          </p>

          <p className="mt-0.5 text-lg font-bold text-slate-800 dark:text-white">
            {loading ? "..." : totalData}
          </p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-6 flex items-center gap-5 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Guru
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-lime-500" />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Siswa
          </span>
        </div>
      </div>

      {/* CHART */}
      <div className="mt-6 h-[340px] w-full">
        {loading ? (
          <div className="flex h-full items-end justify-center gap-16 px-10 pb-12">
            <div className="h-32 w-20 animate-pulse rounded-t-xl bg-slate-100 dark:bg-slate-800" />

            <div className="h-52 w-20 animate-pulse rounded-t-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 30,
                right: 20,
                left: -15,
                bottom: 10,
              }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={45}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "#f8fafc",
                }}
                content={<CustomTooltip />}
              />

              <Bar
                dataKey="total"
                radius={[10, 10, 0, 0]}
                maxBarSize={80}
                animationDuration={900}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.name === "Guru" ? "#f97316" : "#84cc16"}
                  />
                ))}

                <LabelList
                  dataKey="total"
                  position="top"
                  offset={10}
                  fill="#334155"
                  fontSize={13}
                  fontWeight={700}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const [guru, setGuru] = useState(0);
  const [siswa, setSiswa] = useState(0);

  const [loadingGuru, setLoadingGuru] = useState(true);
  const [loadingSiswa, setLoadingSiswa] = useState(true);

  /* =======================================================
     GET GURU
  ======================================================= */

  const dataGuru = useCallback(async () => {
    try {
      setLoadingGuru(true);

      const response = await api.get("guru/");

      if (response?.status === 200) {
        setGuru(response?.data?.data?.length ?? 0);
      }
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
      setGuru(0);
    } finally {
      setLoadingGuru(false);
    }
  }, []);

  /* =======================================================
     GET SISWA
  ======================================================= */

  const dataSiswa = useCallback(async () => {
    try {
      setLoadingSiswa(true);

      const response = await api.get("siswa/");

      if (response?.status === 200) {
        setSiswa(response?.data?.data?.length ?? 0);
      }
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
      setSiswa(0);
    } finally {
      setLoadingSiswa(false);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    dataGuru();
    dataSiswa();
  }, [dataGuru, dataSiswa]);

  const loading = loadingGuru || loadingSiswa;

  return (
    <Main>
      <div className="min-h-screen bg-slate-100 pt-[76px] dark:bg-slate-950 lg:ml-64">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Sistem Informasi Sekolah
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Selamat datang kembali. Kelola data sekolah dengan mudah melalui
                dashboard ini.
              </p>
            </div>

            <div
              className="
                flex items-center gap-2 self-start rounded-full
                border border-emerald-200 bg-emerald-50 px-3 py-2
                dark:border-emerald-900/60 dark:bg-emerald-950/40
                sm:self-auto
              "
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Sistem Aktif
              </span>
            </div>
          </div>

          {/* =================================================
              STATISTIK CARDS
          ================================================= */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Ringkasan Data
                </h2>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Informasi utama sekolah
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Icons.Activity className="h-4 w-4" />
                Data terkini
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                to="/guru"
                title="Guru"
                description="Jumlah guru yang terdaftar"
                count={guru}
                loading={loadingGuru}
                icon={Icons.Users}
                iconWrapper="bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                accent="bg-orange-500"
              />

              <StatCard
                to="/siswa"
                title="Siswa"
                description="Jumlah siswa yang terdaftar"
                count={siswa}
                loading={loadingSiswa}
                icon={Icons.Student}
                iconWrapper="bg-lime-50 text-lime-600 dark:bg-lime-950/40 dark:text-lime-400"
                accent="bg-lime-500"
              />

              <StatCard
                to="/mapel"
                title="Mata Pelajaran"
                description="Mata pelajaran tersedia"
                count={8}
                loading={false}
                icon={Icons.Book}
                iconWrapper="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                accent="bg-indigo-500"
              />

              <StatCard
                to="/jadwal"
                title="Jadwal"
                description="Jadwal pembelajaran"
                count={8}
                loading={false}
                icon={Icons.Calendar}
                iconWrapper="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                accent="bg-rose-500"
              />
            </div>
          </section>

          {/* =================================================
              CHART
          ================================================= */}

          <section className="mt-8">
            <SchoolChart guru={guru} siswa={siswa} loading={loading} />
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              mt-8 flex flex-col gap-2 border-t
              border-slate-200 pt-5 text-xs text-slate-400
              dark:border-slate-800 dark:text-slate-500
              sm:flex-row sm:items-center sm:justify-between
            "
          >
            <p>Sistem Informasi Sekolah</p>

            <div className="flex items-center gap-1.5">
              <Icons.Activity className="h-3.5 w-3.5" />

              <span>Dashboard siap digunakan</span>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Home;
