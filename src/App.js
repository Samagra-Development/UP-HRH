import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import './App.css';
import { createContext, useState } from "react";
import LoginMedical from "./pages/LoginMedical";
import MedicalAssessor from "./pages/MedicalAssessor";
import MedicalAssessments from "./pages/MedicalAssessments";
import UpcomingMedicalAssessments from "./pages/UpcomingMedicalAssessments";
import Form from "./pages/Form";
import CaptureLocation from "./pages/CaptureLocation";
import MedicalAssessmentsOptions from "./pages/MedicalAssessmentsOptions";
import ForgotPassword from "./pages/ForgotPassword";
import Nursing from "./pages/Nursing";
import Paramedical from "./pages/Paramedical";
import Osce1 from "./pages/Osce1";
import Osce2 from "./pages/Osce2";
import Register from "./pages/Register";

export const StateContext = createContext();

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userData") ? true : false;
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/nursing" element={<PrivateRoute><Nursing /></PrivateRoute>} />
            <Route path="/paramedical" element={<PrivateRoute><Paramedical /></PrivateRoute>} />
            <Route path="/osce-1" element={<PrivateRoute><Osce1 /></PrivateRoute>} />
            <Route path="/osce-2" element={<PrivateRoute><Osce2 /></PrivateRoute>} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </StateContext.Provider >
    </div >
  );
}

export default App;
