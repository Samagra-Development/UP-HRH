import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getMedicalAssessments } from "../api";

const MedicalAssessments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    district: '',
    instituteName: '',
    nursing: '',
    paramedical: '',
    type: ''
  });

  const startAssess = (route) => {
    navigate("/capture-location");
  };

  const getTodayAssessments = async () => {
    setLoading(true);
    const res = await getMedicalAssessments();
    if (res?.data?.institutes?.[0]) {
      let ass = res?.data?.institutes?.[0];
      setData({
        district: ass.district,
        instituteName: ass.name,
        nursing: ass.nursing,
        paramedical: ass.paramedical,
        type: ass.type
      })
    } else setData(null)
    setLoading(false);
  }

  useEffect(() => {
    getTodayAssessments();
  }, []);

  return (
    <CommonLayout>
      <div className="flex flex-col px-5 py-8 items-center">
        <div className="flex flex-col w-full px-2 items-start">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-2xl text-gray-300"
            onClick={() => navigate("/welcome-medical-assessor")}
          />
        </div>
        <p className="text-secondary text-[28px] font-bold mt-4 lg:text-[45px]">
          Today's Assessments
        </p>
        <p className="text-primary text-3xl font-semibold">{data?.district}</p>
        {!loading && data && <div className="h-full w-full bg-tertiary flex flex-col items-center pt-4 pb-8 px-5 mt-4">
          <div className="flex flex-col py-3 w-full">
            <span className="text-secondary pb-2 font-medium">
              Institute Name
            </span>
            <input
              type="text"
              placeholder="Enter institute name"
              className="border-2 border-primary p-3.5"
              disabled
              value={data?.instituteName}
            />
          </div>
          <div className="flex flex-col py-3 w-full">
            <span className="text-secondary pb-2 font-medium">Institute Type</span>
            <input
              type="text"
              disabled
              placeholder="Enter POC name"
              className="border-2 border-primary p-3.5"
              value={data?.type}
            />
          </div>
          <div className="flex flex-col py-3 w-full">
            <span className="text-secondary pb-2 font-medium">Is Nursing</span>
            <input
              type="text"
              disabled
              placeholder="Enter POC name"
              className="border-2 border-primary p-3.5"
              value={data?.nursing}
            />
          </div>
          <div className="flex flex-col py-3 w-full">
            <span className="text-secondary pb-2 font-medium">Is Paramedical</span>
            <input
              type="text"
              placeholder="Enter POC name"
              disabled
              className="border-2 border-primary p-3.5"
              value={data?.paramedical}
            />
          </div>
          {/* <div className="flex flex-col py-3 w-full">
            <span className="text-secondary pb-2 font-medium">POC Name</span>
            <input
              type="text"
              placeholder="Enter POC name"
              className="border-2 border-primary p-3.5"
              value={data?.pocName}
              onChange={(e) => setData({ ...data, pocName: e.target.value })}
            />
          </div> */}
          {/* <div className="flex flex-col py-3 w-full mb-[-10px]">
            <span className="text-secondary pb-2 font-medium">POC Mobile</span>
            <input
              type="number"
              placeholder="Enter POC mobile"
              className="border-2 border-primary p-3.5"
              value={data?.pocMobile}
              onChange={(e) => setData({ ...data, pocMobile: e.target.value })}
            />
          </div> */}
          <Button text="Start Assessing" onClick={startAssess} />
        </div>}
        {!loading && !data && <p className="text-3xl py-10">No Assessments Today</p>}
      </div>
    </CommonLayout>
  );
};

export default MedicalAssessments;
