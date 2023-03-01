import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { getAssessmentStatus, getMedicalAssessments } from "../api";
import { faUser, faLock, faMobile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StateContext } from "../App";
import ROUTE_MAP from "../routing/routeMap";
import { getCookie } from "../utils";

const HospitalOptions = () => {
  const { state, setState } = useContext(StateContext);
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
    // const {
    //   user: { registrations },
    // } = getCookie("userData");
    // const roles = registrations[0]?.roles[0];
    // setRole(() => roles);
  }, []);

  console.log(state);

  return (
    <CommonLayout back={ROUTE_MAP.assessment_type}>
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[28px] font-bold mt-4 lg:text-[45px] animate__animated animate__fadeIn">
          Hospital Assessments
        </p>
        {!loading && <Button
          text="Basic Information"
          css={state?.userData?.filledForms?.["hospital_basic_information"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
          styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
          onClick={() => {
            if (!state?.userData?.filledForms?.["hospital_basic_information"])
              handleNavigation(ROUTE_MAP.otherforms_param_formName + "hospital_basic_information");
            else {
              setError(
                "You've already filled this asessment for today"
              );
              setTimeout(() => setError(""), 3000);
            }
          }}
        />
        }
        {!loading && <Button
          text="Clinical Facilities"
          css={state?.userData?.filledForms?.["hospital_clinical_facilities"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
          styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
          onClick={() => {
            if (!state?.userData?.filledForms?.["hospital_clinical_facilities"])
              handleNavigation(ROUTE_MAP.otherforms_param_formName + "hospital_clinical_facilities");
            else {
              setError(
                "You've already filled this asessment for today"
              );
              setTimeout(() => setError(""), 3000);
            }
          }}
        />
        }
        {!loading && <Button
          text="Community Postings"
          css={state?.userData?.filledForms?.["hospital_community_postings"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
          styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
          onClick={() => {
            if (!state?.userData?.filledForms?.["hospital_community_postings"])
              handleNavigation(ROUTE_MAP.otherforms_param_formName + "hospital_community_postings");
            else {
              setError(
                "You've already filled this asessment for today"
              );
              setTimeout(() => setError(""), 3000);
            }
          }}
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
  );
};

export default HospitalOptions;
