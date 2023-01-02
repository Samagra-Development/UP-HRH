import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const CaptureLocation = () => {
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [showMap, setShowMap] = useState(false);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((p) => { setLat(p.coords.latitude); setLong(p.coords.longitude); setShowMap(true) });
        } else {

        }
    }
    useEffect(() => {
        getLocation();
    }, [])

    return (
        <CommonLayout>
            <div className="flex flex-col px-5 py-8 items-center">
                <p>{lat}</p>
                <p>{long}</p>
                {/* {lat && long && <iframe src={`https://maps.google.com/maps?q=${lat},${long}&hl=es;z=14&amp;output=embed`}></iframe>}
                <iframe src={`https://maps.google.com/maps?q=28.5611047,77.1975637&hl=es;z=14&amp;output=embed`}></iframe> */}
            </div>
        </CommonLayout >
    );
};

export default CaptureLocation;