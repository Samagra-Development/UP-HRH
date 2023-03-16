import React, { useState, useEffect, useContext, useRef } from "react";
import CommonLayout from "../../components/CommonLayout";
import { Routes, useNavigate, useParams } from "react-router-dom";
import { getMedicalAssessments, getPrefillXML, saveFormSubmission } from "../../api";
import { StateContext } from "../../App";
import { getCookie, getFormData, getFromLocalForage, handleFormEvents, isImage, makeDataForPrefill, setCookie, setToLocalForage, updateFormData } from "../../utils";
import ROUTE_MAP from "../../routing/routeMap";

const ENKETO_MANAGER_URL = process.env.REACT_APP_ENKETO_MANAGER_URL;
const ENKETO_URL = process.env.REACT_APP_ENKETO_URL;

const GenericOdkForm = () => {
  const user = getCookie("userData");
  let { formName } = useParams();
  const scheduleId = useRef();
  const formSpec = {
    forms: {
      [formName]: {
        skipOnSuccessMessage: true,
        prefill: {},
        submissionURL: "",
        name: formName,
        successCheck: "async (formData) => { return true; }",
        onSuccess: {
          notificationMessage: "Form submitted successfully",
          sideEffect: "async (formData) => { console.log(formData); }",
        },
        onFailure: {
          message: "Form submission failed",
          sideEffect: "async (formData) => { console.log(formData); }",
          next: {
            type: "url",
            id: "google",
          },
        },
      },
    },
    start: formName,
    metaData: {},
  };

  const { state } = useContext(StateContext);

  const getFormURI = (form, ofsd, prefillSpec) => {
    return encodeURIComponent(
      `${ENKETO_MANAGER_URL}/prefillXML?form=${form}&onFormSuccessData=${encodeFunction(
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
  const [encodedFormURI, setEncodedFormURI] = useState("");
  // const [encodedFormURI, setEncodedFormURI] = useState(
  //   getFormURI(
  //     formId,
  //     formSpec.forms[formId].onSuccess,
  //     formSpec.forms[formId].prefill
  //   )
  // );
  const [prefilledFormData, setPrefilledFormData] = useState();

  const loading = useRef(false);
  const [assData, setData] = useState({
    district: "",
    instituteName: "",
    nursing: "",
    paramedical: "",
    type: "",
    latitude: null,
    longitude: null,
  });

  async function afterFormSubmit(e) {
    console.log("Form Submit Event ----->", e.data);
    const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
    try {
      const { nextForm, formData, onSuccessData, onFailureData } = data;
      if (data?.state == "ON_FORM_SUCCESS_COMPLETED") {
        const updatedFormData = await updateFormData(formSpec.start);

        saveFormSubmission({
          schedule_id: scheduleId.current,
          form_data: updatedFormData,
          assessment_type: formName.startsWith('hospital') ? 'hospital' : 'institute',
          form_name: formSpec.start,
        });
        setTimeout(() => navigate(formName.startsWith('hospital') ? ROUTE_MAP.hospital_forms : ROUTE_MAP.medical_assessment_options), 2000);
        // setCookie(startingForm + `${new Date().toISOString().split("T")[0]}`, '');
        // setCookie(startingForm + `Images${new Date().toISOString().split("T")[0]}`, '');
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
        navigate(formName.startsWith('hospital') ? ROUTE_MAP.hospital_forms : ROUTE_MAP.medical_assessment_options)
      } else if (nextForm?.type === 'url') {
        window.location.href = nextForm.url;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleEventTrigger = async (e) => {
    handleFormEvents(startingForm, afterFormSubmit, e)
  }

  const bindEventListener = () => {
    window.addEventListener("message", handleEventTrigger);
  };
  const detachEventBinding = () => {
    window.removeEventListener("message", handleEventTrigger);
  };

  useEffect(() => {
    bindEventListener();
    getFormData({ loading, scheduleId, formSpec, startingForm, formId, setData, setEncodedFormSpec, setEncodedFormURI });
    return () => {
      detachEventBinding();
      setData(null);
      setPrefilledFormData(null);
    };
  }, []);

  return (
    <CommonLayout back={formName.startsWith('hospital') ? ROUTE_MAP.hospital_forms : ROUTE_MAP.medical_assessment_options}>
      <div className="flex flex-col items-center">
        {encodedFormURI && assData && (
          <>
            {console.log("ENCODED FROM", encodedFormURI)}
            <iframe
              title="form"
              src={`${ENKETO_URL}/preview?formSpec=${encodedFormSpec}&xform=${encodedFormURI}&userId=${user.user.id}`}
              style={{ height: "80vh", width: "100%", marginTop: "20px" }}
            />
          </>
        )}
      </div>
    </CommonLayout>
  );
};

export default GenericOdkForm;
