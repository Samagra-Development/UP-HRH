import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";

const MedicalAssessmentsOptions = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const handleNavigation = (route) => {
    navigate(route);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"))?.user?.registrations[0]?.roles[0];
    setRole(() => user);
    console.log(user)
  }, []);
  return (
    role && (
      <CommonLayout back="/medical-assessments">
        <div className="flex flex-col px-5 py-8 items-center">
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center">
            Select your assessment type
          </p>
          <Button
            text="Nursing Form"
            onClick={() => {
              handleNavigation("/nursing");
            }}
          />
          <Button
            text="Paramedical Form"
            onClick={() => {
              handleNavigation("/paramedical");
            }}
          />
          {role === "Medical" && (
            <Button
              text="OSCE 1"
              onClick={() => {
                handleNavigation("/osce-1");
              }}
            />
          )}
          {role === "Medical" && (
            <Button
              text="OSCE 2"
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
