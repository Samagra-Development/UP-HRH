import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import MedicalAssessor from "./pages/MedicalAssessor";
import MedicalAssessments from "./pages/MedicalAssessments";
import UpcomingMedicalAssessments from "./pages/UpcomingMedicalAssessments";
import Form from "./pages/Form";
import CaptureLocation from "./pages/CaptureLocation";
import MedicalAssessmentsOptions from "./pages/MedicalAssessmentsOptions";
import ForgotPassword from "./pages/ForgotPassword";
import Nursing from "./pages/forms/Nursing";
import Paramedical from "./pages/forms/Paramedical";
import Osce1 from "./pages/forms/Osce1";
import Osce2 from "./pages/forms/Osce2";
import Register from "./pages/Register";
import BasicInfrastructure from "./pages/forms/BasicInfrastructure";
import Facilities from "./pages/forms/Facilities";
import StudentInfo from "./pages/forms/StudentInfo";
import NursingOptions from "./pages/NursingOptions";
import FacultyFacilities from "./pages/forms/FacultyFacilities";
import ParamedicalOptions from "./pages/ParamedicalOptions";
import OsceOptions from "./pages/OsceOptions";
import QualityOfProcesses from "./pages/forms/QualityOfProcesses";
import Labs from "./pages/forms/Labs";
import GenericOsceForm from "./pages/forms/GenericOsceForm";
import NursingNonMedical from "./pages/forms/NursingNonMedical";
import ParamedicalNonMedical from "./pages/forms/ParamedicalNonMedical";
import Admin from "./pages/Admin";
import ROUTE_MAP from "./routing/routeMap";
import Login from "./pages/Login/Login";
import PrivateRoute from "./routing/PrivateRoute/PrivateRoute";
import dayjs from "dayjs";
import { todaysDate } from "./utils";

export const StateContext = createContext();

function App() {
  const [state, setState] = useState();
  useEffect(() => {
    const date = todaysDate();
    console.log(date);
  }, []);
  return (
    <div className="App">
      <StateContext.Provider value={{ state, setState }}>
        <BrowserRouter>
          <Routes>
            <Route
              path={ROUTE_MAP.root}
              element={
                <PrivateRoute>
                  <MedicalAssessor />
                </PrivateRoute>
              }
            />
            <Route path={ROUTE_MAP.login} element={<Login />} />
            <Route path={ROUTE_MAP.register} element={<Register />} />
            <Route
              path={ROUTE_MAP.medical_assessments}
              element={
                <PrivateRoute>
                  <MedicalAssessments />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.upcoming_medical_assessments}
              element={
                <PrivateRoute>
                  <UpcomingMedicalAssessments />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.form}
              element={
                <PrivateRoute>
                  <Form />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.capture_location}
              element={
                <PrivateRoute>
                  <CaptureLocation />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.medical_assessment_options}
              element={
                <PrivateRoute>
                  <MedicalAssessmentsOptions />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.nursing_options}
              element={
                <PrivateRoute>
                  <NursingOptions />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.paramedical_options}
              element={
                <PrivateRoute>
                  <ParamedicalOptions />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.osce_options}
              element={
                <PrivateRoute>
                  <OsceOptions />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.forgot_password}
              element={<ForgotPassword />}
            />
            <Route
              path={ROUTE_MAP.nursing}
              element={
                <PrivateRoute>
                  <Nursing />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.nursing_non_medical}
              element={
                <PrivateRoute>
                  <NursingNonMedical />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.paramedical}
              element={
                <PrivateRoute>
                  <Paramedical />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.paramedical_non_medical}
              element={
                <PrivateRoute>
                  <ParamedicalNonMedical />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.osce_1}
              element={
                <PrivateRoute>
                  <Osce1 />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.osce_2}
              element={
                <PrivateRoute>
                  <Osce2 />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.basic_infrastructure}
              element={
                <PrivateRoute odk="non_medical_infrastructure">
                  <BasicInfrastructure />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.student_info}
              element={
                <PrivateRoute odk="non_medical_student_info">
                  <StudentInfo />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.facilities}
              element={
                <PrivateRoute odk="non_medical_facilities">
                  <Facilities />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.faculty_and_facilities}
              element={
                <PrivateRoute odk="non_medical_faculty_and_facilities">
                  <FacultyFacilities />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.quality_of_processes}
              element={
                <PrivateRoute odk="medical_quality_of_processes">
                  <QualityOfProcesses />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.labs}
              element={
                <PrivateRoute odk="medical_labs">
                  <Labs />
                </PrivateRoute>
              }
            />
            {/* <Route
              path={ROUTE_MAP.osce_unoccupied_beds}
              element={
                <PrivateRoute odk="osce_unoccupied_beds">
                  <UnoccupiedBeds />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.vital_signs}
              element={
                <PrivateRoute odk="vital-signs">
                  <VitalSigns />
                </PrivateRoute>
              }
            /> */}
            <Route
              path={`${ROUTE_MAP.osceForm_param_osceName}:osceName`}
              element={
                <PrivateRoute>
                  <GenericOsceForm />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTE_MAP.admin}
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route path={ROUTE_MAP.root_star} element={<Home />} />
          </Routes>
        </BrowserRouter>
      </StateContext.Provider>
    </div>
  );
}

export default App;
