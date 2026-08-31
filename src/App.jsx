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
  Website,
  Absensi,
  KelasById,
  PageNotFound,
} from "./pages/Index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Website />} />
      <Route path="/absensi" element={<Absensi />} />
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
      {/* Main root */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      {/* Profile */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      {/* Change password */}
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
      />
      {/* Guru */}
      <Route
        path="/guru"
        element={
          <PrivateRoute>
            <Guru />
          </PrivateRoute>
        }
      />
      {/* Update guru by id */}
      <Route
        path="/guru/:nip"
        element={
          <PrivateRoute>
            <UpdateDataGuru />
          </PrivateRoute>
        }
      />
      {/* Siswa */}
      <Route
        path="/siswa"
        element={
          <PrivateRoute>
            <Siswa />
          </PrivateRoute>
        }
      />
      {/* Update data siswa */}
      <Route
        path="/siswa/:nis"
        element={
          <PrivateRoute>
            <GetById />
          </PrivateRoute>
        }
      />
      {/* Mapel */}
      <Route
        path="/mapel"
        element={
          <PrivateRoute>
            <Mapel />
          </PrivateRoute>
        }
      />
      {/* Kelas */}
      <Route
        path="/kelas"
        element={
          <PrivateRoute>
            <Kelas />
          </PrivateRoute>
        }
      />

      {/* Kelas by id */}
      <Route
        path="/kelas/:nip/:id"
        element={
          <PrivateRoute>
            <KelasById />
          </PrivateRoute>
        }
      />

      {/* Profile Sekolah */}
      <Route
        path="/profile-sekolah"
        element={
          <PrivateRoute>
            <Sekolah />
          </PrivateRoute>
        }
      />
      {/* End Authorization */}
    </Routes>
  );
}

function PrivateRoute({ children }) {
  // "is_logged_in" adalah cookie biasa yang diizinkan dibaca JS
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

export default App;
