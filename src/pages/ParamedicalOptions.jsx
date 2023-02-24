import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { getAssessmentStatus } from "../api";
import ROUTE_MAP from "../routing/routeMap";
import { setCookie } from "../utils";

const ParamedicalOptions = () => {
  const { state, setState } = useContext(StateContext);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleNavigation = (route) => {
    navigate(route);
  };

  const getFilledAssessmentStatus = async () => {
    setLoading(true);
    const res = await getAssessmentStatus();
    const filledForms = {};
    if (res?.data?.form_submissions?.length) {
      res.data.form_submissions.forEach(
        (el) => (filledForms[el.form_name] = true)
      );
    }
    setState({
      ...state,
      userData: {
        ...state?.userData,
        filledForms: { ...state?.filledForms, ...filledForms },
      },
    });
    setLoading(false);
  };

  useEffect(() => {
    getFilledAssessmentStatus();
    const {
      user: { registrations },
    } = setCookie("userData");
    const roles = registrations[0]?.roles[0];
    setRole(() => roles);
  }, []);

  return (
    role && (
      <CommonLayout back={ROUTE_MAP.medical_assessment_options}>
        <div className="flex flex-col px-5 py-8 items-center">
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
            Select your assessment type
          </p>
          {!loading && role == "Non-Medical" && (
            <Button
              text="Non Medical Paramedical Form"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown ${
                state?.userData?.filledForms?.["paramedical_non_medical"]
                  ? "disabled-btn"
                  : ""
              }`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["paramedical_non_medical"])
                  handleNavigation(ROUTE_MAP.paramedical_non_medical);
                else {
                  setError(
                    "You've already filled Non Medical Paramedical asessment for today"
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          )}
          {!loading && role == "Medical" && (
            <Button
              text="Medical Paramedical Form"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown ${
                state?.userData?.filledForms?.["paramedical"]
                  ? "disabled-btn"
                  : ""
              }`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["paramedical"])
                  handleNavigation(ROUTE_MAP.paramedical);
                else {
                  setError(
                    "You've already filled Paramedical assessment for this date."
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          )}
          {error && (
            <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 mt-5 text-center ">
              {error}
            </span>
          )}
        </div>
        <style>
          {`
            .disabled-btn {
              opacity: 0.5 !important;
              cursor: not-allowed;
            }
          `}
        </style>
      </CommonLayout>
    )
  );
};

export default ParamedicalOptions;
