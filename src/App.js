import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './App.css';
import { createContext, useState } from "react";
import LoginMedical from "./pages/LoginMedical";
import MedicalAssessor from "./pages/MedicalAssessor";
import MedicalAssessments from "./pages/MedicalAssessments";
import UpcomingMedicalAssessments from "./pages/UpcomingMedicalAssessments";
import Form from "./pages/Form";

export const StateContext = createContext();

function App() {
  const [state, setState] = useState();
  return (
    <div className="App">
      <StateContext.Provider value={{ state, setState }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login-medical" element={<LoginMedical />} />
            <Route path="/welcome-medical-assessor" element={<MedicalAssessor />} />
            <Route path="/medical-assessments" element={<MedicalAssessments />} />
            <Route path="/upcoming-medical-assessments" element={<UpcomingMedicalAssessments />} />
            <Route path="/form" element={<Form />} />
          </Routes>
        </BrowserRouter>
      </StateContext.Provider>
    </div>
  );
}

export default App;
