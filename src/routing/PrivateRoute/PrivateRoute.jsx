import React, { useContext } from "react";
import { StateContext } from "../../App";
import ROUTE_MAP from "../routeMap";
import { Navigate } from "react-router";
import { getCookie } from "../../utils";

const PrivateRoute = ({ children, odk }) => {
  const { state } = useContext(StateContext);
  const isAuthenticated = getCookie("userData");

  // if (odk && isAuthenticated) {
  //   if (state && state.userData && state.userData.filledForms && !state.userData.filledForms[odk])
  //     return children;
  //   else
  //     return <Navigate to="/" />
  // }
  return isAuthenticated ? children : <Navigate to={ROUTE_MAP.login} />;
};

export default PrivateRoute;
