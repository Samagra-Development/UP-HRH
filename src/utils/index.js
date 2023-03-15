import Cookies from "js-cookie";
import XMLParser from "react-xml-parser";
import localforage from "localforage";
import { getMedicalAssessments, getPrefillXML } from "../api";

const ENKETO_URL = process.env.REACT_APP_ENKETO_URL;

export const makeHasuraCalls = async (query) => {
  const userData = getCookie("userData");
  return fetch(process.env.REACT_APP_HASURA_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData.token}`,
    },
    body: JSON.stringify(query),
  })
    .then(async (response) => await validateResponse(response))
    .catch((error) => {
      return error;
    });
};

const validateResponse = async (response) => {
  const apiRes = await response.json();
  const jsonResponse = {
    ...apiRes,
    responseStatus: false,
  };
  return jsonResponse;
};

export const makeDataForPrefill = (prev, xmlDoc, key, finalObj, formName) => {
  if (Array.isArray(xmlDoc) && xmlDoc.length == 0 && prev.value) {
    finalObj[key] = prev.value;
  } else {
    for (const el in xmlDoc) {
      makeDataForPrefill(
        xmlDoc[el],
        xmlDoc[el].children,
        key + "_*_" + xmlDoc[el].name,
        finalObj,
        formName
      );
    }
  }
};

export const updateFormData = (name, data) => {
  let newData = JSON.stringify(data);
  let images = getCookie(name)
    ? JSON.parse(getCookie(name))
    : null;
  if (images) {
    images.forEach((el) => (newData = newData.replace(el.name, el.url)));
    return newData;
  }
  return JSON.stringify(data);
};

export const setCookie = (cname, cvalue) => {
  try {
    Cookies.set(cname, JSON.stringify(cvalue));
  } catch (error) {
    return false;
  }
};

export const getCookie = (cname) => {
  try {
    let cookie = Cookies.get(cname);
    console.log(JSON.parse(cookie));
    if (cookie) return JSON.parse(cookie);
  } catch (error) {
    return false;
  }
};

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location = "/";
  removeCookie("userData");
};

export const removeCookie = (cname) => {
  try {
    Cookies.remove(cname);
    return true;
  } catch (error) {
    return false;
  }
};

export const isImage = (key, filename) => {
  if (filename.includes(".png") || filename.includes(".tif") || filename.includes(".tiff") || filename.includes(".jpg") || filename.includes(".jpeg") || filename.includes(".bmp") || filename.includes(".gif") || filename.includes(".eps"))
    return true;
  if (key.includes("img") || key.includes("image"))
    return true;
  return false;
}


export const getFromLocalForage = async (key) => {
  try {
    return await localforage.getItem(key);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const setToLocalForage = async (key, value) => {
  await localforage.setItem(key, value);
}

export const handleFormEvents = async (startingForm, afterFormSubmit, e) => {
  if (
    e.origin == ENKETO_URL &&
    JSON.parse(e?.data)?.state !== "ON_FORM_SUCCESS_COMPLETED"
  ) {
    console.log("Form Change Event------->", e)
    var formData = new XMLParser().parseFromString(JSON.parse(e.data).formData);
    if (formData) {
      let images = JSON.parse(e.data).fileURLs;
      let prevData = await getFromLocalForage(startingForm + `${new Date().toISOString().split("T")[0]}`);
      await setToLocalForage(startingForm + `${new Date().toISOString().split("T")[0]}`, {
        formData: JSON.parse(e.data).formData,
        imageUrls: { ...prevData?.imageUrls, ...images }
      })
    }
  }
  afterFormSubmit(e);
};

export const getFormData = async ({ loading, scheduleId, formSpec, startingForm, formId, setData, setEncodedFormSpec, setEncodedFormURI }) => {
  const res = await getMedicalAssessments();
  if (res?.data?.assessment_schedule?.[0]) {
    loading.current = true;
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
    let formData = await getFromLocalForage(startingForm + `${new Date().toISOString().split("T")[0]}`);
    console.log("Form Data Local Forage --->", formData)
    if (formData) {
      setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
      let prefilledForm = await getPrefillXML(startingForm, formSpec.forms[formId].onSuccess, formData.formData, formData.imageUrls);
      console.log("Prefilled Form:", prefilledForm)
      setEncodedFormURI(prefilledForm)
      // setEncodedFormURI(
      //   getFormURI(
      //     formId,
      //     formSpec.forms[formId].onSuccess,
      //     formData
      //   )
      // );
    } else {
      let prefilledForm = await getPrefillXML(startingForm, formSpec.forms[formId].onSuccess);
      console.log("Prefilled Form Empty:", prefilledForm)
      setEncodedFormURI(prefilledForm)
    }
  } else setData(null);
  loading.current = false;
};