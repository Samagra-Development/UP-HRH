import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { getAssessmentStatus, getMedicalAssessments } from "../api";
import ROUTE_MAP from "../routing/routeMap";
import { getCookie } from "../utils";

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
    setState((prevState) => {
      return {
        ...prevState,
        userData: {
          ...state?.userData,
          filledForms: { ...state?.filledForms, ...filledForms },
        },
      }
    });
    setLoading(false);
  };

  const getTodayAssessments = async () => {
    const res = await getMedicalAssessments();
    if (res?.data?.assessment_schedule?.[0]) {
      let ass = res?.data?.assessment_schedule?.[0];
      setState((prevState) => {
        return {
          ...prevState,
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
        }
      });
    }
  };

  useEffect(() => {
    const {
      user: { registrations },
    } = getCookie("userData");
    const roles = registrations[0]?.roles[0];
    setRole(() => roles);
  }, []);

  const getData = async () => {
    await getFilledAssessmentStatus();
    await getTodayAssessments();
  }

  useEffect(() => {
    getData();
  }, []);

  console.log(state);

  return (
    role && (
      <CommonLayout back={ROUTE_MAP.medical_assessments}>
        <div className="flex flex-col px-5 py-8 items-center mb-20">
          <style>
            {`
            .disabled-btn {
              opacity: 0.5 !important;
              cursor: not-allowed;
            }
          `}
          </style>
          <img
            src="/assets/forms.png "
            className="h-60 lg:h-80 my-5 lg:mt-[70px]"
            alt="illustration"
          />
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
            Select form type
          </p>

          {/* For Medical Assessor */}
          {(state?.todayAssessment?.specialization?.includes("NURSING") || state?.todayAssessment?.specialization?.includes("Nursing")) &&
            <Button
              text="Nursing"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => handleNavigation(ROUTE_MAP.nursing_options)}
            />
          }
          {(state?.todayAssessment?.specialization?.includes("PARAMEDICAL") || state?.todayAssessment?.specialization?.includes("Paramedical")) &&
            <Button
              text="Paramedical"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => handleNavigation(ROUTE_MAP.paramedical_options)}
            />
          }

          {/* For Non Medical Assessor */}
          {/* {(state?.todayAssessment?.specialization?.includes("NURSING") || state?.todayAssessment?.specialization?.includes("Nursing")) && role == 'Non-Medical' &&
            <Button
              text="Nursing"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.["nursing_non_medical"]
                ? "disabled-btn"
                : ""
                }`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["nursing_non_medical"])
                  handleNavigation(ROUTE_MAP.nursing_non_medical);
                else {
                  setError(
                    "You've already filled this asessment for today"
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          }
          {(state?.todayAssessment?.specialization?.includes("PARAMEDICAL") || state?.todayAssessment?.specialization?.includes("Paramedical")) && role == 'Non-Medical' &&
            <Button
              text="Paramedical"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.["paramedical_non_medical"]
                ? "disabled-btn"
                : ""
                }`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["paramedical_non_medical"])
                  handleNavigation(ROUTE_MAP.paramedical_non_medical);
                else {
                  setError(
                    "You've already filled this asessment for today"
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          } */}

          {/* Common for both assessors */}
          {!loading && role == 'Medical' && state?.todayAssessment?.courses?.includes("ANM") &&
            <Button
              text="ANM Form"
              css={state?.userData?.filledForms?.["form_anm_general"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["form_anm_general"])
                  handleNavigation(ROUTE_MAP.otherforms_param_formName + "form_anm_general");
                else {
                  setError(
                    "You've already filled this asessment for today"
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          }
          {!loading && role == 'Medical' && state?.todayAssessment?.courses?.includes("BSC") &&
            <Button
              text="BSC Form"
              css={state?.userData?.filledForms?.["form_bsc_general"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["form_bsc_general"])
                  handleNavigation(ROUTE_MAP.otherforms_param_formName + "form_bsc_general");
                else {
                  setError(
                    "You've already filled this asessment for today"
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          }
          {!loading && role == 'Medical' && state?.todayAssessment?.courses?.includes("GNM") &&
            <Button
              text="GNM Form"
              css={state?.userData?.filledForms?.["form_gnm_general"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["form_gnm_general"])
                  handleNavigation(ROUTE_MAP.otherforms_param_formName + "form_gnm_general");
                else {
                  setError(
                    "You've already filled this asessment for today"
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          }
          {!loading && role == 'Medical' && state?.todayAssessment?.courses?.includes("MSC") &&
            <Button
              text="MSC Form"
              css={state?.userData?.filledForms?.["form_msc_general"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["form_msc_general"])
                  handleNavigation(ROUTE_MAP.otherforms_param_formName + "form_msc_general");
                else {
                  setError(
                    "You've already filled this asessment for today"
                  );
                  setTimeout(() => setError(""), 3000);
                }
              }}
            />
          }

          {!loading && role == 'Medical' && state?.todayAssessment?.courses?.includes("PBBSC") &&
            <Button
              text="PBBSC Form"
              css={state?.userData?.filledForms?.["form_pbbsc_general"] ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => {
                if (!state?.userData?.filledForms?.["form_pbbsc_general"])
                  handleNavigation(ROUTE_MAP.otherforms_param_formName + "form_pbbsc_general");
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
      </CommonLayout>
    )
  );
};

export default MedicalAssessmentsOptions;
