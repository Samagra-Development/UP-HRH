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