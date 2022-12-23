import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white shadow-sm px-8 py-11 w-[80vw]">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 w-full"
          onClick={handleClick}
        >
          Medical Assessor
        </button>
        <br />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 mt-9 w-full">
          Non-Medical Assessor
        </button>
      </div>
    </div>
  );
};

export default Home;
