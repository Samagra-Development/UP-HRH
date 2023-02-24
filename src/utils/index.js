export const makeHasuraCalls = async (query) => {
  const userData = extractUserFromCookie();
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
export const setCookie = (cname, cvalue, minutes) => {
  var d = new Date();
  d.setTime(d.getTime() + minutes * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};

export const extractUserFromCookie = () => {
  try {
    const { user } = JSON.parse(document.cookie.split(";")[0].split("=")[1]);
    if (user) return user;
  } catch (error) {
    return false;
  }
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  deleteAllCookies();
  window.location = "/";
};
