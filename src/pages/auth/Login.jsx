import { useState } from "react";
import logo from "../../assets/images/logo-pendidikan.png";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LoginViaSocialMedia from "./LoginViaSocialMedia";
import api from "../../utils/repositories";

const templateModal = withReactContent(Swal).mixin({
  customClass: {
    confirmButton:
      "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-2 py-0.5 cursor-pointer",
    cancelButton:
      "bg-rose-500  font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-2 py-0.5 cursor-pointer",
  },
  buttonsStyling: false,
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [user, setuser] = useState(false);

  const onHandlerSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    setLoading(true);
    try {
      const response = await api
        .post(
          "auth/login-admin",
          {
            username: username,
            password: password,
          },
          {
            withCredentials: true,
          },
        )
        .then((res) => res.data);
      setLoading(false);
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("username", JSON.stringify(username));
        localStorage.setItem(
          "id_user",
          JSON.stringify(response.user.status_id),
        );
        localStorage.setItem("is_logged_in", true);
        setuser(username);
      }
      return response;
    } catch (e) {
      setLoading(false);

      if (e.response.data.status === 401) {
        setMessage(e.response.data.message);
        setTimeout(() => {
          return setMessage("");
        }, 8000);
      }
      if (e.response.data.status === 403) {
        return templateModal.fire({
          icon: "error",
          title: `${e.response.data.message}`,
        });
      }
      if (e.message === "Failed to fetch") {
        return templateModal.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  const showPassword = () => {
    setShow(!show);
  };

  return (
    <>
      {user && <Navigate to="/home" replace={true} />}
      <div className="bg-sky-500 w-full h-screen flex justify-center items-center flex-col px-3">
        <h1 className="font-bold text-white text-2xl ">
          Sistem Informasi Sekolah
        </h1>
        <div className="md:w-1/3 w-full rounded-md shadow-lg bg-white px-7 pt-5 pb-10 mt-10 gap-y-5 flex flex-col">
          <div className="flex w-full justify-center">
            <img src={logo} alt="logo-pendidikan" className="w-20" />
          </div>

          <form onSubmit={onHandlerSubmit} className="flex flex-col gap-y-7">
            <div className="flex flex-col gap-y-3">
              <label
                htmlFor="username"
                className="font-bold text-base text-slate-500"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                className={`${
                  message.username ? "border-rose-500" : "border-sky-500"
                } border  rounded-md shadow-md p-2 text-sm outline-none`}
              />
              <div>
                {message.username ? (
                  <p className="text-red-500 text-xs">{message.username}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-3 relative">
              <label
                htmlFor="password"
                className="font-bold text-base text-slate-500"
              >
                Password
              </label>

              <input
                type={show ? "text" : "password"}
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className={`${
                  message.password ? "border-rose-500" : "border-sky-500"
                } border  rounded-md shadow-md p-2 text-base outline-none`}
              />
              <div
                onClick={showPassword}
                className="absolute px-2 bg-white outline-none cursor-pointer right-1 top-11"
              >
                {show ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`${
                      message.password ? "text-rose-500" : "text-cyan-500"
                    } w-6 h-6 `}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`${
                      message.password ? "text-rose-500" : "text-cyan-500"
                    } w-6 h-6 `}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </div>
              <div>
                {message.password ? (
                  <p className="text-red-500 text-xs">{message.password}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <button
              type="submit"
              className="rounded-full outline-none p-2 border border-sky-500 bg-sky-500 text-base text-white font-bold"
            >
              {loading ? (
                <div className="flex flex-row items-center justify-center gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 animate-spin"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Loading...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <LoginViaSocialMedia />
          <Link
            to="/forget-password"
            className="flex row justify-center w-full"
          >
            <div className="outline-none cursor-pointer text-sm font-thin text-sky-500">
              Lupa password?
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
