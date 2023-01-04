import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Navigate, useNavigate } from "react-router-dom";

const CommonLayout = (props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-tertiary h-screen w-screen flex flex-col lg:w-[52vw] md:w-[80vw] md:m-auto lg:m-auto">
      <div className="w-full flex h-[18%] flex-row justify-between">
        <img
          src="/assets/redGolLogo.png"
          className="p-5 h-[120px] w-[120px] lg:w-[170px] lg:h-[170px]"
          alt="illustration"
        />
        <img
          src="/assets/niramyaLogo.png"
          className="p-5 h-[120px] w-[120px] lg:w-[170px] lg:h-[170px]"
          alt="illustration"
        />
      </div>
      <div className="bg-white h-full w-full rounded-t-[60px]">
        {!props.backDisabled && <div className="flex flex-col w-full pl-8 pt-7 items-start">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-2xl text-gray-300"
            onClick={() => navigate(props.back)}
          />
        </div>}
        {props.children}
      </div>
    </div>
  );
};

export default CommonLayout;
