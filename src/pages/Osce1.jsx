import React from "react";
import CommonLayout from "../components/CommonLayout";

const Osce1 = () => {
  return (
    <CommonLayout back="/medical-assessment-options">
      <div className="flex flex-col items-center">
        <iframe
          title="Location Form"
          src="http://enketo-ratings-tech.samagra.io/preview?xform=http%3A%2F%2Fenketo-manager-ratings-tech.samagra.io%2Fprefill%3Fform%3Dosce_1"
          style={{ height: "80vh", width: "100%", marginTop: "20px" }}
        />
      </div>
    </CommonLayout>
  );
};

export default Osce1;
