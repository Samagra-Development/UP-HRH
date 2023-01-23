import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import './App.css';
import { createContext, useState, useContext } from "react";
import LoginMedical from "./pages/LoginMedical";
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
import UnoccupiedBeds from "./pages/forms/UnoccupiedBeds";
import VitalSigns from "./pages/forms/VitalSigns";

export const StateContext = createContext();

const PrivateRoute = ({ children, odk }) => {
  const { state } = useContext(StateContext);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isAuthenticated = userData ? true : false;
  // console.log(state);

  if (odk && isAuthenticated) {
    if (state && state.userData && state.userData.filledForms && !state.userData.filledForms[odk])
      return children;
    else
      return <Navigate to="/" />
  }
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const [state, setState] = useState();
  return (
    <div className="App">
      <StateContext.Provider value={{ state, setState }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginMedical />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome-medical-assessor" element={<PrivateRoute><MedicalAssessor /></PrivateRoute>} />
            <Route path="/medical-assessments" element={<PrivateRoute><MedicalAssessments /></PrivateRoute>} />
            <Route path="/upcoming-medical-assessments" element={<PrivateRoute><UpcomingMedicalAssessments /></PrivateRoute>} />
            <Route path="/form" element={<PrivateRoute><Form /></PrivateRoute>} />
            <Route path="/capture-location" element={<PrivateRoute><CaptureLocation /></PrivateRoute>} />
            <Route path="/medical-assessment-options" element={<PrivateRoute><MedicalAssessmentsOptions /></PrivateRoute>} />
            <Route path="/nursing-options" element={<PrivateRoute><NursingOptions /></PrivateRoute>} />
            <Route path="/paramedical-options" element={<PrivateRoute><ParamedicalOptions /></PrivateRoute>} />
            <Route path="/osce-options" element={<PrivateRoute><OsceOptions /></PrivateRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/nursing" element={<PrivateRoute><Nursing /></PrivateRoute>} />
            <Route path="/paramedical" element={<PrivateRoute><Paramedical /></PrivateRoute>} />
            <Route path="/osce-1" element={<PrivateRoute><Osce1 /></PrivateRoute>} />
            <Route path="/osce-2" element={<PrivateRoute><Osce2 /></PrivateRoute>} />
            <Route path="/basic-infrastructure" element={<PrivateRoute odk="non_medical_infrastructure"><BasicInfrastructure /></PrivateRoute>} />
            <Route path="/student-info" element={<PrivateRoute odk="non_medical_student_info"><StudentInfo /></PrivateRoute>} />
            <Route path="/facilities" element={<PrivateRoute odk="non_medical_facilities"><Facilities /></PrivateRoute>} />
            <Route path="/faculty-&-facilities" element={<PrivateRoute odk="non_medical_faculty_and_facilities"><FacultyFacilities /></PrivateRoute>} />
            <Route path="/quality-of-processes" element={<PrivateRoute odk="medical_quality_of_processes"><QualityOfProcesses /></PrivateRoute>} />
            <Route path="/labs" element={<PrivateRoute odk="medical_labs"><Labs /></PrivateRoute>} />
            <Route path="/osce-unoccupied-beds" element={<PrivateRoute odk="osce_unoccupied_beds"><UnoccupiedBeds /></PrivateRoute>} />
            <Route path="/vital-signs" element={<PrivateRoute odk="vital-signs"><VitalSigns /></PrivateRoute>} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </StateContext.Provider >
    </div >
  );
}

export default App;