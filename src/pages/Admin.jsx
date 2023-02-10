import React, { useEffect, useState } from "react";
import { getFormSubmissions } from "../api";
import CommonLayout from "../components/CommonLayout";

const FormSubmissionsData = () => {
  const [submissions, setSubmissions] = useState();

  const getData = async () => {
    const res = await getFormSubmissions();
    console.log("Submissions: "+res?.data);
    if (res?.data?.length) setSubmissions(res.data);
    else setSubmissions([])
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <CommonLayout back="/login">
    <div className="flex flex-col px-5 py-8 items-center">
      <p className="text-secondary text-[25px] font-bold mt-4 lg:text-[45px]">
        Welcome
      </p>
      <div className="h-full w-full bg-tertiary flex flex-col items-center pt-4 pb-8 mt-6 lg:w-[90%] font-medium overflow-scroll">
        {
          submissions
        }
        {/* <table className="text-center">
          <thead className="border-b bg-primary">
            <tr>
              <th className="text-sm font-medium text-white px-6 py-4">
                Date
              </th>
              <th className="text-sm font-medium text-white px-6 py-4">
                District
              </th>
            </tr>
          </thead >
          <tbody>
            {tableData && tableData.map(el => <tr className="bg-white border-b">
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {el.date}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {el.institute.district}
              </td>
            </tr >)}
          </tbody>
        </table> */}

      </div>
    </div>
  </CommonLayout >
  );
};

export default FormSubmissionsData;