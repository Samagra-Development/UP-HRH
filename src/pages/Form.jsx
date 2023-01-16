import React from "react";
import CommonLayout from "../components/CommonLayout";

const Form = () => {
  return (
    <CommonLayout>
      <div className="flex flex-col py-8 items-center">
       
        <iframe
          title="Location Form"
          src="https://enketo-ratings-tech.samagra.io/preview?xform=https%3A%2F%2Fenketo-manager-ratings-tech.samagra.io%2Fprefill%3Fform%3Dlocation"
          style={{ height: "80vh", width: "100%", marginTop: "20px" }}
        />
      </div>
    </CommonLayout>
  );
};

export default Form;
