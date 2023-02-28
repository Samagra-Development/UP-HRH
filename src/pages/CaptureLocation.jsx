import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../App";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import ROUTE_MAP from "../routing/routeMap";
import { getCookie } from "../utils";

const CaptureLocation = () => {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [role, setRole] = useState('');
  const { state, setState } = useContext(StateContext);
  const [distance, setDistance] = useState(9999);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 769;

  const getLocation = () => {
    if (navigator.geolocation && !loading) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition((p) => {
        setLat(p.coords.latitude);
        setLong(p.coords.longitude);
        setShowMap(true);
        setLoading(false);
        setState({
          ...state,
          userData: {
            ...state.userData,
            lat: p.coords.latitude,
            long: p.coords.longitude,
          },
        });
        setDistance(
          calcDistance(
            p.coords.latitude,
            p.coords.longitude,
            state.todayAssessment.latitude,
            state.todayAssessment.longitude
          )
        );
      });
    } else {
      setError(`Please allow location access.`);
      setLoading(false);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  function calcDistance(lat1, lon1, lat2, lon2) {
    var d;
    try {
      var R = 6371000; // radius of earth in metres
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      d = R * c;
    } catch (err) {
      console.log(err);
      setError("An error occured: " + err.toString());
      setTimeout(() => setError(false), 5000);
    }
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }

  const handleSubmit = () => {
    if (
      !state?.todayAssessment?.latitude ||
      !state?.todayAssessment?.longitude
    ) {
      setError(
        `Institute co-ordinates are missing. Please try again from start`
      );
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
    if (!lat || !long) {
      setError(`Please capture location before continuing`);
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
    if (distance > 500) {
      setError(`Please ensure you are within the institute premises`);
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
    navigate(ROUTE_MAP.medical_assessment_options);
  };

  useEffect(() => {
    if (lat != 0 && long != 0) setDisabled(false);
    else setDisabled(true);
  }, [lat, long]);

  useEffect(() => {
    const {
      user: { registrations },
    } = getCookie("userData");
    const roles = registrations[0]?.roles[0];
    setRole(roles);
  }, [])

  return (
    <CommonLayout back={role == 'Medical' ? ROUTE_MAP.assessment_type : ROUTE_MAP.medical_assessments}>
      <div className="flex flex-col px-5 py-8 items-center">
        <img
          src="/assets/locationGirl.png"
          className="h-[200px] mt-4 lg:h-[300px]"
          alt="locationGirl"
        />
        {!showMap && loading && (
          <div className="w-[60%] h-[200px] bg-gray-200 flex">
            <div className="loader"></div>
          </div>
        )}
        {showMap && (
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${long}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width={isMobile ? "100%" : "60%"}
            height={200}
            loading="lazy"
            title="map"
            className="mt-5 animate__animated animate__fadeIn"
          />
        )}
        {error && (
          <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 text-center mt-2">
            {error}
          </span>
        )}
        {!showMap && distance > 500 && (
          <Button
            text="Capture Location"
            onClick={getLocation}
            styles={
              loading
                ? "bg-white text-primary opacity-75 w-80 lg:w-[60%]"
                : "w-80 lg:w-[60%] animate__animated animate__fadeInDown"
            }
          />
        )}
        <Button
          text="Continue"
          styles={
            disabled
              ? "bg-white text-primary opacity-75 w-80 lg:w-[60%] animate__animated animate__fadeInDown"
              : "w-80 lg:w-[60%]"
          }
          onClick={handleSubmit}
        />
        <style>
          {`
                    .loader {
                        border: 8px solid #FFF; /* Light grey */
                        border-top: 8px solid #F8913D; /* Blue */
                        border-radius: 50%;
                        width: 60px;
                        height: 60px;
                        animation: spin 2s linear infinite;
                        margin: auto;
                      }
                      
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
        </style>
      </div>
    </CommonLayout>
  );
};

export default CaptureLocation;
