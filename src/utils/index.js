export const makeHasuraCalls = async (query) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return fetch(process.env.REACT_APP_HASURA_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(query)
    }).then(async (response) => await validateResponse(response))
        .catch((error) => { return error });
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
            makeDataForPrefill(xmlDoc[el], xmlDoc[el].children, key + "_*_" + xmlDoc[el].name, finalObj, formName);
        }
    }
}

export const updateFormData = (name, data) => {
    let newData = JSON.stringify(data);
    let images = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : null;
    if (images) {
        images.forEach(el => newData = newData.replace(el.name, el.url));
        return newData;
    }
    return JSON.stringify(data);
}