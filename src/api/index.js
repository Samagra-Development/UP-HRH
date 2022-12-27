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

export const testHasuraQuery = () => {
    const query = {
        query: `
      query ($iti_id: Int) {
        test() {
          batch
          trade
        }
      }
      `,
        "variables": { iti_id: 9 }
    };
    return makeHasuraCalls(query);
};