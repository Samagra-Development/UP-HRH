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

const OsceOptions = () => {
  const { state, setState } = useContext(StateContext);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState("");
  const [assType, setAssType] = useState("");
  const [osceForms, setOsceForms] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const scheduleId = useRef();

  const navigate = useNavigate();

  const pullForms = async () => {
    const assignedForms = await getAssignedForms(course, assType);
    if (assignedForms?.data?.osce_assignment?.length) {
      let forms = assignedForms?.data?.osce_assignment?.[0].osce_names;
      setOsceForms(forms);
    } else {
      // console.log(course)
      if (assType == "teacher") {
        const res = await getRandomOsceFormsTeacher(course);
        if (res.length) {
          setOsceForms(res);
          assignOsceForm({
            osce_names: "{" + res.toString() + "}",
            assessment_type: assType,
            course_type: course,
            schedule_id: scheduleId.current,
          });
        }
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
    const user = JSON.parse(localStorage.getItem("userData"))?.user
      ?.registrations[0]?.roles[0];
    setRole(() => user);
    getTodayAssessments();
  }, []);

  useEffect(() => {
    if (assType) {
      pullForms();
    }
  }, [assType]);

  const getFormText = (el) => {
    if (el) {
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
    if (osceForms && assType) {
      setOsceForms([]);
      setAssType(null);
      return;
    }
    if (course) {
      setCourse(null);
      return;
    }
  };

  console.log(state);

  return (
    role && (
      <CommonLayout
        back={ROUTE_MAP.medical_assessment_options}
        backFunction={course ? backFunction : null}
      >
        {!assType && !course && (
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
        {!assType && course && (
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
        {assType && (
          <div className="flex flex-col px-5 py-8 items-center">
            <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
              Select Assessment Form
            </p>
            {assType == "student" && (
              <p className="text-secondary text-[12px] font-bold mt-5 text-center animate__animated animate__fadeInDown">
                Randomly select students from the senior most batch of students
                in the course
              </p>
            )}
            {osceForms &&
              osceForms.map((el) => (
                <Button
                  text={getFormText(el)}
                  styles={`lg:w-[70%] animate__animated animate__fadeInDown ${
                    state?.userData?.filledForms?.[
                      el.slice(0, el.indexOf(".xml"))
                    ]
                      ? "disabled-btn"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      !state?.userData?.filledForms?.[
                        el.slice(0, el.indexOf(".xml"))
                      ]
                    )
                      navigate(
                        `${ROUTE_MAP.osceForm_param_osceName}${el.slice(
                          0,
                          el.indexOf(".xml")
                        )}`
                      );
                    else {
                      setError(
                        `You've already filled ${getFormText(
                          el
                        )} Signs assessment today`
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
