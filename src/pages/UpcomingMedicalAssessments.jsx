import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getMedicalAssessmentsUpcoming } from "../api";
import ROUTE_MAP from "../routing/routeMap";

const UpcomingMedicalAssessments = () => {
  const [tableData, setTableData] = useState();

  const getData = async () => {
    const res = await getMedicalAssessmentsUpcoming();
    if (res?.data?.assessment_schedule?.length)
      setTableData(res.data.assessment_schedule);
    else setTableData([]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <CommonLayout back={ROUTE_MAP.root}>
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[25px] font-bold mt-4 lg:text-[45px]">
          Upcoming Assessments
        </p>
        <div className="h-full w-full bg-tertiary flex flex-col items-center pt-4 pb-8 mt-6 lg:w-[90%] font-medium overflow-scroll">
          <table className="text-center">
            <thead className="border-b bg-primary">
              <tr>
                <th className="text-sm font-medium text-white px-6 py-4">
                  Date
                </th>
                <th className="text-sm font-medium text-white px-6 py-4">
                  District
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData &&
                tableData.map((el, idx) => (
                  <tr key={`${el}${idx}`} className="bg-white border-b">
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {el.date}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {el.institute.district}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </CommonLayout>
  );
};

export default UpcomingMedicalAssessments;
