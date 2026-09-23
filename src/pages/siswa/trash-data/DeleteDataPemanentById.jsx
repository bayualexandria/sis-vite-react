import Swal from "sweetalert2";
import Cookies from "js-cookie";
import withReactContent from "sweetalert2-react-content";
import repositori from "../../../utils/repositories";

function DeleteDataPemanentById({ nis }) {
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
        title: "Delete data siswa",
        text: "Apakah anda ingin hapus data ini!",
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
              await fetch(`${repositori}siswa/delete/${nis}`, {
                method: "DELETE",
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
      className="w-6 h-6 rounded-full shadow-md flex justify-center items-center border border-rose-500 hover:text-white text-rose-500 hover:bg-rose-500 transition duration-200 cursor-pointer"
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
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </div>
  );
}

export default DeleteDataPemanentById;
