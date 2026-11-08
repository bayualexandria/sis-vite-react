import { useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../utils/repositories";
import { useNavigate } from "react-router-dom";

const templateModalSuccess = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-3 py-1.5 cursor-pointer",
    cancelButton:
      "bg-rose-500 font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-3 py-1.5 cursor-pointer",
  },
  buttonsStyling: false,
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  // Memastikan SweetAlert berada di atas modal React Portal
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
    const swalContainer = document.querySelector(".swal2-container");
    if (swalContainer) {
      swalContainer.style.zIndex = "999999";
    }
  },
});

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="mt-1 text-xs font-medium text-rose-500 dark:text-rose-400">
      {message}
    </p>
  );
};

function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  // State visibilitas password
  const [showPasswordState, setShowPasswordState] = useState({
    new: false,
    confirm: false,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");

  const handleOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError({});
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewPassword("");
    setConfNewPassword("");
    setError({});
    setShowPasswordState({ new: false, confirm: false });
  };

  const togglePassword = (field) => {
    setShowPasswordState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (loading) return;
    setError({});

    // Validasi: Cek apakah Password Baru dan Konfirmasi sama
    if (newPassword !== confNewPassword) {
      setError({
        confNewPassword: "Konfirmasi password baru tidak cocok.",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("password", newPassword);

    try {
      const rawUsername = localStorage.getItem("username") || "";
      const username = encodeURIComponent(
        rawUsername.replace(/['"]+/g, "").trim(),
      );

      console.log("Username bersih untuk URL:", username);
      const response = await api.put(
        `user/change-password/${username}`,
        formData,
      );

      if (response.status === 200 || response.data?.status === 200) {
        setOpen(false);
        resetForm();

        await templateModalSuccess.fire({
          icon: "success",
          title: response.data?.message || "Password berhasil diubah",
        });

        setTimeout(async () => {
          localStorage.removeItem("username");
          localStorage.removeItem("id_user");
          localStorage.removeItem("is_logged_in");

          try {
            await api.delete(`access-token/${username}`);
          } catch (logoutError) {
            console.error("Gagal menghapus access token:", logoutError);
          }

          navigate("/login", { replace: true });
        }, 900);
      }
    } catch (err) {
      console.error("error change password", err?.response);

      const statusCode = err?.response?.status;
      const responseData = err?.response?.data;

      if (statusCode === 400 || statusCode === 401) {
        setError(responseData?.message || responseData || {});
      } else {
        await templateModalSuccess.fire({
          icon: "error",
          title:
            responseData?.message || "Terjadi kesalahan saat mengubah password",
        });

        if (statusCode === 403) {
          setOpen(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 " +
    "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/40";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200";

  return (
    <>
      {/* =========================
                TRIGGER / MENU PENGATURAN AKUN
            ========================== */}
      <div
        className="flex flex-row items-center gap-x-3 px-3 py-2 rounded-lg cursor-pointer text-slate-600 hover:bg-slate-100 transition duration-150 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={handleOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-slate-500 dark:text-slate-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span className="text-sm font-medium">Pengaturan Akun</span>
      </div>

      {/* =========================
                MODAL DENGAN REACT PORTAL
            ========================== */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            <div
              className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-slate-700 dark:bg-slate-900"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    Ubah Password
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Masukkan password baru untuk akun Anda.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  aria-label="Tutup modal"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
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

              {/* BODY FORM */}
              <div className="overflow-y-auto px-6 py-5">
                <form onSubmit={changePassword} className="flex flex-col gap-4">
                  {/* Password Baru */}
                  <div className="flex flex-col relative">
                    <label htmlFor="newPassword" className={labelClass}>
                      Password Baru
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswordState.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan password baru"
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("new")}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none"
                      >
                        {showPasswordState.new ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      message={
                        typeof error === "string" ? null : error.newPassword
                      }
                    />
                  </div>

                  {/* Konfirmasi Password Baru */}
                  <div className="flex flex-col relative">
                    <label htmlFor="confNewPassword" className={labelClass}>
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="confNewPassword"
                        name="confNewPassword"
                        type={showPasswordState.confirm ? "text" : "password"}
                        value={confNewPassword}
                        onChange={(e) => setConfNewPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none"
                      >
                        {showPasswordState.confirm ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      message={
                        typeof error === "string" ? null : error.confNewPassword
                      }
                    />
                  </div>

                  {typeof error === "string" && (
                    <ErrorMessage message={error} />
                  )}

                  {/* FOOTER */}
                  <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-500 bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-5 w-5 animate-spin"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v-4.99"
                            />
                          </svg>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>Simpan Password</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default ChangePassword;
