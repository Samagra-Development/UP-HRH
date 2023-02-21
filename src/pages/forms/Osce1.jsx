import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import ROUTE_MAP from "../../routing/routeMap";

const Osce1 = () => {
  const forms = [
    "osce_1",
    "osce_3",
    "osce_4",
    "osce_5",
    "osce_6",
    "osce_7",
    "osce_8",
    "osce_9",
    "osce_10",
  ];
  const [formId, setFormId] = useState("");

  useEffect(() => {
    setFormId(Math.floor(Math.random() * forms.length));
  }, []);
  console.log(forms[formId]);
  return (
    <CommonLayout back={ROUTE_MAP.osce_options}>
      {formId && (
        <div className="flex flex-col items-center">
          <iframe
            title="Location Form"
            src={`${process.env.REACT_APP_ENKETO_URL}/preview?xform=https%3A%2F%2Fenketo-manager-ratings-tech.samagra.io%2Fprefill%3Fform%3D${forms[formId]}`}
            style={{ height: "80vh", width: "100%", marginTop: "20px" }}
          />
        </div>
      )}
    </CommonLayout>
  );
};

export default Osce1;
