import React, { useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const LoginMedical = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setError("Either username or password is missing");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    navigate("/welcome-medical-assessor");
  };

  return (
    <CommonLayout>
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[70px]">
          Welcome Back
        </p>
        <p className="text-primary text-md lg:text-[20px] lg:mt-[20px] font-medium">
          Please enter your details
        </p>
        <div className="flex flex-col w-80 py-5 mt-5 lg:w-[70%]">
          <span className="text-secondary pl-0.5 pb-2">
            <FontAwesomeIcon icon={faUser} /> &nbsp;Username
          </span>
          <input
            type="text"
            placeholder="Enter username"
            className="border-2 border-primary p-3.5"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-80 pt-3 lg:w-[70%]">
          <span className="text-secondary pl-0.5 pb-2">
            <FontAwesomeIcon icon={faLock} />
            &nbsp; Password
          </span>
          <input
            type="password"
            placeholder="Enter password"
            className="border-2 border-primary p-3.5 mb-5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 text-center mt-2">
            {error}
          </span>
        )}
        <Button
          text={"Sign In"}
          styles="w-80 lg:w-[70%]"
          onClick={handleLogin}
        />
        <p
          className="text-secondary py-4 font-medium"
          onClick={() => navigate("/")}
        >
          Go back
        </p>
      </div>
    </CommonLayout>
  );
};

export default LoginMedical;