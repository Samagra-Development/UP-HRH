import React, { useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {};
  return (
    <CommonLayout back="/" logoutDisabled>
      <div className="flex flex-col px-5 py-8 items-center">
        <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] animate__animated animate__fadeInDown">
          Register as an assessor
        </p>
        <p className="text-primary text-md lg:text-[20px] font-medium animate__animated animate__fadeInDown">
          Please enter your details
        </p>
        <div className="flex flex-col w-80 py-5 mt-5 lg:w-[70%] animate__animated animate__fadeInDown">
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
        <div className="flex flex-col w-80 pt-3 pb-5 lg:w-[70%] animate__animated animate__fadeInDown">
          <span className="text-secondary pl-0.5 pb-2">
            <FontAwesomeIcon icon={faUser} /> &nbsp;Phone Number
          </span>
          <input
            type="text"
            placeholder="Enter username"
            className="border-2 border-primary p-3.5"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-80 pt-3 lg:w-[70%] animate__animated animate__fadeInDown">
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
            onKeyDown={(e) => {
              console.log(e.key);
              if (e.key == "Enter") handleRegister();
            }}
          />
        </div>
        {error && (
          <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 text-center mt-2">
            {error}
          </span>
        )}
        <Button
          text={"Sign In"}
          styles="w-80 lg:w-[70%] animate__animated animate__fadeInDown"
          onClick={handleRegister}
        />
        <p
          className="text-secondary py-5 animate__animated animate__fadeInDown"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
      </div>
    </CommonLayout>
  );
};

export default Register;
