import React, { useState } from "react";
import LoginMedical from "../LoginMedical";
import Home from "../Home";

const Login = () => {
  const [loginShow, setLoginShow] = useState(false);

  const handleSetLoginShow = () => setLoginShow((oldValue) => !oldValue);
  return loginShow ? (
    <LoginMedical handleStepChangeForLogin={handleSetLoginShow} />
  ) : (
    <Home handleStepChangeForLogin={handleSetLoginShow} />
  );
};

export default Login;
