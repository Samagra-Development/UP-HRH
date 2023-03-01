import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import {
  assignOsceForm,
  getAssessmentStatus,
  getAssignedForms,
  getMedicalAssessments,
  getRandomOsceForm,
  getRandomOsceFormsTeacher,
} from "../api";
import ROUTE_MAP from "../routing/routeMap";
import { getCookie, setCookie } from "../utils";

const OsceOptions = () => {
  const { state, setState } = useContext(StateContext);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState("");
  const [assType, setAssType] = useState("");
  const [osceForms, setOsceForms] = useState("");
  const userData = getCookie("userData");
  const [disableStudentForms, setDisableStudentForms] = useState(false);
  const [disableTeacherForms, setDisableTeacherForms] = useState(false);
  // const userData = JSON.parse(localStorage.getItem("userData"));
  const scheduleId = useRef();

  const navigate = useNavigate();

  const pullForms = async () => {
    const assignedForms = await getAssignedForms(assType == 'teacher' ? 'b.sc' : course, assType);
    if (assignedForms?.data?.osce_assignment?.length) {
      let forms = assignedForms?.data?.osce_assignment?.[0].osce_names;
      setOsceForms(forms);
    } else {
      // console.log(course)
      if (assType == "teacher") {
        const year1 = await getRandomOsceForm('b.sc', "1st_year");
        const year2 = await getRandomOsceForm('b.sc', "2nd_year");
        const year3 = await getRandomOsceForm('b.sc', "3rd_year");
        const year4 = await getRandomOsceForm('b.sc', "4th_year");
        const forms = [year1, year2, year3, year4];
        assignOsceForm({
          osce_names: "{" + forms.toString() + "}",
          assessment_type: assType,
          course_type: 'b.sc',
          schedule_id: scheduleId.current,
        });
        setOsceForms(forms);
      } else {
        if (course == "gnm" || course == "b.sc") {
          const year1 = await getRandomOsceForm(course, "1st_year");
          const year2 = await getRandomOsceForm(course, "2nd_year");
          const year3a = await getRandomOsceForm(
            course,
            "3rd_year",
            course == "gnm" ? "midwifery" : "pediatric"
          );
          const year3b = await getRandomOsceForm(
            course,
            course == "gnm" ? "3rd_year" : "4th_year",
            course == "gnm" ? "child_heath_nursing" : "midwifery"
          );
          const forms = [year1, year2, year3a, year3b];
          // console.log(forms)
          assignOsceForm({
            osce_names: "{" + forms.toString() + "}",
            assessment_type: assType,
            course_type: course,
            schedule_id: scheduleId.current,
          });
          setOsceForms(forms);
        }
        if (course == "anm") {
          const year1 = await getRandomOsceForm(course, "1st_year");
          const year2a = await getRandomOsceForm(
            course,
            "2nd_year",
            "midwifery"
          );
          const year2b = await getRandomOsceForm(
            course,
            "2nd_year",
            "pediatric"
          );
          const forms = [year1, year2a, year2b];
          assignOsceForm({
            osce_names: "{" + forms.toString() + "}",
            assessment_type: assType,
            course_type: course,
            schedule_id: scheduleId.current,
          });
          setOsceForms(forms);
        }
      }
    }
  };

  const getTodayAssessments = async () => {
    setLoading(true);
    const res = await getMedicalAssessments();
    if (res?.data?.assessment_schedule?.[0]) {
      let ass = res?.data?.assessment_schedule?.[0];
      scheduleId.current = ass.id;
      setState((prevState) => {
        return {
          ...prevState,
          todayAssessment: {
            ...prevState?.todayAssessment,
            id: ass.institute.id,
            district: ass.institute.district,
            instituteName: ass.institute.name,
            specialization:
              ass.institute?.institute_specializations?.[0]?.specializations,
            courses: ass.institute?.institute_types?.[0]?.types,
            type: ass.institute.sector,
            latitude: ass.institute.latitude,
            longitude: ass.institute.longitude,
            schedule_id: ass.id,
          },
        };
      });
    }
    setLoading(false);
  };

  const getFilledAssessmentStatus = async () => {
    setLoading(true);
    const res = await getAssessmentStatus();
    // console.log(res.data);
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
      };
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
    getTodayAssessments();
  }, []);

  useEffect(() => {
    if (assType == 'teacher' || (assType == 'student' && course)) {
      pullForms();
    }
  }, [assType, course]);

  const getFormText = (el) => {
    if (el) {
      if (assType == 'teacher') {
        if (el.includes("1st")) return "Foundations of Nursing"
        if (el.includes("2nd")) return "Medical Surgical Nursing"
        if (el.includes("3rd")) return "Paediatric"
        if (el.includes("4th")) return "Obstetrics/Midwifery"

      }
      let formName = "";
      formName = el
        .slice(el.indexOf("_") + 1, el.lastIndexOf("."))
        .split("_")
        .join(" ");
      return formName;
    }
    return "";
  };

  const backFunction = () => {
    if (osceForms && course) {
      setOsceForms([]);
      setCourse(null);
      return;
    }
    if (assType) {
      setAssType(null);
      return;
    }
  };

  useEffect(() => {
    setDisableStudentForms(false);
    setDisableTeacherForms(false);
    if (osceForms && state?.userData?.filledForms) {
      let filledForms = osceForms.filter(el => state.userData.filledForms[el.slice(0, el.indexOf(".xml"))]);
      // console.log(assType, filledForms.length, disableStudentForms, disableTeacherForms)
      if (assType == 'student' && filledForms.length >= 1) setDisableStudentForms(true);
      if (assType == 'teacher' && filledForms.length >= 2) setDisableTeacherForms(true);
    }
  }, [osceForms, course, assType])

  return (
    role && (
      <CommonLayout
        back={ROUTE_MAP.nursing_options}
        backFunction={assType ? backFunction : null}
      >
        {!assType && !course && (
          <div className="flex flex-col px-5 py-8 items-center">
            <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
              Select Assessment Type
            </p>
            <Button
              text="Student"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown `}
              onClick={() => setAssType("student")}
            />
            <Button
              text="Teacher"
              styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
              onClick={() => setAssType("teacher")}
            />
          </div>
        )}
        {assType == 'student' && !course && (
          <div className="flex flex-col px-5 py-8 items-center">
            <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
              Select Course Type
            </p>
            {!loading &&
              state?.todayAssessment?.courses?.map((el) => {
                if (el != "PBBSC" && el != "MSC")
                  return (
                    <Button
                      text={el}
                      styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
                      onClick={() => {
                        if (el == "BSC") {
                          setCourse("b.sc");
                        } else setCourse(el.toLowerCase());
                      }}
                    />
                  );
              })}
          </div>
        )}
        {(course || assType == 'teacher') && (
          <div className="flex flex-col px-5 py-8 items-center">
            <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeIn">
              Select Assessment Form
            </p>
            {assType == "student" ?
              <p className="text-secondary text-[12px] font-bold mt-5 text-center animate__animated animate__fadeIn">
                Please select one student from the senior most batch
              </p>
              : <p className="text-secondary text-[12px] font-bold mt-5 text-center animate__animated animate__fadeIn">
                Please assess only two teachers
              </p>
            }
            {osceForms &&
              osceForms.map((el, idx) => (
                <Button
                  key={`${el}${idx}`}
                  text={getFormText(el)}
                  css={(state?.userData?.filledForms?.[
                    el.slice(0, el.indexOf(".xml"))
                  ] || disableStudentForms || disableTeacherForms) ? { background: '#fdc8a2', border: '1px solid #fdc8a2' } : {}}
                  styles={`lg:w-[70%] animate__animated animate__fadeInDown`}
                  onClick={() => {
                    if (
                      !(state?.userData?.filledForms?.[
                        el.slice(0, el.indexOf(".xml"))
                      ] || disableStudentForms || disableTeacherForms)
                    )
                      navigate(
                        `${ROUTE_MAP.osceForm_param_osceName}${el.slice(
                          0,
                          el.indexOf(".xml")
                        )}`
                      );
                    else {
                      setError(
                        `You've already filled assessments today`
                      );
                      setTimeout(() => setError(""), 3000);
                    }
                  }}
                />
              ))}
            {error && (
              <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 mt-5 text-center ">
                {error}
              </span>
            )}
          </div>
        )}
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

export default OsceOptions;
