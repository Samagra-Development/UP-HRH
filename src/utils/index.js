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