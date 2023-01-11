import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";

const MedicalAssessmentsOptions = () => {
  const { state } = useContext(StateContext);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const handleNavigation = (route) => {
    navigate(route);
  };
  console.log(state);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"))?.user?.registrations[0]?.roles[0];
    setRole(() => user);
    console.log(user)
  }, []);
  return (
    role && (
      <CommonLayout back="/medical-assessments">
        <div className="flex flex-col px-5 py-8 items-center">
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
            Select your assessment type
          </p>
          {state?.todayAssessment?.nursing == "Yes" && <Button
            text="Nursing Form"
            styles="lg:w-[70%] animate__animated animate__fadeInDown"
            onClick={() => {
              handleNavigation("/nursing");
            }}
          />}
          {state?.todayAssessment?.paramedical == "Yes" && <Button
            text="Paramedical Form"
            styles="lg:w-[70%] animate__animated animate__fadeInDown"
            onClick={() => {
              handleNavigation("/paramedical");
            }}
          />}
          {role === "Medical" && (
            <Button
              text="OSCE 1"
              styles="lg:w-[70%] animate__animated animate__fadeInDown"
              onClick={() => {
                handleNavigation("/osce-1");
              }}
            />
          )}
          {role === "Medical" && (
            <Button
              text="OSCE 2"
              styles="lg:w-[70%] animate__animated animate__fadeInDown"
              onClick={() => {
                handleNavigation("/osce-2");
              }}
            />
          )}
        </div>
      </CommonLayout>
    )
  );
};

export default MedicalAssessmentsOptions;
