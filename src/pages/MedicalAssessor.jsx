import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const MedicalAssessor = () => {
    const navigate = useNavigate();
    const handleClick = (route) => {
        navigate(route);
    };
    return (
        <CommonLayout>
            <div className="flex flex-col px-5 py-8 items-center">
                <div className="flex flex-col w-full px-5 items-start">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-2xl text-secondary" onClick={() => navigate("/login-medical")} />
                </div>
                <img src="/assets/medicalAssessorWelcome.png" className="h-[200px] mt-4 lg:h-[300px]" />
                <p className="text-secondary text-4xl font-semibold mt-5">Welcome Assessor</p>
                <p className="text-primary text-md">Please check your assessments</p>
                <Button text="Today's Assessments" styles="w-80 lg:w-[60%]" onClick={() => handleClick('/medical-assessments')} />
                <Button text="Upcoming" styles="w-80 lg:w-[60%]" onClick={() => handleClick('/upcoming-medical-assessments')} />
            </div>
        </CommonLayout>
    );
};

export default MedicalAssessor;