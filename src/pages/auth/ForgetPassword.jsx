import { useState } from "react";
import logo from "../../assets/images/logo-pendidikan.png";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import repo from "../../utils/repo";

function ForgetPassword() {
  const [user] = useState(localStorage.getItem("username"));
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [message, setMessage] = useState("");

  const data = { email };

  const forgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    try {
      const responseLoad = await fetch(`${repo}api/auth/forgot-password`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (responseLoad.status === 503) {
        setLoading(false);
        return templateModal.fire({
          icon: "error",
          title: `Server Down! Sistem API dalam perbaikan`,
        });
      }
      let response = await responseLoad.json();

      if (response.status === 401) {
        setMessage(response.message);
        setLoading(false);
        return setTimeout(() => {
          setMessage("");
        }, 5000);
      }
      if (response.status === 403) {
        setLoading(false);
        return await templateModal.fire({
          icon: "error",
          title: `${response.message}`,
        });
      }
      setLoading(false);
      return await templateModal.fire({
        icon: "success",
        title: `${response.message}`,
      });
    } catch (e) {
      setLoading(false);
      if (e.message === "Failed to fetch") {
        return templateModal.fire({
          icon: "error",
          title:
            "Koneksi ke server terputus! Mohon hubungi pihak administrator server.",
        });
      }
    }
  };

  return (
    <>
      {user && <Navigate to="/" replace={true} />}
      <div className="bg-sky-500 w-full h-screen flex justify-center items-center flex-col px-3">
        <h1 className="font-bold text-white text-2xl ">
          Sistem Informasi Sekolah
        </h1>
        <div className="md:w-1/3 w-full rounded-md shadow-lg bg-white px-7 pt-5 pb-10 mt-10 gap-y-5 flex flex-col">
          <div className="flex w-full justify-center">
            <img src={logo} alt="logo-pendidikan" className="w-20" />
          </div>
          <form className="flex flex-col gap-y-7" onSubmit={forgetPassword}>
            <div className="flex flex-col gap-y-3">
              <label
                htmlFor="username"
                className="font-bold text-base text-slate-500"
              >
                Email
              </label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={(e) => setEmail(e.target.value)}
                className="border-sky-500 border  rounded-md shadow-md p-2 text-sm outline-none"
              />
              {message ? (
                <p className="text-rose-500 font-thin text-xs">{message}</p>
              ) : (
                ""
              )}
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
                "Reset password"
              )}
            </button>
          </form>
          <Link to="/login" className="flex row justify-center w-full">
            <div className="outline-none cursor-pointer text-sm font-thin text-sky-500">
              Kembali ke halaman login?
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
