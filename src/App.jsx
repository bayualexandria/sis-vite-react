import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import {
  Home,
  Login,
  Sekolah,
  Kelas,
  ChangePassword,
  ForgetPassword,
  Mapel,
  UpdateDataGuru,
  GetById,
  Siswa,
  Guru,
  Profile,
  GuruMapel,
  Website,
  Absensi,
  KelasById,
  PageNotFound,
} from "./pages/Index";
import { WebsitePPDB } from "./pages/ppdb/WebsitePPDB";

// Definisi Role (Ubah value/ID-nya sesuai dengan DB/LocalStorage Anda)
const ROLES = {
  ADMIN: "1",
  WALIKELAS: "2",
  GURU: "3",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Website />} />
      <Route path="/ppdb" element={<WebsitePPDB />} />
      <Route path="*" element={<PageNotFound />} />

      {/* Authentication */}
      <Route
        path="/login"
        element={
          <UnAthenticated>
            <Login />
          </UnAthenticated>
        }
      />
      <Route
        path="/forget-password"
        element={
          <UnAthenticated>
            <ForgetPassword />
          </UnAthenticated>
        }
      />

      {/* Start Authorization */}
      {/* Main root - Dapat diakses semua user yang login */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* Absensi - Dapat diakses oleh Admin, Guru, dan Siswa */}
      <Route
        path="/absensi"
        element={
          <PrivateRoute>
            <RoleRoute
              allowedRoles={[ROLES.ADMIN, ROLES.GURU, ROLES.WALIKELAS]}
            >
              <Absensi />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Profile - Dapat diakses semua user yang login */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Change password - Dapat diakses semua user yang login */}
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
      />

      {/* Guru - Contoh: Bisa diakses oleh Admin dan Guru */}
      <Route
        path="/guru"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Guru />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Update guru by id - Hanya Admin */}
      <Route
        path="/guru/:nip"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <UpdateDataGuru />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Siswa - Bisa diakses oleh Admin, Guru, dan Siswa */}
      <Route
        path="/siswa"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Siswa />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Update data siswa - Bisa diakses Admin dan Guru */}
      <Route
        path="/siswa/:nis"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <GetById />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/mapel"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Mapel />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Kelas - Bisa diakses Admin, Guru, dan Siswa */}
      <Route
        path="/kelas"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.WALIKELAS]}>
              <Kelas />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Kelas by id */}
      <Route
        path="/kelas/:nip/:id/:kelasid"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.WALIKELAS]}>
              <KelasById />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Guru Mapel */}
      <Route
        path="/guru-mapel"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.GURU]}>
              <GuruMapel />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Profile Sekolah - Hanya Admin */}
      <Route
        path="/profile-sekolah"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Sekolah />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      {/* End Authorization */}
    </Routes>
  );
}

// ---------------- Helper Components ----------------

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function UnAthenticated({ children }) {
  const isLoggedIn = localStorage.getItem("is_logged_in");

  if (isLoggedIn !== "true") {
    return children;
  }
  return <Navigate to="/home" replace={true} />;
}

/**
 * RoleRoute pendukung Multiple Roles
 * @param {Array<string>|string} allowedRoles - Daftar role ID yang diizinkan, misal: ["1", "2"]
 */
function RoleRoute({ allowedRoles, children }) {
  const userRole = localStorage.getItem("id_user");

  // Pengecekan apakah userRole ada di dalam daftar allowedRoles
  const hasAccess = Array.isArray(allowedRoles)
    ? allowedRoles.includes(userRole)
    : allowedRoles === userRole;

  if (hasAccess) {
    return children;
  }

  // Jika tidak memiliki akses, redirect ke halaman /home
  return <Navigate to="/home" replace={true} />;
}

export default App;
