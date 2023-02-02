import React, { useState, useEffect, useContext } from "react";
import CommonLayout from "../../components/CommonLayout";
import formSpecJSON from "../../configs/qualityOfProcesses.json";
import { useNavigate } from "react-router-dom";
import { getMedicalAssessments, saveFormSubmission } from "../../api";
import { StateContext } from "../../App";
import XMLParser from "react-xml-parser";

const QualityOfProcesses = () => {
  const { state } = useContext(StateContext);
  const getFormURI = (form, ofsd, prefillSpec) => {
    return encodeURIComponent(
      `https://enketo-manager-ratings-tech.samagra.io/prefill?form=${form}&onFormSuccessData=${encodeFunction(
        ofsd
      )}&prefillSpec=${encodeFunction(prefillSpec)}`
    );
  };
  const formSpec = formSpecJSON;
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
    console.log("ABC", e.data);
    const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
    try {
      const { nextForm, formData, onSuccessData, onFailureData } = data;
      if (data?.state == "ON_FORM_SUCCESS_COMPLETED") {
        const userData = JSON.parse(localStorage.getItem("userData"));

        saveFormSubmission({
          assessor_id: userData?.user?.id,
          username: userData?.user?.username,
          submission_date: new Date(),
          institute_id: state?.todayAssessment?.id,
          form_data: JSON.stringify(data.formData),
          form_name: formSpec.start,
        });
        setTimeout(() => navigate("/medical-assessment-options"), 2000);
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
        localStorage.setItem(startingForm, JSON.stringify(obj));
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
    console.log("getTodayAssessments");
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
        type: assess.institute.type,
        latitude: assess.institute.latitude,
        longitude: assess.institute.longitude,
      });
      if (localStorage.getItem(startingForm)) {
        const data = JSON.parse(localStorage.getItem(startingForm));
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
    <CommonLayout back="/nursing-options">
      <div className="flex flex-col items-center">
        {!loading && data && (
          <>
            {console.log(formSpec.forms[formId].prefill)}
            <iframe
              title="form"
              src={`${process.env.REACT_APP_ENKETO_URL}/preview?formSpec=${encodedFormSpec}&xform=${encodedFormURI}`}
              style={{ height: "80vh", width: "100%", marginTop: "20px" }}
            />
          </>
        )}
      </div>
    </CommonLayout>
  );
};

export default QualityOfProcesses;
