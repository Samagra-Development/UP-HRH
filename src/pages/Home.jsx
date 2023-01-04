import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CommonLayout from "../components/CommonLayout";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = (route) => {
    navigate(route);
  };
  return (
    <CommonLayout backDisabled={true}>
      <div className="flex flex-col px-5 py-8 items-center">
        <img
          src="/assets/homeVector.png"
          className="h-60 lg:h-80 my-5 lg:mt-[70px]"
          alt="illustration"
        />
        <Button
          text="Medical Assessor"
          styles="w-80 lg:w-[70%] lg:mt-[70px]"
          onClick={() => handleClick("/login")}
        />
        <Button
          text="Non-Medical Assessor"
          styles="w-80 lg:w-[70%] lg:mt-[30px]"
          onClick={() => handleClick("/login")}
        />
      </div>
    </CommonLayout>
  );
};

export default Home;
