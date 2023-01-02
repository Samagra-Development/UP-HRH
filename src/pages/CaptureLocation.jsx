import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const CaptureLocation = () => {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        setLat(p.coords.latitude);
        setLong(p.coords.longitude);
        setShowMap(true);
      });
    } else {
    }
  };
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <CommonLayout>
      <div className="flex flex-col px-5 py-8 items-center">
        <i class="fa-sharp fa-solid fa-location-dot"></i>
        <p>{lat}</p>
        <p>{long}</p>
        <iframe
          src={`https://maps.google.com/maps?q=${lat},${long}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="380"
          frameborder="0"
          allowfullscreen
          loading="lazy"
          title="map"
          className="mt-5"
        />
      </div>
    </CommonLayout>
  );
};

export default CaptureLocation;
