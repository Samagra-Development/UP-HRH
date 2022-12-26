import React from "react";
import CommonLayout from "../components/CommonLayout";

const Form = () => {
  return (
    <CommonLayout>
      <div className="flex flex-col py-8 items-center">
        <iframe
          src="http://localhost:8005/preview?xform=http%3A%2F%2Flocalhost%3A3002%2Fprefill%3Fform%3Ddstmc"
          style={{ height: "80vh", width: "100vw", marginTop: "20px" }}
        />
      </div>
    </CommonLayout>
  );
};

export default Form;
