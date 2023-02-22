import React, { useContext } from "react";
import { extractUserFromCookies, isUserExists } from "../../utils";
import { StateContext } from "../../App";
import ROUTE_MAP from "../routeMap";
import { Navigate } from "react-router";

const PrivateRoute = ({ children, odk }) => {
  const { state } = useContext(StateContext);
  const isAuthenticated = isUserExists();
  // console.log(state);

  // if (odk && isAuthenticated) {
  //   if (state && state.userData && state.userData.filledForms && !state.userData.filledForms[odk])
  //     return children;
  //   else
  //     return <Navigate to="/" />
  // }
  return isAuthenticated ? children : <Navigate to={ROUTE_MAP.login} />;
};

export default PrivateRoute;
