import Swal from "sweetalert2";
import Cookies from "js-cookie";
import withReactContent from "sweetalert2-react-content";
import repositori from "../../../utils/repositories";

function RestoreDataSiswaById({ nis }) {
  const restoreDataSiswaById = async () => {
    const templateModalSuccess = withReactContent(Swal).mixin({
      customClass: {
        container: "swal-container",
        popup:
          "rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800",
        title: "text-lg font-bold text-slate-800 dark:text-white",
        htmlContainer: "text-sm text-slate-600 dark:text-slate-300",
        confirmButton:
          "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700",
      },

      buttonsStyling: false,

      didOpen: () => {
        const container = document.querySelector(".swal-container");

        if (container) {
          container.style.zIndex = "99999";
        }
      },
    });

    const templateModal = withReactContent(Swal).mixin({
      customClass: {
        container: "swal-container",
        popup:
          "rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800",
        title: "text-lg font-bold text-slate-800 dark:text-white",
        htmlContainer: "text-sm text-slate-600 dark:text-slate-300",
        confirmButton:
          "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700",
        cancelButton:
          "ml-2 rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
      },

      buttonsStyling: false,

      didOpen: () => {
        const container = document.querySelector(".swal-container");

        if (container) {
          container.style.zIndex = "99999";
        }
      },
    });

    await templateModal
      .fire({
        title: "Restore data siswa",
        text: "Apakah anda ingin restore data ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        reverseButtons: true,
      })
      .then(async (result) => {
        try {
          if (result.isConfirmed) {
            await templateModalSuccess.fire({
              icon: "success",
              title: "Data berhasil di restore",
            });
            setTimeout(async () => {
              const data = Cookies.get("authentication");
              const token = data.split(",");

              await fetch(`${repositori}siswa/restore/${nis}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token[0],
                },
              });
              return (window.location.href = "/siswa");
            }, 500);
          }
        } catch (e) {
          return e;
        }
        return true;
      });
  };
  return (
    <div
      className="w-6 h-6 rounded-full shadow-md flex justify-center items-center border border-sky-500 hover:text-white text-sky-500 hover:bg-sky-500 transition duration-200 cursor-pointer"
      onClick={restoreDataSiswaById}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </div>
  );
}

export default RestoreDataSiswaById;
