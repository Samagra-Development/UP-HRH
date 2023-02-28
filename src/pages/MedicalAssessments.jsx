import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";
import { getMedicalAssessments } from "../api";
import { faUser, faLock, faMobile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StateContext } from "../App";
import ROUTE_MAP from "../routing/routeMap";
import { getCookie } from "../utils";

const MedicalAssessments = () => {
  const { state, setState } = useContext(StateContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isMobile = window.innerWidth < 500;
  const [role, setRole] = useState('');
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
    navigate(role == 'Medical' ? ROUTE_MAP.assessment_type : ROUTE_MAP.capture_location);
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
        specialization:
          ass.institute?.institute_specializations?.[0]?.specializations,
        courses: ass.institute?.institute_types?.[0]?.types,
        type: ass.institute.sector,
        pocs: ass.institute.institute_pocs,
        latitude: ass.institute.latitude,
        longitude: ass.institute.longitude,
      });
    } else setData(null);
    setLoading(false);
  };
  useEffect(() => {
    getTodayAssessments();
    const {
      user: { registrations },
    } = getCookie("userData");
    const roles = registrations[0]?.roles[0];
    setRole(roles);
  }, []);

  return (
    <CommonLayout back={ROUTE_MAP.root}>
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[28px] font-bold mt-4 lg:text-[45px] animate__animated animate__fadeInDown">
          Today's Assessments
        </p>
        <p className="text-primary text-2xl font-bold animate__animated animate__fadeInDown">
          {data?.district}
        </p>
        {!loading && data && (
          <div className="h-full w-full bg-tertiary flex flex-col wrap items-center pt-4 pb-8 px-5 mt-4 animate__animated animate__fadeIn animate__slow overflow-scroll">
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
                POC Details
              </span>
              {data?.pocs?.map(el =>
                <div className="mb-4 text-secondary"><FontAwesomeIcon icon={faUser} /> &nbsp; {el.name}, {el.number}</div>
              )}
            </div>
            <div className="flex flex-col py-3 w-full">
              <span className="text-secondary pb-2 font-medium">
                Institute Specialization
              </span>
              <div className="flex flex-row gap-2 flex-wrap">
                {data?.specialization?.map((el, idx) => (
                  <span
                    key={`${el}${idx}`}
                    className="px-5 py-1 bg-primary rounded text-white"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>
            {data?.courses?.length && (
              <div className="flex flex-col py-3 w-full">
                <span className="text-secondary pb-2 font-medium">
                  Courses offered
                </span>
                <div className="flex flex-row gap-2 flex-wrap">
                  {data?.courses?.map((el, idx) => (
                    <span
                      key={`${el}${idx}`}
                      className="px-5 py-1 bg-primary rounded text-white"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col py-3 w-full" >
              <span className="text-secondary pb-2 font-medium">
                Institute Location
              </span>
              {data.latitude && data.longitude && <iframe
                src={`https://maps.google.com/maps?q=${data?.latitude},${data?.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width={isMobile ? "100%" : "60%"}
                height={200}
                loading="lazy"
                title="map"
                className="mt-5 animate__animated animate__fadeIn"
              />}
            </div>
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
