import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { getAssessmentStatus } from "../api";
import ROUTE_MAP from "../routing/routeMap";
import { getCookie, setCookie } from "../utils";

const ParamedicalOptions = () => {
  const { state, setState } = useContext(StateContext);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nonMedicalForms, setNonMedicalForms] = useState([
    { name: 'Administrative Control', formName: 'non_medical_paramedical_administrative_control' },
    { name: 'Basic Information', formName: 'non_medical_paramedical_basic_information' },
    { name: 'Clinical Facilities', formName: 'non_medical_paramedical_clinical_facilities' },
    { name: 'Number of Seats', formName: 'non_medical_paramedical_number_of_seats' },
    { name: 'Teaching Faculty', formName: 'non_medical_paramedical_teaching_faculty' },
    { name: 'Training Infrastructure', formName: 'non_medical_paramedical_training_infrastructure' }
  ])

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

  return (
    role && (
      <CommonLayout back={ROUTE_MAP.medical_assessment_options}>
        <div className="flex flex-col px-5 py-8 items-center">
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
            Select your assessment type
          </p>
          {!loading && role == 'Medical' && <Button
            text="Clinical Learning"
            css={state?.userData?.filledForms?.["paramedical_clinical_learning"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["paramedical_clinical_learning"])
                handleNavigation(ROUTE_MAP.paramedical_param_formName + "paramedical_clinical_learning");
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
            text="Academic Section"
            css={state?.userData?.filledForms?.["paramedical_academic_section"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.["paramedical_academic_section"])
                handleNavigation(ROUTE_MAP.paramedical_param_formName + "paramedical_academic_section");
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />
          }

          {/* Non Medical Assessor Forms */}
          {!loading && role == 'Non-Medical' && nonMedicalForms?.map(el => < Button
            text={el.name}
            css={state?.userData?.filledForms?.[el.formName] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
            styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
            onClick={() => {
              if (!state?.userData?.filledForms?.[el.formName])
                handleNavigation(ROUTE_MAP.paramedical_param_formName + el.formName);
              else {
                setError(
                  "You've already filled this asessment for today"
                );
                setTimeout(() => setError(""), 3000);
              }
            }}
          />)
          }
          {/* Non Medical Assessor Forms */}
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
