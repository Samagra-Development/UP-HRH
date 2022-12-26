import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const UpcomingMedicalAssessments = () => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState();

    useEffect(() => {
        setTableData([
            { date: "01/01/2023", district: "Gurgaon", block: "Gurgaon" },
            { date: "07/01/2023", district: "Sirnaur", block: "Hisar" },
            { date: "15/01/2023", district: "Palwal", block: "Sirnaur" },
            { date: "03/02/2023", district: "Hisar", block: "Bhiwani" },
            { date: "23/02/2023", district: "Bhiwani", block: "Gurgaon" },
        ])
    }, [])

    return (
        <CommonLayout>
            <div className="flex flex-col px-5 py-8 items-center">
                <div className="flex flex-col w-full px-5 items-start">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-2xl text-secondary" onClick={() => navigate("/welcome-medical-assessor")} />
                </div>
                <p className="text-secondary text-[25px] font-bold mt-4">Upcoming Assessments</p>
                <div className="h-full w-full bg-tertiary flex flex-col items-center pt-4 pb-8 px-4 mt-6 lg:w-[80%] font-medium">
                    <div className="w-full flex flex-row items-center justify-center gap-1 mt-2">
                        <div className=" py-3 bg-primary text-white w-[150px] text-center">Date</div>
                        <div className=" py-3 bg-primary text-white w-[150px] text-center">District</div>
                    </div>
                    {tableData && tableData.map(el => <div className="w-full flex flex-row items-center justify-center gap-1 mt-1">
                        <div className=" py-3 bg-white text-primary w-[150px] text-center">{el.date}</div>
                        <div className=" py-3 bg-white text-primary w-[150px] text-center">{el.district}</div>
                    </div>)}

                </div>
            </div>
        </CommonLayout>
    );
};

export default UpcomingMedicalAssessments;
