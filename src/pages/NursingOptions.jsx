import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { getAssessmentStatus } from "../api";
import ROUTE_MAP from "../routing/routeMap";
import { getCookie, setCookie } from "../utils";

const NursingOptions = () => {
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
    setState((prevState) => {
      return {
        ...prevState,
        userData: {
          ...prevState?.userData,
          filledForms: { ...prevState?.filledForms, ...filledForms },
        },
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    getFilledAssessmentStatus();
    const {
      user: { registrations },
    } = getCookie("userData");
    const roles = registrations[0]?.roles[0];
    setRole(() => roles);
  }, []);

  console.log(state);

  return (
    role && (
      <CommonLayout back={ROUTE_MAP.medical_assessment_options}>
        <div className="flex flex-col px-5 py-8 items-center">
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
            Select your assessment type
          </p>
          {!loading && role == 'Medical' && <Button
            text="Infrastructure"
            css={state?.userData?.filledForms?.["nursing_infrastructure"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["nursing_infrastructure"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "nursing_infrastructure");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {!loading && role == 'Medical' && <Button
            text="Academic"
            css={state?.userData?.filledForms?.["nursing_academic"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["nursing_academic"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "nursing_academic");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {!loading && role == 'Medical' && <Button
            text="Clinical Learning"
            css={state?.userData?.filledForms?.["nursing_clinical_learning"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["nursing_clinical_learning"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "nursing_clinical_learning");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {!loading && role === "Medical" && (
            <Button
              text="OSCE Forms"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown'}`}
              onClick={() => {
                handleNavigation(ROUTE_MAP.osce_options);
              }}
            />
          )}

          {/* Forms for Non-Medical Assessor  */}
          {!loading && role == 'Non-Medical' && <Button
            text="Basic Information"
            css={state?.userData?.filledForms?.["non_medical_nursing_basic_information"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["non_medical_nursing_basic_information"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "non_medical_nursing_basic_information");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {!loading && role == 'Non-Medical' && <Button
            text="Hostel Facilities"
            css={state?.userData?.filledForms?.["non_medical_nursing_hostel_facilities"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["non_medical_nursing_hostel_facilities"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "non_medical_nursing_hostel_facilities");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {!loading && role == 'Non-Medical' && <Button
            text="Infrastructure"
            css={state?.userData?.filledForms?.["non_medical_nursing_infrastructure"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["non_medical_nursing_infrastructure"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "non_medical_nursing_infrastructure");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {!loading && role == 'Non-Medical' && <Button
            text="Seats Sanctioned"
            css={state?.userData?.filledForms?.["non_medical_nursing_seats_sanctioned"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["non_medical_nursing_seats_sanctioned"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "non_medical_nursing_seats_sanctioned");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {!loading && role == 'Non-Medical' && <Button
            text="Teaching Faculty"
            css={state?.userData?.filledForms?.["non_medical_nursing_teaching_faculty"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["non_medical_nursing_teaching_faculty"])
                handleNavigation(ROUTE_MAP.nursing_param_formName + "non_medical_nursing_teaching_faculty");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }
          {/* Forms for Non-Medical Assessor  */}
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

export default NursingOptions;
