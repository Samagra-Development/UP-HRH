import React, { useEffect, useState } from "react";
import { getFormSubmissions } from "../api";
import CommonLayout from "../components/CommonLayout";
import CsvDownloadButton from 'react-json-to-csv'


const FormSubmissionsData = () => {
  const [submissions, setSubmissions] = useState();

  const getData = async () => {
    const res = await getFormSubmissions();
    const formSubmissionResponse = res?.data?.form_submissions;
    const formSubmissionsJson = [];
    formSubmissionResponse.forEach(item => {
      let formDataJson = JSON.parse(item.form_data);
      formDataJson["institute_id"] = item.assessment_schedule.institute_id;
      formDataJson["assessor_code"] = item.assessment_schedule.assessor_code;
      formDataJson["created_at"] = item.created_at;
      formDataJson["form_name"] = item.form_name;
      formSubmissionsJson.push(formDataJson);
    });
    if (formSubmissionsJson.length) setSubmissions(formSubmissionsJson);
    else setSubmissions([])
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <CommonLayout back="/" logoutDisabled>
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] animate__animated animate__fadeInDown">
          Welcome Admin
        </p>
        <CsvDownloadButton data={submissions}
          filename={"SubmittedForms-" + new Date().toLocaleString().replaceAll(" ", "") + ".csv"}
          style={{
            boxShadow: "inset 0px 1px 0px 0px #e184f3",
            backgroundColor: "#f4943c",
            display: "inline-block",
            fontSize: "18px",
            "color": "#ffffff",
            fontWeight: "bold",
            padding: "12px 32px",
            textDecoration: "",
            marginTop: 36
          }}>
          Download Submitted Forms
        </CsvDownloadButton>
      </div>
    </CommonLayout>
  );
};

export default FormSubmissionsData;