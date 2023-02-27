import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import ROUTE_MAP from "../routing/routeMap";

const AssessmentType = () => {
  const navigate = useNavigate();

  return (
    <CommonLayout back={ROUTE_MAP.medical_assessments}>
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[28px] font-bold mt-4 lg:text-[45px] animate__animated animate__fadeIn">
          Select Type
        </p>
        <Button text="Institute" styles="lg:w-[70%] animate__animated animate__fadeInDown" onClick={() => navigate(ROUTE_MAP.capture_location)} />
        <Button text="Hospital" styles="lg:w-[70%] animate__animated animate__fadeInDown" onClick={() => navigate(ROUTE_MAP.hospital_forms)} />
      </div>
    </CommonLayout>
  );
};

export default AssessmentType;
