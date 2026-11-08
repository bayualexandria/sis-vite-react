import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  UserCheck,
  LogOut,
  HelpCircle,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../../../utils/repositories";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalReact = withReactContent(Swal);

const templateModal = SwalReact.mixin({
  customClass: {
    confirmButton:
      "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90",
    cancelButton:
      "rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300",
  },
  buttonsStyling: false,
});

export default function Main({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // Mengambil informasi path URL saat ini
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // ============================================================
  // USERNAME
  // ============================================================

  const getUsername = () => {
    const storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      return null;
    }

    try {
      return JSON.parse(storedUsername);
    } catch {
      return storedUsername;
    }
  };

  const getUserData = useCallback(async () => {
    const username = getUsername();

    if (!username) {
      setLoading(false);
      navigate("/ppdb/login", { replace: true });
      return;
    }
    try {
      setLoading(true);
      let response = await api.get(`ppdb/user/${username}`, {
        withCredentials: true,
      });
      setUser(response.data.data);
      console.log("User data fetched:", response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const popUpLogoutButtonPPDB = async () => {
    const result = await templateModal.fire({
      title: "Keluar dari sistem?",
      text: "Apakah Anda yakin ingin keluar dari sistem?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await api.post(
        "/ppdb/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.log("Logout API error:", error.response);
    } finally {
      localStorage.removeItem("username");
      localStorage.removeItem("is_logged_in_ppdb");

      navigate("/ppdb/login", {
        replace: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
      {/* ================= 1. SIDEBAR NAVIGATION ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 `}
      >
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-8">
            {/* Header Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-wide text-white">
                    PPDB Online
                  </h1>
                  <p className="text-[11px] text-blue-300">
                    Portal Calon Siswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigasi Menu */}
            <nav className="space-y-1.5">
              {[
                {
                  name: "Dashboard",
                  icon: LayoutDashboard,
                  to: "/ppdb/dashboard",
                },
                {
                  name: "Formulir Biodata",
                  icon: FileText,
                  to: "/ppdb/formulir",
                },
                {
                  name: "Status Seleksi",
                  icon: UserCheck,
                  to: "/ppdb/status",
                },
                {
                  name: "Pusat Bantuan",
                  icon: HelpCircle,
                  to: "/ppdb/bantuan",
                },
              ].map((item, idx) => {
                // Mengecek apakah URL saat ini cocok dengan path menu
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    key={idx}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Footer */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                {user.nama_lengkap
                  ? user.nama_lengkap.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  Hello, {loading ? "Loading..." : user.nama_lengkap || "User"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {loading ? "Loading..." : user.username || "User"}
                </p>
              </div>
            </div>

            <button
              onClick={popUpLogoutButtonPPDB}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-xl text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {children}
    </div>
  );
}
