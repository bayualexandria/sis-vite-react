import { useState } from "react";
import logoGoogle from "../../assets/images/logo-google.png";
import { Navigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
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

function LoginViaSocialMedia() {
  const [loading, setLoading] = useState(false);
  const [user, setuser] = useState(false);

  const onSuccess = async (credentialResponse) => {
    const user = jwtDecode(credentialResponse.credential);
    const email = user.email;
    const idGoogle = user.sub;
    const nameGoogle = user.name;

    try {
      let response = await api
        .get(`/login-admin/google/${email}/${idGoogle}/${nameGoogle}`, {
          withCredentials: true,
        })
        .then((res) => res.data);
      setLoading(true);
      console.log(response);
      setTimeout(() => {
        setLoading(false);
        if (response.status === 200) {
          localStorage.setItem(
            "username",
            JSON.stringify(response.user.username),
          );
          localStorage.setItem(
            "id_user",
            JSON.stringify(response.user.status_id),
          );
          localStorage.setItem("is_logged_in", true);
          setuser(response.user.username);
        }

        return response;
      }, 900);
    } catch (error) {
      if (error.response.data.status === 403) {
        return templateModal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
      console.error("Error during login:", error);
      console.log("error social", "error");

      // Handle error appropriately, e.g., show a notification or redirect
    }
    // Use the credentialResponse.credential object to access the user's email address.
  };

  return (
    <>
      {user && <Navigate to="/home" replace={true} />}
      <div className="flex flex-col items-center justify-center">
        <GoogleOAuthProvider
          clientId="204787363979-fhhfn04ib0sbbl6pfls7v5it4df33atb.apps.googleusercontent.com"
          buttonText=""
        >
          {loading ? (
            <div className="flex items-center justify-center flex-col gap-y-1">
              <img src={logoGoogle} alt="Google Logo" className="w-10 h-10" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 animate-spin text-sky-500 font-bold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={onSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
              text="signin_with"
              shape="pill"
            ></GoogleLogin>
          )}
        </GoogleOAuthProvider>
      </div>
    </>
  );
}

export default LoginViaSocialMedia;
