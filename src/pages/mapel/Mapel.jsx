import React, { useEffect } from "react";
import Main from "../../components/Main/Main";
import Cookies from "js-cookie";
import axios from "axios";
import repositori from "../../utils/repositories";

function Mapel() {
    const dataMapel = () => {
        const dataToken = Cookies.get("authentication");
        const token = dataToken.split(",");

        try {
            let response = axios.get(`${repositori}`);
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        dataMapel();
    }, []);

    return (
        <Main>
            <div className="grid grid-cols-6 bg-slate-100">
                <div className="col-span-5 col-start-2 p-5 overflow-y-auto">
                    <div className="flex justify-start py-4">
                        <h4 className="font-bold text-xl text-slate-500">
                            Data Mapel
                        </h4>
                    </div>
                    <div className="flex flex-col gap-y-10">
                        <div className="grid gap-5 grid-col-1 ">
                            <div className="p-5 transition duration-300 bg-white rounded-lg shadow-md">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    );
}

export default Mapel;
