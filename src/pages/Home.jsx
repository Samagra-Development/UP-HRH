import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen">
      <div className="h-[15vh] bg-tertiary"></div>
      <div className="flex justify-center items-center h-[85vh] bg-tertiary rounded-tr-3xl">
        <div className="bg-white px-8 py-11 w-[80vw]">
          <Button text={"Medical Assessor"} onClick={handleClick} />
          <br />
          <Button text={"Non-Medical Assessor"} />
        </div>
      </div>
    </div>
  );
};

export default Home;
