import React from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import withReactContent from "sweetalert2-react-content";
import repositori from "../../../utils/repositories";

function RestoreDataSiswaById({ nis }) {
    const restoreDataSiswaById = async () => {
        const templateModalSuccess = withReactContent(Swal).mixin({
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

        const templateModal = withReactContent(Swal).mixin({
            customClass: {
                confirmButton:
                    "bg-sky-500 font-bold text-white outline-none border border-sky-500 rounded-md ml-2 px-2 py-0.5 cursor-pointer",
                cancelButton:
                    "bg-rose-500  font-bold text-white outline-none border border-rose-500 rounded-md mr-2 px-2 py-0.5 cursor-pointer",
            },
            buttonsStyling: false,
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
        <div className="w-6 h-6 rounded-full shadow-md flex justify-center items-center border border-sky-500 hover:text-white text-sky-500 hover:bg-sky-500 transition duration-200 cursor-pointer" onClick={restoreDataSiswaById}>
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
