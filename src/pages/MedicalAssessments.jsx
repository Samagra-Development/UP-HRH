import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { getMedicalAssessments } from "../api";
import { StateContext } from "../App";

const MedicalAssessments = () => {
  const { state, setState } = useContext(StateContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    district: "",
    instituteName: "",
    nursing: "",
    paramedical: "",
    type: "",
    latitude: null,
    longitude: null,
  });

  const startAssess = () => {
    setState({ ...state, todayAssessment: { ...data } });
    navigate("/capture-location");
  };

  const getTodayAssessments = async () => {
    setLoading(true);
    const res = await getMedicalAssessments();
    if (res?.data?.assessment_schedule?.[0]) {
      let ass = res?.data?.assessment_schedule?.[0];
      setData({
        id: ass.institute.id,
        district: ass.institute.district,
        instituteName: ass.institute.name,
        specialization: ass.institute?.institute_specializations?.[0]?.specializations,
        courses: ass.institute?.institute_courses?.[0]?.courses,
        type: ass.institute.type,
        latitude: ass.institute.latitude,
        longitude: ass.institute.longitude,
      });
    } else setData(null);
    setLoading(false);
  };
  useEffect(() => {
    getTodayAssessments();
  }, []);

  return (
    <CommonLayout back="/welcome-medical-assessor">
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[28px] font-bold mt-4 lg:text-[45px] animate__animated animate__fadeInDown">
          Today's Assessments
        </p>
        <p className="text-primary text-2xl font-bold animate__animated animate__fadeInDown">
          {data?.district}
        </p>
        {!loading && data && (
          <div className="h-full w-full bg-tertiary flex flex-col wrap items-center pt-4 pb-8 px-5 mt-4 animate__animated animate__fadeIn animate__slow">
            <div className="flex flex-col py-3 w-full ">
              <span className="text-secondary pb-2 font-medium">
                Institute Name
              </span>
              <input
                type="text"
                className="border-2 border-primary p-3.5"
                disabled
                value={data?.instituteName}
              />
            </div>
            <div className="flex flex-col py-3 w-full">
              <span className="text-secondary pb-2 font-medium">
                Institute Type
              </span>
              <input
                type="text"
                disabled
                className="border-2 border-primary p-3.5"
                value={data?.type}
              />
            </div>
            <div className="flex flex-col py-3 w-full">
              <span className="text-secondary pb-2 font-medium">
                Institute Specialization
              </span>
              <div className="flex flex-row gap-2 flex-wrap">
                {data?.specialization?.map(el => <span className="px-5 py-1 bg-primary rounded text-white">{el}</span>)}
              </div>
            </div>
            {data?.courses?.length && <div className="flex flex-col py-3 w-full">
              <span className="text-secondary pb-2 font-medium">
                Courses offered
              </span>
              <div className="flex flex-row gap-2 flex-wrap">
                {data?.courses?.map(el => <span className="px-5 py-1 bg-primary rounded text-white">{el}</span>)}
              </div>
            </div>}
            {/* <div className="flex flex-col py-3 w-full">
              <span className="text-secondary pb-2 font-medium">
                Is Nursing
              </span>
              <input
                type="text"
                disabled
                className="border-2 border-primary p-3.5"
                value={data?.nursing}
              />
            </div>
            <div className="flex flex-col py-3 w-full">
              <span className="text-secondary pb-2 font-medium">
                Is Paramedical
              </span>
              <input
                type="text"
                disabled
                className="border-2 border-primary p-3.5"
                value={data?.paramedical}
              />
            </div> */}
            <Button text="Start Assessing" onClick={startAssess} />
          </div>
        )}
        {!loading && !data && (
          <p className="text-3xl py-10">No Assessments Today</p>
        )}
      </div>
    </CommonLayout>
  );
};

export default MedicalAssessments;
