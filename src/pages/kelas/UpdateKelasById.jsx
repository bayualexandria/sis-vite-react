import React, { useState, useEffect } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import repositori from "../../utils/repositories";
import Cookies from "js-cookie";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #FFF",
    boxShadow: 24,
    borderRadius: 1,
    p: 4,
};

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

function UpdateKelasById({ id }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const data = Cookies.get("authentication");
    const token = data.split(",");
    const [kelas, setKelas] = useState([]);
    const [guru, setGuru] = useState([]);
    const [semester, setSemester] = useState([]);
    const [getKelas, setGetKelas] = useState([]);

    const getDataKelas = async () => {
        try {
            let response = await fetch(`${repositori}kelas/data-kelas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token[0],
                },
            }).then((res) => res.json());
            setKelas(response.data);
        } catch (e) {}
    };

    const getDataGuru = async () => {
        try {
            let response = await fetch(`${repositori}guru`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token[0],
                },
            }).then((res) => res.json());
            setGuru(response.data);
        } catch (error) {}
    };

    const getDataSemester = async () => {
        try {
            let response = await fetch(`${repositori}semester`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token[0],
                },
            }).then((res) => res.json());
            setSemester(response.data);
        } catch (error) {}
    };

    const dataKelasHistory = async () => {
        try {
            let response = await fetch(`${repositori}kelas/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token[0],
                },
            }).then((res) => res.json());
            // console.log("kelas by id", response);
            if (response.status === 404) {
                setError(response.message);
            }
            if (response.status === 200) {
                setGetKelas(response.data);
            }
        } catch (error) {}
    };

    // update data kelas
    const [kelasID, setKelasID] = useState("");
    const [waliKelas, setWaliKelas] = useState("");
    const [semesterID, setSemesterID] = useState("");
    const dataKelas = {
        kelas_id: kelasID,
        wali_kelas: waliKelas,
        semester_id: semesterID,
    };
    const updateDataKelas = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            let response = await fetch(`${repositori}kelas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token[0],
                },
                body: JSON.stringify(dataKelas),
            }).then((res) => res.json());
            if (response.status === 403) {
                setTimeout(() => {
                    setLoading(false);
                    setError(response.message);
                }, 1000);
            }
            if (response.status === 200) {
                setTimeout(async () => {
                    setLoading(false);
                    handleClose();
                    await templateModalSuccess.fire({
                        icon: "success",
                        title: response.message,
                    });
                    setTimeout(() => (window.location.href = "/kelas"), 1000);
                }, 1000);
            }
        } catch (error) {}
    };

    useEffect(() => {
        getDataKelas();
        getDataGuru();
        getDataSemester();
        dataKelasHistory();
    }, []);

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 text-sky-500 cursor-pointer hover:text-sky-300 transition duration-150"
                onClick={handleOpen}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                />
            </svg>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="w-full overflow-hidden overflow-y-auto border rounded-lg boder-slate-300 ">
                        <div className="absolute top-1 right-1">
                            <button
                                className="outline-none w-5 h-5 border border-slate-300 flex justify-center items-center rounded-full text-slate-500 transition duration-200 hover:border-slate-500 hover:bg-white"
                                onClick={handleClose}
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
                                className="flex flex-col gap-y-5"
                                onSubmit={updateDataKelas}
                            >
                                <div className="flex flex-col gap-y-2">
                                    <label
                                        htmlFor="kelas_id"
                                        className="font-bold text-base text-slate-500"
                                    >
                                        Kelas
                                    </label>
                                    <select
                                        name="kelas_id"
                                        id="kelas_id"
                                        className="border border-sky-500 rounded-md shadow-md outline-none py-1 px-2"
                                        value={getKelas.kelas_id}
                                        onChange={(e) =>
                                            setKelasID(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            --Pilih Kelas--
                                        </option>
                                        {kelas.map((data) => {
                                            if (getKelas.kelas_id === data.id) {
                                                return (
                                                    <option
                                                        value={
                                                            getKelas.kelas_id
                                                        }
                                                        key={getKelas.kelas_id}
                                                        selected
                                                    >
                                                        {data.nama_kelas}
                                                        {" | "}
                                                        {data.jurusan}
                                                    </option>
                                                );
                                            }
                                            return (
                                                <option
                                                    value={data.id}
                                                    key={data.id}
                                                >
                                                    {data.nama_kelas}
                                                    {" | "}
                                                    {data.jurusan}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {error.kelas_id ? (
                                        <p className="text-xs font-thin text-rose-500">
                                            {error.kelas_id}
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <label
                                        htmlFor="wali_kelas"
                                        className="font-bold text-base text-slate-500"
                                    >
                                        Wali Kelas
                                    </label>
                                    <select
                                        name="wali_kelas"
                                        id="wali_kelas"
                                        className="border border-sky-500 rounded-md shadow-md outline-none py-1 px-2"
                                        defaultValue={getKelas.wali_kelas}
                                        onChange={(e) =>
                                            setWaliKelas(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            --Pilih Wali Kelas--
                                        </option>
                                        {guru.map((data) => {
                                            if (
                                                getKelas.wali_kelas === data.id
                                            ) {
                                                return (
                                                    <option
                                                        value={
                                                            getKelas.wali_kelas
                                                        }
                                                        key={
                                                            getKelas.wali_kelas
                                                        }
                                                        selected
                                                    >
                                                        {data.nama}
                                                    </option>
                                                );
                                            }
                                            return (
                                                <option
                                                    value={data.id}
                                                    key={data.id}
                                                >
                                                    {data.nama}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {error.wali_kelas ? (
                                        <p className="text-xs font-thin text-rose-500">
                                            {error.wali_kelas}
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="flex flex-col gap-y-2">
                                    <label
                                        htmlFor="semester_id"
                                        className="font-bold text-base text-slate-500"
                                    >
                                        Semester
                                    </label>
                                    <select
                                        name="semester_id"
                                        id="semester_id"
                                        className="border border-sky-500 rounded-md shadow-md outline-none py-1 px-2"
                                        defaultValue={getKelas.semester_id}
                                        onChange={(e) =>
                                            setSemesterID(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            --Pilih Semester--
                                        </option>
                                        {semester.map((data) => {
                                            if (
                                                getKelas.semester_id === data.id
                                            ) {
                                                return (
                                                    <option
                                                        value={
                                                            getKelas.semester_id
                                                        }
                                                        key={
                                                            getKelas.semester_id
                                                        }
                                                        selected
                                                    >
                                                        Semester{" "}
                                                        {data.semester == "II"
                                                            ? "Ganap"
                                                            : "Ganjil"}
                                                        {"-"}
                                                        {data.tahun_pelajaran}
                                                    </option>
                                                );
                                            }
                                            return (
                                                <option
                                                    value={data.id}
                                                    key={data.id}
                                                >
                                                    Semester{" "}
                                                    {data.semester == "II"
                                                        ? "Ganap"
                                                        : "Ganjil"}
                                                    {"-"}
                                                    {data.tahun_pelajaran}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {error.semester_id ? (
                                        <p className="text-xs font-thin text-rose-500">
                                            {error.semester_id}
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="flex flex-row justify-end w-full pt-3">
                                    <button
                                        type="submit"
                                        className="rounded-md shadow-md bg-primary text-white border border-primary hover:text-primary hover:bg-white duration-200 transition text-base px-2 py-1"
                                    >
                                        {loading ? (
                                            <div className="gap-x-1 flex flex-row justify-center items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-5 animate-spin"
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
                                            "Ubah data"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default UpdateKelasById;
