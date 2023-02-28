import React, { useState, useEffect, useContext } from "react";
import CommonLayout from "../../components/CommonLayout";
import formSpecJSON from "../../configs/studentInfo.json";
import { useNavigate } from "react-router-dom";
import { getMedicalAssessments, saveFormSubmission } from "../../api";
import { StateContext } from "../../App";
import XMLParser from "react-xml-parser";
import ROUTE_MAP from "../../routing/routeMap";
import { getCookie, setCookie } from "../../utils";

const StudentInfo = () => {
  const { state } = useContext(StateContext);
  console.log(state);
  const getFormURI = (form, ofsd, prefillSpec) => {
    // console.log(form, ofsd, prefillSpec);
    return encodeURIComponent(
      `https://enketo-manager-ratings-tech.samagra.io/prefill?form=${form}&onFormSuccessData=${encodeFunction(
        ofsd
      )}&prefillSpec=${encodeFunction(prefillSpec)}`
    );
  };
  const formSpec = formSpecJSON;
  console.log(formSpec);
  const navigate = useNavigate();
  const encodeFunction = (func) => encodeURIComponent(JSON.stringify(func));
  const startingForm = formSpec.start;
  const [formId, setFormId] = useState(startingForm);
  const [encodedFormSpec, setEncodedFormSpec] = useState(
    encodeURI(JSON.stringify(formSpec.forms[formId]))
  );
  const [onFormSuccessData, setOnFormSuccessData] = useState(undefined);
  const [onFormFailureData, setOnFormFailureData] = useState(undefined);
  const [encodedFormURI, setEncodedFormURI] = useState(
    getFormURI(
      formId,
      formSpec.forms[formId].onSuccess,
      formSpec.forms[formId].prefill
    )
  );
  const [prefilledFormData, setPrefilledFormData] = useState();

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

  function afterFormSubmit(e) {
    // console.log(e)
    const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
    console.log("data", data);
    try {
      /* message = {
              nextForm: "formID",
              formData: {},
            }
            */

      const { nextForm, formData, onSuccessData, onFailureData } = data;

      if (data?.state == "ON_FORM_SUCCESS_COMPLETED") {
        const { user } = getCookie("userData");

        saveFormSubmission({
          assessor_id: user?.id,
          username: user?.username,
          submission_date: new Date(),
          institute_id: state?.todayAssessment?.id,
          form_data: JSON.stringify(data.formData),
          form_name: formSpec.start,
        });
        setTimeout(() => navigate(ROUTE_MAP.medical_assessment_options), 2000);
      }

      if (nextForm.type === "form") {
        setFormId(nextForm.id);
        setOnFormSuccessData(onSuccessData);
        setOnFormFailureData(onFailureData);
        setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
        setEncodedFormURI(
          getFormURI(
            nextForm.id,
            onSuccessData,
            formSpec.forms[nextForm.id].prefill
          )
        );
        navigate("medical-assessment-options");
      } else {
        window.location.href = nextForm.url;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const eventTriggered = (e) => {
    if (
      e.origin == "https://enketo-ratings-tech.samagra.io" &&
      JSON.parse(e?.data)?.state !== "ON_FORM_SUCCESS_COMPLETED"
    ) {
      var xml = new XMLParser().parseFromString(JSON.parse(e.data).formXML);
      if (xml && xml?.children && xml?.children[0]?.children?.length > 0) {
        let obj = {};
        xml.children[0]?.children?.forEach((element) => {
          obj[element.name] = element.value;
        });
        setCookie(startingForm, JSON.stringify(obj));
        setPrefilledFormData(JSON.stringify(obj));
      }
    }
    afterFormSubmit(e);
  };
  const bindEventListener = () => {
    window.addEventListener("message", eventTriggered);
  };
  const detachEventBinding = () => {
    window.removeEventListener("message", eventTriggered);
  };

  const getTodayAssessments = async () => {
    setLoading(true);
    const res = await getMedicalAssessments();
    if (res?.data?.assessment_schedule?.[0]) {
      let assess = res?.data?.assessment_schedule?.[0];
      setData({
        district: assess.institute.district,
        instituteName: assess.institute.name,
        nursing: assess.institute.nursing,
        paramedical: assess.institute.paramedical,
        gnm: assess.institute.gnm,
        anm: assess.institute.anm,
        bsc: assess.institute.bsc,
        type: assess.institute.sector,
        latitude: assess.institute.latitude,
        longitude: assess.institute.longitude,
      });
      if (getCookie(startingForm)) {
        const data = JSON.parse(getCookie(startingForm));
        for (const key in data) {
          if (data[key]) {
            formSpec.forms[formId].prefill[key] = "`" + `${data[key]}` + "`";
          }
        }
        setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
        setEncodedFormURI(
          getFormURI(
            formId,
            formSpec.forms[formId].onSuccess,
            formSpec.forms[formId].prefill
          )
        );
      } else {
        formSpec.forms[formId].prefill.dist = "`" + `${assess?.district}` + "`";
        formSpec.forms[formId].prefill.name = "`" + `${assess?.name}` + "`";
        setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
      }
    } else setData(null);
    setLoading(false);
  };

  useEffect(() => {
    getTodayAssessments();
    return () => {
      setData(null);
      setPrefilledFormData(null);
    };
  }, []);

  useEffect(() => {
    bindEventListener();
    return () => {
      detachEventBinding();
    };
  }, [prefilledFormData]);

  return (
    <CommonLayout back={ROUTE_MAP.nursing_options}>
      <div className="flex flex-col items-center">
        {!loading && data && (
          <>
            {console.log(formSpec.forms[formId].prefill)}
            <iframe
              title="student info"
              src={`${process.env.REACT_APP_ENKETO_URL}/preview?formSpec=${encodedFormSpec}&xform=${encodedFormURI}`}
              style={{ height: "80vh", width: "100%", marginTop: "20px" }}
            />
          </>
        )}
      </div>
    </CommonLayout>
  );
};

export default StudentInfo;
