import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const history = useNavigate();
  return (
    <div className="w-full h-screen bg-sky-500 justify-center items-center flex flex-col gap-3">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="text-white font-thin">Halaman tidak diketahui</p>
      <div
        onClick={() => history(-1)}
        className="cursor-pointer rounded-md shadow-md px-2 py-1 bg-white text-sky-500 hover:border hover:border-white hover:bg-sky-500 hover:text-white transition duration-200"
      >
        Kembali
      </div>
    </div>
  );
}

export default PageNotFound;