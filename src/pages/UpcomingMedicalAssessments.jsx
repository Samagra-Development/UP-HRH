import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getMedicalAssessmentsUpcoming } from "../api";

const UpcomingMedicalAssessments = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState();
  const [dimensions, setDimensions] = useState({ height: window.innerHeight, width: window.innerWidth });

  const getData = async () => {
    const res = await getMedicalAssessmentsUpcoming();
    if (res?.data?.institutes?.length) setTableData(res.data.institutes);
    else setTableData([])
  }

  useEffect(() => {
    getData();
  }, []);

  const setScreenDimensions = () => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth
    })
  }

  window.addEventListener("resize", setScreenDimensions)


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
        <p className="text-secondary text-[25px] font-bold mt-4 lg:text-[45px]">
          Upcoming Assessments
        </p>
        <div className="h-full w-full bg-tertiary flex flex-col items-center pt-4 pb-8 mt-6 lg:w-[90%] font-medium overflow-scroll">
          <table class="text-center">
            <thead class="border-b bg-primary">
              <tr>
                <th class="text-sm font-medium text-white px-6 py-4">
                  Date
                </th>
                <th class="text-sm font-medium text-white px-6 py-4">
                  District
                </th>
                {dimensions?.width > 769 && <th class="text-sm font-medium text-white px-6 py-4">
                  Name
                </th>}
                {dimensions?.width > 769 && <th class="text-sm font-medium text-white px-6 py-4">
                  Paramedical
                </th>}
                {dimensions?.width > 769 && <th class="text-sm font-medium text-white px-6 py-4">
                  Nursing
                </th>}
              </tr>
            </thead >
            <tbody>
              {tableData && tableData.map(el => <tr class="bg-white border-b">
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {el.schedule_date}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {el.district}
                </td>
                {dimensions?.width > 769 && <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {el.name}
                </td>}
                {dimensions?.width > 769 && <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {el.paramedical}
                </td>}
                {dimensions?.width > 769 && <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {el.nursing}
                </td>}
              </tr >)}
            </tbody>
          </table>

        </div>
      </div>
    </CommonLayout >
  );
};

export default UpcomingMedicalAssessments;
