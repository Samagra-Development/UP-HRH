import axios from "axios";
import { makeHasuraCalls } from "../utils";

const BASE_URL = process.env.REACT_APP_USER_SERVICE_URL;
const applicationId = process.env.REACT_APP_APPLICATION_ID;

export const loginMedical = async (username, pass) => {
  try {
    const res = await axios.post(BASE_URL + "login", {
      password: pass,
      loginId: username,
      applicationId: applicationId
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const sendOtpToMobile = async (mobile) => {
  try {
    const res = await axios.post(BASE_URL + "changePassword/sendOTP", {
      username: mobile
    }, { headers: { 'x-application-id': applicationId } });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const verifyOtpSavePassword = async (mobile, pass, otp) => {
  try {
    const res = await axios.patch(BASE_URL + "changePassword/update", {
      username: mobile,
      password: pass,
      OTP: otp
    }, { headers: { 'x-application-id': applicationId } });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const getMedicalAssessments = () => {
  const query = {
    query: `
      query ($date: date) {
        institutes(where: {schedule_date: {_eq: $date}}) {
          id
          name
          nursing
          schedule_date
          paramedical
          type
          application_id
          district
          latitude
          longitude
        }
      }
      `,
    "variables": { date: new Date().toISOString().split('T')[0] }
  };
  return makeHasuraCalls(query);
};

export const getMedicalAssessmentsUpcoming = () => {
  const query = {
    query: `
      query {
        institutes(order_by: {schedule_date: asc}){
          id
          name
          nursing
          schedule_date
          paramedical
          type
          application_id
          district
        }
      }
      `,
    variables: {}
  };
  return makeHasuraCalls(query);
};

export const getPrefillXML = async (form, onFormSuccessData, prefillXML) => {
  try {
    const res = await axios.post(`https://enketo-manager-ratings-tech.samagra.io/prefillXML?form=${form}&onFormSuccessData=${encodeURI(JSON.stringify(onFormSuccessData))}`, {
      prefillXML
    }, { headers: {} });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export const createUser = async (data) => {
  try {
    const body = {
      registration: {
        applicationId: applicationId,
        usernameStatus: 'ACTIVE',
        roles: [data.role]
      },
      user: {
        password: data?.password,
        username: data?.mobile,
        mobilePhone: data?.mobile,
      }
    };

    const userRes = await axios.post(BASE_URL + 'signup', body, { headers: { 'x-application-id': applicationId } });

    if (userRes?.data?.responseCode === "OK") {
      return userRes.data;
    } else if (userRes?.data?.status != 200) {
      const errorStrings = [];
      const errors = userRes?.data?.exception?.fieldErrors;
      Object.keys(errors).forEach(key => {
        errorStrings.push(errors[key]?.[0]?.message);
      })
      return errorStrings.join(". \n");

    }
  } catch (error) {
    console.log('Create Catch', error);
    const errorStrings = [];
    const errors = error?.response?.data?.exception?.fieldErrors;
    Object.keys(errors).forEach(key => {
      errorStrings.push(errors[key]?.[0]?.message);
    })
    return errorStrings.join(". \n") || "An error occured while creating user. Try again";
  }
  return null;
}

export const saveNursingFormSubmissions = (data) => {
  const query = {
    query: `mutation ($object: [nursing_submissions_insert_input!] = {}) {
      insert_nursing_submissions(objects: $object) {
        returning {
          id
          created_at
        }
      }
    }`,
    variables: { object: data }
  };
  return makeHasuraCalls(query);
};

export const saveParamedicalFormSubmissions = (data) => {
  const query = {
    query: `mutation ($object: [paramedical_submissions_insert_input!] = {}) {
      insert_paramedical_submissions(objects: $object) {
        returning {
          id
          created_at
        }
      }
    }`,
    variables: { object: data }
  };
  return makeHasuraCalls(query);
};

export const getAssessmentStatus = () => {
  const query = {
    query: `
      {
        q1: nursing_submissions(where: {submission_date: {_eq: "${new Date().toISOString().split('T')[0]}"}}) {
          id
          form_name
          created_at
        }
        q2: paramedical_submissions(where: {submission_date: {_eq: "${new Date().toISOString().split('T')[0]}"}}) {
          id
          form_name
          created_at
        }
      }
      `,
    variables: {}
  };
  return makeHasuraCalls(query);
};
