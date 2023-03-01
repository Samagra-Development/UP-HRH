import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import CommonModal from "../Modal";

import { logout } from "../../utils/index.js";

const CommonLayout = (props) => {
  const navigate = useNavigate();
  const [logoutModal, showLogoutModal] = useState(false);

  return (
    <>
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
        <div className="bg-white h-full w-full rounded-t-[60px] overflow-scroll pb-5">
          <div className="flex flex-row w-full px-8 py-7 justify-between cursor-pointer">
            {!props.backDisabled && (
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-2xl text-gray-300 lg:text-4xl"
                onClick={() => {
                  props.backFunction
                    ? props.backFunction()
                    : navigate(props.back);
                }}
              />
            )}
            {!props.logoutDisabled && (
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="text-2xl text-gray-300 lg:text-4xl"
                onClick={() => showLogoutModal(true)}
              />
            )}
          </div>
          {props.children}
        </div>
      </div>
      {logoutModal && (
        <CommonModal>
          <div>
            <p className="text-secondary text-xl lg:text-3xl text-semibold font-medium text-center">
              Continue to logout?
            </p>
            <div className="flex flex-row justify-center w-full py-4">
              <div
                className="border border-primary text-primary py-1 px-7 mr-2 cursor-pointer lg:px-16 lg:py-3 lg:text-xl"
                onClick={() => logout()}
              >
                Yes
              </div>
              <div
                className="border border-primary bg-primary text-white py-1 px-7 cursor-pointer lg:px-16 lg:py-3 lg:text-xl"
                onClick={() => showLogoutModal(false)}
              >
                No
              </div>
            </div>
          </div>
        </CommonModal>
      )}
    </>
  );
};

export default CommonLayout;
