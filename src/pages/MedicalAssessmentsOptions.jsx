import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { getAssessmentStatus, getMedicalAssessments } from "../api";
import ROUTE_MAP from "../routing/routeMap";
import { extractUserFromCookie } from "../utils";

const MedicalAssessmentsOptions = () => {
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

  const getTodayAssessments = async () => {
    const res = await getMedicalAssessments();
    if (res?.data?.assessment_schedule?.[0]) {
      let ass = res?.data?.assessment_schedule?.[0];
      setState({
        ...state,
        todayAssessment: {
          id: ass.institute.id,
          district: ass.institute.district,
          instituteName: ass.institute.name,
          specialization:
            ass.institute?.institute_specializations?.[0]?.specializations,
          courses: ass.institute?.institute_types?.[0]?.types,
          type: ass.institute.sector,
          latitude: ass.institute.latitude,
          longitude: ass.institute.longitude,
        },
      });
    }
  };

  useEffect(() => {
    // getFilledArole === "Medical" ssessmentStatus();
    const {
      user: { registrations },
    } = extractUserFromCookie();
    const roles = registrations[0]?.roles[0];
    setRole(() => roles);
  }, []);

  useEffect(() => {
    getFilledAssessmentStatus();
    getTodayAssessments();
  }, []);
  return (
    role && (
      <CommonLayout back={ROUTE_MAP.medical_assessments}>
        <div className="flex flex-col px-5 py-8 items-center">
          <img
            src="/assets/forms.png "
            className="h-60 lg:h-80 my-5 lg:mt-[70px]"
            alt="illustration"
          />
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
            Select form type
          </p>
          {state?.todayAssessment?.specialization?.includes("Nursing") && (
            <>
              {role == "Non-Medical" && (
                <Button
                  text="Nursing Form"
                  styles={`lg:w-[70%] animate__animated animate__fadeInDown ${
                    state?.userData?.filledForms?.["nursing_non_medical"]
                      ? "disabled-btn"
                      : ""
                  }`}
                  onClick={() => {
                    if (!state?.userData?.filledForms?.["nursing_non_medical"])
                      handleNavigation(ROUTE_MAP.nursing_non_medical);
                    else {
                      setError(
                        "You've already filled Non Medical Nursing asessment for today"
                      );
                      setTimeout(() => setError(""), 3000);
                    }
                  }}
                />
              )}
              {role == "Medical" && (
                <Button
                  text="Nursing Form"
                  styles={`lg:w-[70%] animate__animated animate__fadeInDown ${
                    state?.userData?.filledForms?.["nursing"]
                      ? "disabled-btn"
                      : ""
                  }`}
                  onClick={() => {
                    if (!state?.userData?.filledForms?.["nursing"])
                      handleNavigation(ROUTE_MAP.nursing);
                    else {
                      setError(
                        "You've already filled Nursing assessment for this date."
                      );
                      setTimeout(() => setError(""), 3000);
                    }
                  }}
                />
              )}
            </>
          )}
          {state?.todayAssessment?.specialization?.includes("Paramedical") && (
            <>
              {!loading && role == "Non-Medical" && (
                <Button
                  text="Paramedical Form"
                  styles={`lg:w-[70%] animate__animated animate__fadeInDown ${
                    state?.userData?.filledForms?.["paramedical_non_medical"]
                      ? "disabled-btn"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      !state?.userData?.filledForms?.["paramedical_non_medical"]
                    )
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
                  text="Paramedical Form"
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
            </>
          )}
          {role === "Medical" && (
            <Button
              text="OSCE Forms"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown'}`}
              onClick={() => {
                handleNavigation(ROUTE_MAP.osce_options);
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

export default MedicalAssessmentsOptions;
