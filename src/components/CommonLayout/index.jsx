import React from "react";

const CommonLayout = (props) => {
    return (
        <div className="bg-tertiary h-screen w-screen flex flex-col lg:w-[50vw] lg:m-auto lg:border-2 lg:border-primary">
            <div className="w-full flex h-[18%] flex-row justify-between">
                <img src="/assets/redGolLogo.png" className="p-5 h-[120px] w-[120px] lg:w-[170px] lg:h-[170px]" />
                <img src="/assets/niramyaLogo.png" className="p-5 h-[120px] w-[120px] lg:w-[170px] lg:h-[170px]" />
            </div>
            <div className="bg-white h-full w-full rounded-t-[60px]">
                {props.children}
            </div>
        </div>
    );
};

export default CommonLayout;
