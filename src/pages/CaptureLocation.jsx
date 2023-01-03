import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StateContext } from "../App";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const CaptureLocation = () => {
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const { state, setState } = useContext(StateContext);
    const [distance, setDistance] = useState(9999);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
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
            setError(
                `You're currently ${distance < 1000 ? Math.ceil(distance) : (distance / 1000).toFixed(2)}${distance < 1000 ? 'm' : 'kms'} away from institute which is outside the range of 500m. Please try again once you're in vicinity of the institute`
            );

            setTimeout(() => {
                setError(false);
            }, 5000);
            return;
        }
        navigate("/medical-assessment-options");
    };

    useEffect(() => {
        if (lat != 0 && long != 0) setDisabled(false);
        else setDisabled(true);
    }, [lat, long]);

    return (
        <CommonLayout>
            <div className="flex flex-col px-5 py-8 items-center">
                <div className="flex flex-col w-full px-2 items-start">
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-2xl text-gray-300"
                        onClick={() => navigate("/medical-assessments")}
                    />
                </div>
                <img
                    src="/assets/locationGirl.png"
                    className="h-[200px] mt-4 lg:h-[300px]"
                    alt="locationGirl"
                />
                {showMap && (
                    <iframe
                        src={`https://maps.google.com/maps?q=${lat},${long}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height={200}
                        loading="lazy"
                        title="map"
                        className="mt-5"
                    />
                )}
                {error && (
                    <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 text-center mt-2">
                        {error}
                    </span>
                )}
                {!showMap && distance > 500 && <Button
                    text="Capture Location"
                    onClick={getLocation}
                    styles={loading ? "bg-white text-primary opacity-75" : ""}
                />}
                <Button
                    text="Continue"
                    styles={disabled ? "bg-white text-primary opacity-75" : ""}
                    onClick={handleSubmit}
                />
            </div>
        </CommonLayout>
    );
};

export default CaptureLocation;
