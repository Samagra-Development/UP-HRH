import dayjs from "dayjs";
import Cookies from "js-cookie";

export const todaysDate = () => {
  return dayjs().format("DD/MM/YYYY");
};

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
  let images = localStorage.getItem(name)
    ? JSON.parse(localStorage.getItem(name))
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
