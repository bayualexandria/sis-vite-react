import React, { useState, useEffect } from "react";
import Main from "../../components/Main/Main";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import repositori from "../../utils/repositories";
import repoimages from "../../utils/repoimages";
import api from "../../utils/repositories";

function Profile() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const userProfile = async () => {
    const dataUser = localStorage.getItem("username");
    const username = JSON.parse(dataUser);

    try {
      let response = await api
        .get(`guru/${username}`, {
          withCredentials: true,
        })
        .then((res) => res.data);
      return setUser(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    userProfile();
  });

  const [name, setName] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [noHP, setNoHP] = useState("");
  const [alamat, setAlamat] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState();
  const [error, setError] = useState("");

  const updateProfile = async (e) => {
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
    console.log(token[0]);
    const data = new FormData();
    data.append("name", name);
    data.append("jenis_kelamin", jenisKelamin);
    data.append("no_hp", noHP);
    data.append("alamat", alamat);
    data.append("image_profile", image);

    try {
      let response = await axios
        .post(`${repositori}guru/${token[1]}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token[0],
          },
        })
        .then((res) => res.data);
      console.log(response);

      setLoading(false);
      await templateModal.fire({
        icon: "success",
        title: "Data berhasil diubah",
      });

      return response;
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      setError(error.message);
    }
  };

  const onImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Main>
      <div className="grid grid-cols-6 bg-slate-100">
        <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
          <div className="flex justify-start pb-4">
            <h4 className="font-bold text-base text-slate-500">Profile</h4>
          </div>
          <div className="w-full rounded-md shadow-md bg-white p-5">
            <div className="flex flex-col md:flex-row gap-y-5 md:gap-y-0 w-full">
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                <div className="w-52 h-52 rounded-full shadow-md  p-2 flex justify-center items-center border border-slate-200 overflow-hidden">
                  <img src={repoimages + user.image_profile} alt="profile" />
                </div>
                <h1 className="font-bold text-slate-500 text-base">
                  {user.nama}
                </h1>
                <h5 className="font-normal text-slate-500 text-sm">
                  {user.nip}
                </h5>
              </div>
              <div className="flex flex-col w-full md:w-1/2 md:px-14">
                <form
                  onSubmit={updateProfile}
                  className="flex flex-col gap-y-5"
                >
                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="nip" className="text-sm font-bold">
                      NIP
                    </label>
                    <input
                      type="text"
                      readOnly
                      defaultValue={user.nip}
                      name="nip"
                      id="nip"
                      className="border border-sky-500 rounded-md shadow-md py-1.5 px-2 font-thin text-sm text-slate-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="nama" className="text-sm font-bold">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="border border-sky-500 rounded-md shadow-md py-1.5 px-2 font-bold text-sm outline-none"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <label
                      htmlFor="jenis_kelamin"
                      className="text-sm font-bold"
                    >
                      Jenis Kelamin
                    </label>
                    <div className="flex flex-row gap-x-5">
                      <div className="flex flex-row gap-x-3">
                        {user.jenis_kelamin == "Laki-laki" ? (
                          <input
                            type="radio"
                            name="jenis_kelamin"
                            value="Laki-laki"
                            id="Laki-laki"
                            className="border border-sky-500"
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            checked
                          />
                        ) : (
                          <input
                            type="radio"
                            name="jenis_kelamin"
                            value="Laki-laki"
                            id="Laki-laki"
                            className="border border-sky-500"
                            onChange={(e) => setJenisKelamin(e.target.value)}
                          />
                        )}
                        <label htmlFor="Laki-laki">Laki-laki</label>
                      </div>
                      <div className="flex flex-row gap-x-3">
                        {user.jenis_kelamin == "Perempuan" ? (
                          <input
                            type="radio"
                            name="jenis_kelamin"
                            className="border border-sky-500"
                            value="Perempuan"
                            id="Perempuan"
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            checked
                          />
                        ) : (
                          <input
                            type="radio"
                            name="jenis_kelamin"
                            className="border border-sky-500"
                            value="Perempuan"
                            id="Perempuan"
                            onChange={(e) => setJenisKelamin(e.target.value)}
                          />
                        )}
                        <label htmlFor="Perempuan">Perempuan</label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="no_hp" className="text-sm font-bold">
                      No.Handphone
                    </label>
                    <input
                      type="text"
                      className="rounded-md shadow-md border border-sky-500 py-1.5 px-2 outline-none font-bold text-sm"
                      defaultValue={user.no_hp}
                      onChange={(e) => setNoHP(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-y-3 md:gap-x-3">
                    <label
                      htmlFor="image_profile"
                      className="text-sm font-bold"
                    >
                      Gambar profile
                    </label>

                    <div className="rounded-md ring ring-sky-300 overflow-hidden flex justify-center items-center">
                      <img
                        src={
                          imagePreview
                            ? imagePreview
                            : `${repoimages + user.image_profile}`
                        }
                        className="w-full"
                      />
                    </div>
                    <input
                      type="file"
                      onChange={(e) => onImageUpload(e)}
                      className="file:rounded-full file:bg-white file:border file:border-sky-200 file:text-primary file:text-sm file:font-bold"
                    />
                    <p className="text-rose-500 text-sm font-thin">
                      {error === "Request failed with status code 403"
                        ? "File yang anda masukan bukan gambar(PNG,JPG,JPEG)/Ukuran melebihi 2 MB"
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="alamat" className="text-sm font-bold">
                      Alamat
                    </label>
                    <textarea
                      className="rounded-md shadow-md border border-sky-500 outline-none p-3 font-bold text-sm"
                      rows="5"
                      onChange={(e) => setAlamat(e.target.value)}
                      defaultValue={user.alamat}
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

export default Profile;
