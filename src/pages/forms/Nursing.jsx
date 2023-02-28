import React, { useState, useEffect, useContext, useRef } from "react";
import CommonLayout from "../../components/CommonLayout";
import formSpecJSON from "../../configs/nursing.json";
import { useNavigate } from "react-router-dom";
import { getMedicalAssessments, saveFormSubmission } from "../../api";
import { StateContext } from "../../App";
import XMLParser from "react-xml-parser";
import {
  getCookie,
  makeDataForPrefill,
  setCookie,
  updateFormData,
} from "../../utils";
import ROUTE_MAP from "../../routing/routeMap";

const ENKETO_MANAGER_URL = process.env.REACT_APP_ENKETO_MANAGER_URL;
const ENKETO_URL = process.env.REACT_APP_ENKETO_URL;

const Nursing = () => {
  const { state } = useContext(StateContext);
  const formSpec = formSpecJSON;
  const getFormURI = (form, ofsd, prefillSpec) => {
    return encodeURIComponent(
      `${ENKETO_MANAGER_URL}/prefill?form=${form}&onFormSuccessData=${encodeFunction(
        ofsd
      )}&prefillSpec=${encodeFunction(prefillSpec)}`
    );
  };
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
  const scheduleId = useRef();
  const [assData, setData] = useState({
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
      const { nextForm, formData, onSuccessData, onFailureData } = data;
      if (data?.state == "ON_FORM_SUCCESS_COMPLETED") {
        const updatedFormData = updateFormData(
          startingForm + "Images",
          formData
        );

        saveFormSubmission({
          schedule_id: scheduleId.current,
          form_data: updatedFormData,
          form_name: formSpec.start,
        });
        setTimeout(() => navigate(ROUTE_MAP.medical_assessment_options), 2000);
        setCookie(startingForm, "");
        setCookie(startingForm + "Images", "");
      }

      if (nextForm?.type === "form") {
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
    console.log("------------------------------------");
    console.log(e);
    console.log("------------------------------------");
    if (
      e.origin == ENKETO_URL &&
      JSON.parse(e?.data)?.state !== "ON_FORM_SUCCESS_COMPLETED"
    ) {
      var xml = new XMLParser().parseFromString(JSON.parse(e.data).formXML);
      if (xml && xml?.children?.length > 0) {
        let obj = {};
        let images = JSON.parse(e.data).fileURLs;
        if (images?.[0]?.name) {
          setCookie(startingForm + "Images", JSON.stringify(images));
        }
        makeDataForPrefill({}, xml.children, xml.name, obj);
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
      let ass = res?.data?.assessment_schedule?.[0];
      scheduleId.current = ass.id;
      setData({
        schedule_id: ass.id,
        id: ass.institute.id,
        district: ass.institute.district,
        instituteName: ass.institute.name,
        specialization:
          ass.institute?.institute_specializations?.[0]?.specializations,
        courses: ass.institute?.institute_types?.[0]?.types,
        type: ass.institute.sector,
        latitude: ass.institute.latitude,
        longitude: ass.institute.longitude,
      });
      if (getCookie(startingForm)) {
        const data = JSON.parse(getCookie(startingForm));
        let images = getCookie(startingForm + "Images")
          ? JSON.parse(getCookie(startingForm + "Images"))
          : null;
        for (const key in data) {
          if (data[key]) {
            if (images) {
              let foundImage = images.filter((el) => el.name == data[key]);
              if (foundImage?.length) {
                formSpec.forms[formId].prefill[key] =
                  "`" + `${foundImage[0].url}` + "`";
                continue;
              }
            }
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
        formSpec.forms[formId].prefill.dist = "`" + `${ass?.district}` + "`";
        formSpec.forms[formId].prefill.name = "`" + `${ass?.name}` + "`";
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
    <CommonLayout back={ROUTE_MAP.medical_assessment_options}>
      <div className="flex flex-col items-center">
        {!loading && assData && (
          <>
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

export default Nursing;
