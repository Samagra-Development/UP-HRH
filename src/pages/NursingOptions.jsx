import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { StateContext } from "../App";
import { getAssessmentStatus } from "../api";

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
        console.log(res.data);
        const filledForms = {};
        if (res?.data?.form_submissions?.length) {
            res.data.form_submissions.forEach(el => filledForms[el.form_name] = true)
        }
        setState({ ...state, userData: { ...state?.userData, filledForms: { ...state?.filledForms, ...filledForms } } })
        setLoading(false);
    }

    useEffect(() => {
        getFilledAssessmentStatus();
        const user = JSON.parse(localStorage.getItem("userData"))?.user?.registrations[0]?.roles[0];
        setRole(() => user);
    }, []);

    console.log(state);

    return (
        role && (
            <CommonLayout back="/medical-assessment-options">
                <div className="flex flex-col px-5 py-8 items-center">
                    <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] text-center animate__animated animate__fadeInDown">
                        Select your assessment type
                    </p>
                    {!loading && role == "Non-Medical" && <Button
                        text="Basic Infrastructure"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['non_medical_infrastructure'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['non_medical_infrastructure'])
                                handleNavigation("/basic-infrastructure");
                            else {
                                setError("You've already filled basic infrastructure asessment for today");
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />}
                    {!loading && role == "Non-Medical" && <Button
                        text="Student Info"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['non_medical_student_info'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['non_medical_student_info'])
                                handleNavigation("/student-info");
                            else {
                                setError("You've already filled Student Info asessment for today")
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />}
                    {!loading && role == "Non-Medical" && <Button
                        text="Facilities"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['non_medical_facilities'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['non_medical_facilities'])
                                handleNavigation("/facilities");
                            else {
                                setError("You've already filled Facilities asessment for today")
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />}
                    {!loading && role == "Non-Medical" && <Button
                        text="Faculty & Facilities"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['non_medical_faculty_and_facilities'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['non_medical_faculty_and_facilities'])
                                handleNavigation("/faculty-&-facilities");
                            else {
                                setError("You've already filled Faculty & Facilities asessment for today")
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />}
                    {!loading && role == "Medical" && <Button
                        text="Quality Of Processes"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['medical_quality_of_processes'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['medical_quality_of_processes'])
                                handleNavigation("/quality-of-processes");
                            else {
                                setError("You've already filled Quality Of Processes assessment for this date.")
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />}
                    {!loading && role == "Medical" && <Button
                        text="Medical Labs"
                        styles={`lg:w-[70%] animate__animated animate__fadeInDown ${state?.userData?.filledForms?.['medical_labs'] ? 'disabled-btn' : ''}`}
                        onClick={() => {
                            if (!state?.userData?.filledForms?.['medical_labs'])
                                handleNavigation("/labs");
                            else {
                                setError("You've already filled Labs assessment for this date.")
                                setTimeout(() => setError(''), 3000)
                            }
                        }}
                    />}
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
