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