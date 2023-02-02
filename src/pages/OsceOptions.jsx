import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { assignOsceForm, getAssessmentStatus, getAssignedForms, getMedicalAssessments, getRandomOsceForm, getRandomOsceFormsTeacher } from "../api";

const OsceOptions = () => {
    const { state, setState } = useContext(StateContext);
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState("");
    const [assType, setAssType] = useState("");
    const [osceForms, setOsceForms] = useState("");
    const userData = JSON.parse(localStorage.getItem("userData"));

    const navigate = useNavigate();

    const pullForms = async () => {
        const assignedForms = await getAssignedForms(course, assType);
        if (assignedForms?.data?.osce_assignment?.length) {
            let forms = assignedForms?.data?.osce_assignment.map(el => `${el.osce_name}.xml`)
            setOsceForms(forms);
        } else {
            if (assType == 'teacher') {
                const res = await getRandomOsceFormsTeacher(course);
                if (res.length) {
                    setOsceForms(res)
                    res.forEach(el => {
                        assignOsceForm({
                            assessor_id: userData?.user?.id,
                            osce_name: el.slice(0, el.indexOf(".xml")),
                            assignment_date: new Date(),
                            assessment_type: assType,
                            course_type: course,
                            institute_id: state?.todayAssessment?.id
                        });
                    })
                }
            } else {
                if (course == 'gnm' || course == 'bsc') {
                    const year1 = await getRandomOsceForm(course, "1st_year");
                    const year2 = await getRandomOsceForm(course, "2nd_year");
                    const year3a = await getRandomOsceForm(course, "3rd_year", "midwivery");
                    const year3b = await getRandomOsceForm(course, "3rd_year", "pediatric");
                    const forms = [year1, year2, year3a, year3b];
                    forms.forEach(el => {
                        assignOsceForm({
                            assessor_id: userData?.user?.id,
                            osce_name: el.slice(0, el.indexOf(".xml")),
                            assignment_date: new Date(),
                            assessment_type: assType,
                            course_type: course,
                            institute_id: state?.todayAssessment?.id
                        });
                    })
                    setOsceForms(forms);
                }
                if (course == 'anm') {
                    const year1 = await getRandomOsceForm(course, "1st_year");
                    const year2a = await getRandomOsceForm(course, "2nd_year", "midwivery");
                    const year2b = await getRandomOsceForm(course, "2nd_year", 'pediatric');
                    const forms = [year1, year2a, year2b];
                    forms.forEach(el => {
                        assignOsceForm({
                            assessor_id: userData?.user?.id,
                            osce_name: el.slice(0, el.indexOf(".xml")),
                            assignment_date: new Date(),
                            assessment_type: assType,
                            course_type: course,
                            institute_id: state?.todayAssessment?.id
                        });
                    })
                    setOsceForms(forms);
                }
            }
        }
    }

    const getTodayAssessments = async () => {
        setLoading(true);
        const res = await getMedicalAssessments();
        if (res?.data?.assessment_schedule?.[0]) {
            let ass = res?.data?.assessment_schedule?.[0];
            setState(prevState => {
                return {
                    ...prevState,
                    todayAssessment: {
                        ...prevState?.todayAssessment,
                        id: ass.institute.id,
                        district: ass.institute.district,
                        instituteName: ass.institute.name,
                        nursing: ass.institute.nursing,
                        paramedical: ass.institute.paramedical,
                        gnm: ass.institute.gnm,
                        anm: ass.institute.gnm,
                        bsc: ass.institute.gnm,
                        type: ass.institute.type,
                        latitude: ass.institute.latitude,
                        longitude: ass.institute.longitude
                    }
                }
            });
        }
        setLoading(false);
    };

    const getFilledAssessmentStatus = async () => {
        setLoading(true);
        const res = await getAssessmentStatus();
        console.log(res.data);
        const filledForms = {};
        if (res?.data?.form_submissions?.length) {
            res.data.form_submissions.forEach(el => filledForms[el.form_name] = true)
        }
        setState(prevState => { return { ...prevState, userData: { ...prevState?.userData, filledForms: { ...prevState?.filledForms, ...filledForms } } } })
        setLoading(false);
    }

    useEffect(() => {
        getFilledAssessmentStatus();
        const user = JSON.parse(localStorage.getItem("userData"))?.user?.registrations[0]?.roles[0];
        setRole(() => user);
        if (!state?.todayAssessment) {
            getTodayAssessments();
        }
    }, []);

    useEffect(() => {
        if (assType) {
            pullForms();
        }
    }, [assType])

    const getFormText = (el) => {
        if (el) {
            let formName = "";
            formName = el.slice(el.indexOf("_") + 1, el.indexOf(".")).split("_").join(" ");
            return formName;
        }
        return "";
    }

    const backFunction = () => {
        if (osceForms && assType) {
            setOsceForms([]);
            setAssType(null)
            return;
        }
        if (course) {
            setCourse(null);
            return;
        }
    }

    console.log(state);

    return (
        role && (
            <CommonLayout back="/medical-assessment-options" backFunction={course ? backFunction : null}>
                {!assType && !course && <div className="flex flex-col px-5 py-8 items-center">
                    <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
                        Select Course Type
                    </p>
                    {!loading && state?.todayAssessment?.gnm && <Button
                        text="GNM"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['osce_unoccupied_beds'] ? 'disabled-btn' : ''}`}
                        onClick={() => setCourse('gnm')}
                    />}
                    {!loading && state?.todayAssessment?.anm && <Button
                        text="ANM"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['osce_unoccupied_beds'] ? 'disabled-btn' : ''}`}
                        onClick={() => setCourse('anm')}
                    />}
                    {!loading && state?.todayAssessment?.bsc && <Button
                        text="BSC"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['osce_unoccupied_beds'] ? 'disabled-btn' : ''}`}
                        onClick={() => setCourse('bsc')}

                    />}
                    {/* {!loading && <Button
                        text="Unoccupied Beds"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['osce_unoccupied_beds'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['osce_unoccupied_beds'])
                                handleNavigation("/osce-unoccupied-beds");
                            else {
                                setError("You've already filled Unoccupied Beds assessment today")
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />}
                    {!loading && <Button
                        text="Vital Signs"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['osce_vital_signs'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['osce_vital_signs'])
                                handleNavigation("/vital-signs");
                            else {
                                setError("You've already filled Vital Signs assessment today")
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />} */}
                </div>}
                {!assType && course && <div className="flex flex-col px-5 py-8 items-center">
                    <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
                        Select Assessment Type
                    </p>
                    <Button
                        text="Student"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['osce_unoccupied_beds'] ? 'disabled-btn' : ''}`}
                        onClick={() => setAssType('student')}
                    />
                    <Button
                        text="Teacher"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['osce_unoccupied_beds'] ? 'disabled-btn' : ''}`}
                        onClick={() => setAssType('teacher')}
                    />
                </div>}
                {assType && <div className="flex flex-col px-5 py-8 items-center">
                    <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
                        Select Assessment Form
                    </p>
                    {osceForms && osceForms.map(el => <Button
                        text={getFormText(el)}
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.[el.slice(0, el.indexOf(".xml"))] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.[el.slice(0, el.indexOf(".xml"))])
                                navigate(`/osceForm/${el.slice(0, el.indexOf(".xml"))}`)
                            else {
                                setError(`You've already filled ${getFormText(el)} Signs assessment today`)
                                setTimeout(() => setError(''), 3000)
                            }
                        }
                        }
                    />)}
                    {error && (
                        <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 mt-5 text-center ">
                            {error}
                        </span>
                    )}
                </div>}
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
