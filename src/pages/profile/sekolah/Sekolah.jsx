import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Main from "../../../components/Main/Main";
import repositori from "../../../utils/repositories";
import repoimages from "../../../utils/repoimages";
import axios from "axios";
import repo from "../../../utils/repo";

export default function Sekolah() {
  const [sekolah, setSekolah] = useState([]);
  const [loading, setLoading] = useState(false);

  const userProfile = async () => {
    try {
      let response = await axios
        .get(`${repo}api/profile-sekolah`)
        .then((res) => res.data);
      console.log(response);

      return setSekolah(response.data);
    } catch (error) {
      return error.message;
    }
  };
  useEffect(() => {
    userProfile();
  });

  const [namaSekolah, setNamaSekolah] = useState("");
  const [akreditasi, setAkreditasi] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [alamat, setAlamat] = useState("");

  const updateProfileSekolah = async (e) => {
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

    const data = {
      nama_sekolah: namaSekolah,
      akreditasi,
      no_telp: noTelp,
      alamat_sekolah: alamat,
    };

    try {
      let response = await fetch(`${repositori}sekolah`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(data),
      }).then((res) => res.json());
      console.log(response);

      setLoading(false);
      await templateModal.fire({
        icon: "success",
        title: response.message,
      });

      return response;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Main>
      <div className="grid grid-cols-6 bg-slate-100">
        <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
          <div className="flex justify-start pb-4">
            <h4 className="font-bold text-base text-slate-500">
              Profile Selolah
            </h4>
          </div>
          <div className="w-full rounded-md shadow-md bg-white p-5">
            <div className="flex flex-col md:flex-row gap-y-5 md:gap-y-0 w-full">
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                <div className="w-36 h-36 rounded-full shadow-md">
                  <img src={repoimages + sekolah.image_profile} alt="profile" />
                </div>
                <h1>{sekolah.nama_sekolah}</h1>

                <h1 className="font-bold text-slate-500 text-base">
                  {sekolah.akreditasi}
                </h1>
                <h5 className="font-normal text-slate-500 text-sm">
                  {sekolah.no_telp}
                </h5>
              </div>
              <div className="flex flex-col w-full md:w-1/2 md:px-14">
                <form
                  onSubmit={updateProfileSekolah}
                  className="flex flex-col gap-y-5"
                >
                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="nama_sekolah" className="text-sm font-bold">
                      Nama Sekolah
                    </label>
                    <input
                      type="text"
                      defaultValue={sekolah.nama_sekolah}
                      name="nama_sekolah"
                      id="nama_sekolah"
                      className="rounded-md shadow-md border border-sky-500 py-1.5 px-2 outline-none font-bold text-sm"
                      onChange={(e) => setNamaSekolah(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="nama" className="text-sm font-bold">
                      Akreditasi
                    </label>
                    <select
                      className="rounded-md shadow-md border border-sky-500 py-1.5 px-2 outline-none font-bold text-sm"
                      onChange={(e) => setAkreditasi(e.target.value)}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="no_hp" className="text-sm font-bold">
                      No. Telephone
                    </label>
                    <input
                      type="text"
                      className="rounded-md shadow-md border border-sky-500 py-1.5 px-2 outline-none font-bold text-sm"
                      defaultValue={sekolah.no_telp}
                      onChange={(e) => setNoTelp(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="alamat" className="text-sm font-bold">
                      Alamat
                    </label>
                    <textarea
                      className="rounded-md shadow-md border border-sky-500 outline-none p-3 font-bold text-sm"
                      rows="5"
                      onChange={(e) => setAlamat(e.target.value)}
                      defaultValue={sekolah.alamat}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="outline-none rounded-full bg-sky-500 text-white font-bold text-sm py-2 border border-sky-500 hover:bg-white hover:text-sky-500 transition duration-200"
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
                      "Simpan"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
