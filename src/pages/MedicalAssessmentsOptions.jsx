import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { getAssessmentStatus, getMedicalAssessments } from "../api";
import ROUTE_MAP from "../routing/routeMap";

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
    const user = JSON.parse(localStorage.getItem("userData"))?.user
      ?.registrations[0]?.roles[0];
    setRole(() => user);
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
          {state?.todayAssessment?.specialization?.includes("Nursing") &&
            <Button
              text="Nursing"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => handleNavigation(ROUTE_MAP.nursing_options)}
            />
          }
          {state?.todayAssessment?.specialization?.includes("Paramedical") &&
            <Button
              text="Paramedical"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => handleNavigation(ROUTE_MAP.paramedical_options)}
            />
          }
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
