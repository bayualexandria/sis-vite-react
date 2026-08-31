import React, { useState } from "react";
import Modal from "react-modal";
import repositori from "../../utils/repositories";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "15%",
        bottom: "auto",
        marginRight: "0%",
        transform: "translate(-50%, -50%)",
    },
};

function ChangePassword() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [newPShow, setNewPShow] = useState(false);
    const [newCPShow, setNewCPShow] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confNewPassword, setConfNewPassword] = useState("");
    const [message, setMessage] = useState("");

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    const showPassword = () => {
        setShow(!show);
    };
    const newShowPassword = () => {
        setNewPShow(!newPShow);
    };
    const newCShowPassword = () => {
        setNewCPShow(!newCPShow);
    };

    const data = {
        oldPassword: password,
        newPassword,
        confNewPassword,
    };

    const changePassword = async (e) => {
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

        const dataToken = Cookies.get("authentication");
        const token = dataToken.split(",");
        try {
            let response = await fetch(
                `${repositori}change-password/${token[1]}`,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token[0],
                    },
                }
            ).then((res) => res.json());
            console.log(response);

            if (response.status === 401) {
                setTimeout(() => {
                    setMessage(response.message);
                    setLoading(false);
                }, 1000);
            }

            if (response.status === 403) {
                setTimeout(async () => {
                    setLoading(false);
                    await templateModal.fire({
                        icon: "error",
                        title: `${response.message}`,
                    });
                }, 1000);
            }
            if (response.status === 200) {
                setTimeout(async () => {
                    setLoading(false);
                    await templateModal.fire({
                        icon: "success",
                        title: `${response.message}`,
                    });
                    setTimeout(() => {
                        Cookies.remove("authentication");
                        return (window.location.href = "/");
                    }, 900);
                }, 1000);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            <div
                className="flex flex-row justify-between items-center gap-x-3 cursor-pointer"
                onClick={openModal}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-slate-500"
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
                <p className="text-sm text-slate-500">Setting</p>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <h1 className="text-base text-slate-500 font-bold pb-5">
                    Ubah Password
                </h1>
                <div className="w-full overflow-hidden overflow-y-auto border rounded-lg boder-slate-300 ">
                    <div className="absolute top-1 right-1">
                        <button
                            className="outline-none w-5 h-5 border border-slate-300 flex justify-center items-center rounded-full text-slate-500 transition duration-200 hover:border-slate-500 hover:bg-white"
                            onClick={closeModal}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 "
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col w-full p-3">
                        <form
                            className="flex flex-col w-full gap-y-5"
                            onSubmit={changePassword}
                        >
                            <div className="flex flex-col gap-y-3 relative">
                                <label
                                    htmlFor="password"
                                    className="font-bold text-base text-slate-500"
                                >
                                    Password Lama
                                </label>

                                <input
                                    type={show ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="border-sky-500 border  rounded-md shadow-md p-2 text-base outline-none"
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
                                            className="size-6 text-sky-500"
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
                                            className="size-6 text-sky-500"
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
                                </div>
                                {message.oldPassword ? (
                                    <p className="text-xs font-thin text-rose-500">
                                        {message.oldPassword}
                                    </p>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="flex flex-col gap-y-3 relative">
                                <label
                                    htmlFor="password"
                                    className="font-bold text-base text-slate-500"
                                >
                                    Password Baru
                                </label>

                                <input
                                    type={newPShow ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="border-sky-500 border  rounded-md shadow-md p-2 text-base outline-none"
                                />
                                <div
                                    onClick={newShowPassword}
                                    className="absolute px-2 bg-white outline-none cursor-pointer right-1 top-11"
                                >
                                    {newPShow ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6 text-sky-500"
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
                                            className="size-6 text-sky-500"
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
                                </div>
                                {message.newPassword ? (
                                    <p className="text-xs font-thin text-rose-500">
                                        {message.newPassword}
                                    </p>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="flex flex-col gap-y-3 relative">
                                <label
                                    htmlFor="password"
                                    className="font-bold text-base text-slate-500"
                                >
                                    Konfirmasi Password Baru
                                </label>

                                <input
                                    type={newCPShow ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    onChange={(e) =>
                                        setConfNewPassword(e.target.value)
                                    }
                                    className="border-sky-500 border  rounded-md shadow-md p-2 text-base outline-none"
                                />
                                <div
                                    onClick={newCShowPassword}
                                    className="absolute px-2 bg-white outline-none cursor-pointer right-1 top-11"
                                >
                                    {newCPShow ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6 text-sky-500"
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
                                            className="size-6 text-sky-500"
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
                                </div>
                                {message.confNewPassword ? (
                                    <p className="text-xs font-thin text-rose-500">
                                        {message.confNewPassword}
                                    </p>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="flex flex-row justify-end">
                                <button
                                    type="submit"
                                    className="rounded-full outline-none border border-primary shadow-md py-1 px-6 text-sm font-bold text-white bg-primary hover:bg-white hover:text-primary transition duration-200"
                                >
                                    {loading ? (
                                        <div className="flex flex-row justify-center items-center gap-x-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-4 animate-spin"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                />
                                            </svg>
                                            Loading...
                                        </div>
                                    ) : (
                                        "Ubah Password"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ChangePassword;
