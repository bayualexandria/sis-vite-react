import React, { useState } from "react";

function RefreshDataSiswaByKelas({ getDataSiswaByKelas }) {
  const [loading, setLoading] = useState(false);
  const handleLoading = () => {
    setLoading(true);
    getDataSiswaByKelas();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      className="w-8 h-8 rounded-full shadow-md border p-2 flex justify-center items-center bg-white hover:bg-sky-500  transition duration-200 cursor-pointer hover:text-white text-sky-500"
      onClick={handleLoading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 ${loading ? "animate-spin" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
      {loading && (
        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-50 rounded-full flex justify-center items-center">
          <span className="text-xs text-sky-500">Loading...</span>
        </span>
      )}
    </div>
  );
}

export default RefreshDataSiswaByKelas;
