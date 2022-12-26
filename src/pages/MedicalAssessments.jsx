import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const MedicalAssessments = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [error, setError] = useState("");

  const startAssess = (route) => {
    if (!data.instituteName) {
      setError("Please Enter Institute Name");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    if (!data.pocName) {
      setError("Please Enter POC Name");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    if (!data.pocMobile || data.pocMobile.length !== 10) {
      setError("Please enter a valid mobile number");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    navigate("/form");
  };

  useEffect(() => {
    setData({
      district: "BAREILLY",
      instituteName: "Hustle University",
      pocName: "Andrew Tate",
      pocMobile: "9654591151",
    });
  }, []);

  return (
    <CommonLayout>
      <div className="flex flex-col px-5 py-8 items-center">
        <div className="flex flex-col w-full px-2 items-start">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-2xl text-gray-300"
            onClick={() => navigate("/welcome-medical-assessor")}
          />
        </div>
        <p className="text-secondary text-[28px] font-bold mt-4">
          Today's Assessments
        </p>
        <p className="text-primary text-lg font-semibold">{data?.district}</p>
        <div className="h-full w-full bg-tertiary flex flex-col items-center pt-4 pb-8 px-5 mt-4">
          <div className="flex flex-col py-3 w-full">
            <span className="text-secondary pb-2 font-medium">
              Institute Name
            </span>
            <input
              type="text"
              placeholder="Enter institute name"
              className="border-2 border-primary p-3.5"
              value={data?.instituteName}
              onChange={(e) =>
                setData({ ...data, instituteName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col py-3 w-full">
            <span className="text-secondary pb-2 font-medium">POC Name</span>
            <input
              type="text"
              placeholder="Enter POC name"
              className="border-2 border-primary p-3.5"
              value={data?.pocName}
              onChange={(e) => setData({ ...data, pocName: e.target.value })}
            />
          </div>
          <div className="flex flex-col py-3 w-full mb-[-10px]">
            <span className="text-secondary pb-2 font-medium">POC Mobile</span>
            <input
              type="number"
              placeholder="Enter POC mobile"
              className="border-2 border-primary p-3.5"
              value={data?.pocMobile}
              onChange={(e) => setData({ ...data, pocMobile: e.target.value })}
            />
          </div>
          {error && (
            <span className="text-rose-600 mb-[-10px] mt-[15px] animate__animated animate__headShake">
              {error}
            </span>
          )}
          <Button text="Start Assessing" onClick={startAssess} />
        </div>
      </div>
    </CommonLayout>
  );
};

export default MedicalAssessments;
