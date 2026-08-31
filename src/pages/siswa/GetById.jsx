import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Main from "../../components/Main/Main";
import repositori from "../../utils/repositories";
import repoimages from "../../utils/repoimages";

function GetById() {
    const { nis } = useParams();
    const [siswa, setSiswa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nama, setNama] = useState("");
    const [jenisKelamin, setJenisKelamin] = useState("");
    const [noHP, setNoHP] = useState("");
    const [alamat, setAlamat] = useState("");
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState();

    const getSiswaById = async () => {
        const data = Cookies.get("authentication");
        const token = data.split(",");

        try {
            let response = await axios
                .get(`${repositori}siswa/${nis}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token[0],
                    },
                })
                .then((res) => res.data);
            setSiswa(response.data);
        } catch (error) {}
    };

    const updateSiswa = async (e) => {
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
        setTimeout(async () => {
            setLoading(false);
            await templateModal.fire({
                icon: "success",
                title: "Data berhasil diubah",
            });

            const dataToken = Cookies.get("authentication");
            const token = dataToken.split(",");
            const data = new FormData();
            data.append("nama", nama);
            data.append("jenis_kelamin", jenisKelamin);
            data.append("no_hp", noHP);
            data.append("alamat", alamat);
            data.append("image_profile", image);

            try {
                let response = await axios
                    .post(`${repositori}siswa/${nis}`, data, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: "Bearer " + token[0],
                        },
                    })
                    .then((res) => res.data);
                return (window.location.href = "/siswa");
            } catch (error) {}
        }, 5000);
    };

    const onImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        getSiswaById();
    });

    return (
        <Main>
            <div className="grid grid-cols-6 bg-slate-100">
                <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
                    <div className="flex justify-start py-4">
                        <h4 className="font-bold text-xl text-slate-500">
                            Update Data Siswa
                        </h4>
                    </div>
                    <div className="flex flex-col gap-y-10">
                        <div className="grid gap-5 grid-col-1 ">
                            <div className="p-5 transition duration-300 bg-white rounded-lg shadow-md ">
                                <form
                                    onSubmit={updateSiswa}
                                    className="p-5 flex flex-col gap-y-7"
                                >
                                    <div className="flex flex-col md:flex-row md:gap-x-5 gap-y-5 w-full">
                                        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                                            <label
                                                htmlFor="nis"
                                                className="text-sm font-bold text-slate-500"
                                            >
                                                NIS
                                            </label>
                                            <input
                                                type="text"
                                                name="nis"
                                                id="nis"
                                                defaultValue={siswa.nis}
                                                readOnly
                                                className="rounded-md shadow-md border border-sky-500 px-2 py-1 outline-none bg-slate-200"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                                            <label
                                                htmlFor="nama"
                                                className="font-bold text-sm text-slate-500"
                                            >
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                name="nama"
                                                id="nama"
                                                className="rounded-md shadow-md px-2 py-1 border border-sky-500 outline-none"
                                                defaultValue={siswa.nama}
                                                onChange={(e) =>
                                                    setNama(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:gap-x-5 gap-y-5 w-full">
                                        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                                            <label
                                                htmlFor="jenis_kelamin"
                                                className="text-sm font-bold text-slate-500"
                                            >
                                                Jenis Kelamin
                                            </label>
                                            <div className="flex flex-row gap-x-5">
                                                <div className="flex flex-row gap-x-3">
                                                    <input
                                                        type="radio"
                                                        name="jenis_kelamin"
                                                        value="Laki-laki"
                                                        className="border border-sky-500"
                                                        onChange={(e) =>
                                                            setJenisKelamin(
                                                                e.target.value
                                                            )
                                                        }
                                                        defaultChecked={
                                                            siswa.jenis_kelamin ===
                                                            "Laki-laki"
                                                        }
                                                    />
                                                    <label htmlFor="Laki-laki">
                                                        Laki-laki
                                                    </label>
                                                </div>
                                                <div className="flex flex-row gap-x-3">
                                                    <input
                                                        type="radio"
                                                        name="jenis_kelamin"
                                                        className="border border-sky-500"
                                                        value="Perempuan"
                                                        onChange={(e) =>
                                                            setJenisKelamin(
                                                                e.target.value
                                                            )
                                                        }
                                                        defaultChecked={
                                                            siswa.jenis_kelamin ===
                                                            "Perempuan"
                                                        }
                                                    />
                                                    <label htmlFor="Perempuan">
                                                        Perempuan
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                                            <label
                                                htmlFor="no_hp"
                                                className="font-bold text-sm text-slate-500"
                                            >
                                                No. Handphone
                                            </label>
                                            <input
                                                type="text"
                                                name="no_hp"
                                                id="no_hp"
                                                className="rounded-md shadow-md px-2 py-1 border border-sky-500 outline-none"
                                                defaultValue={siswa.no_hp}
                                                onChange={(e) =>
                                                    setNoHP(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:gap-x-5 gap-y-5 w-full">
                                        <div className="flex flex-col gap-y-3 md:gap-x-3 w-full md:w-1/2">
                                            <label
                                                htmlFor="image_profile"
                                                className="text-sm font-bold text-slate-500"
                                            >
                                                Gambar profile
                                            </label>

                                            <div className="rounded-md ring ring-sky-300 overflow-hidden flex justify-center items-center">
                                                <img
                                                    src={
                                                        imagePreview
                                                            ? imagePreview
                                                            : `${repoimages}${siswa.image_profile}`
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    onImageUpload(e)
                                                }
                                                className="file:rounded-full file:bg-white file:border file:border-sky-200 file:text-primary file:text-sm file:font-bold"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                                            <label
                                                htmlFor="alamat"
                                                className="text-sm font-bold text-slate-500"
                                            >
                                                Alamat
                                            </label>
                                            <textarea
                                                className="rounded-md shadow-md border border-sky-500 outline-none p-3 font-bold text-sm"
                                                rows="5"
                                                defaultValue={siswa.alamat}
                                                onChange={(e) =>
                                                    setAlamat(e.target.value)
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row">
                                        <button
                                            type="submit"
                                            className="outline-none border border-sky-500 text-sm text-white font-bold bg-sky-500 rounded-md shadow-md py-1 px-2 flex flex-row justify-center items-center gap-x-2 hover:bg-white hover:text-sky-500 transition duration-200"
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
                                                <div className="flex flex-row items-center justify-center gap-x-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                        />
                                                    </svg>
                                                    Update data siswa
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    );
}

export default GetById;
