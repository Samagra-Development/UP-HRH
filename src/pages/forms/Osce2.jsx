import React from "react";
import CommonLayout from "../../components/CommonLayout";
import ROUTE_MAP from "../../routing/routeMap";

const Osce2 = () => {
  return (
    <CommonLayout back={ROUTE_MAP.osce_options}>
      <div className="flex flex-col items-center">
        <iframe
          title="Location Form"
          src={`${process.env.REACT_APP_ENKETO_URL}/preview?xform=https%3A%2F%2Fenketo-manager-ratings-tech.samagra.io%2Fprefill%3Fform%3Dosce_2`}
          style={{ height: "80vh", width: "100%", marginTop: "20px" }}
        />
      </div>
    </CommonLayout>
  );
};

export default Osce2;
