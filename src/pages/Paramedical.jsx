import React, { useState, useEffect } from "react";
import CommonLayout from "../components/CommonLayout";
import formSpecJSON from "../configs/paraMedical.json";
import { useNavigate } from "react-router-dom";
import { getMedicalAssessments, getPrefillXML } from "../api";

const Paramedical = () => {
  const getFormURI = (form, ofsd, prefillSpec) => {
    console.log(form, ofsd, prefillSpec);
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
    const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
    try {
      /* message = {
        nextForm: "formID",
        formData: {},
      }
      */
      const { nextForm, formData, onSuccessData, onFailureData } = data;
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
      // console.log(e)
    }
  }

  const eventTriggered = (e) => {
    if (e.origin == "https://enketo-ratings-tech.samagra.io") {
      console.log("event triggered", JSON.parse(e.data).formXML);
      localStorage.setItem("paramedical", JSON.parse(e.data).formXML);
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
    if (res?.data?.institutes?.[0]) {
      let assess = res?.data?.institutes?.[0];
      setData({
        district: assess.district,
        instituteName: assess.name,
        nursing: assess.nursing,
        paramedical: assess.paramedical,
        type: assess.type,
        latitude: assess.latitude,
        longitude: assess.longitude,
      });
      if (localStorage.getItem("paramedical")) {
        const data = await getPrefillXML(
          formId,
          formSpec.forms[formId].onSuccess,
          localStorage.getItem("paramedical")
        );
        console.log(data);
      } else {
        formSpec.forms[formId].prefill.dist = "`" + `${assess?.district}` + "`";
        formSpec.forms[formId].prefill.name = "`" + `${assess?.name}` + "`";
        setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
        setEncodedFormURI(
          getFormURI(
            formId,
            formSpec.forms[formId].onSuccess,
            formSpec.forms[formId].prefill
          )
        );
      }
    } else setData(null);
    setLoading(false);
  };

  useEffect(() => {
    getTodayAssessments();
  }, []);

  useEffect(() => {
    bindEventListener();
    return () => {
      detachEventBinding();
    };
  }, [data]);

  return (
    <CommonLayout back="/medical-assessment-options">
      <div className="flex flex-col items-center">
        {!loading && data && (
          <>
            {console.log(formSpec.forms[formId].prefill)}
            <iframe
              title="Location Form"
              src={`https://enketo-ratings-tech.samagra.io/preview?formSpec=${encodedFormSpec}&xform=${encodedFormURI}`}
              style={{ height: "80vh", width: "100%", marginTop: "20px" }}
            />
          </>
        )}
      </div>
    </CommonLayout>
  );
};

export default Paramedical;
