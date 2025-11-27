import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BacTypeResults from './components/BacTypeResults';
import CodeSearch from './components/DegreeSearch';
import ScoreCalculator from './components/ScoreCalculator';
import Mainpage from './components/accueil';
import Nav from './components/nav';
import Login from './components/login';
import ProfilePage from './components/profile';
import RegistrationForm from './components/inscription';
import UserOrientationPage from './components/userorientation';
import Footer from './components/footer';
import AuthPage from './components/auth';
import HomePage from './components/pagemain';
import UserOrientationSpecialty from './components/specialities';
import TestChart from "./components/TestChart";
import UserList from './components/userlist';
import Dashboardetudiant from './components/TestChart';
import OrientationDashboard from './components/OrientationDashboard';
import Chatbot from './components/chatbot';
import ConfirmEmailPage from './components/ConfirmEmailPage'

function App() {
  return (
    <Router>
     <Nav/>
      <Routes>
        <Route path="/" element={<Mainpage />}/>
        <Route path="/degree" element={<CodeSearch />} />
        <Route path="/bac-type" element={<BacTypeResults />} />
        <Route path="/score" element={<ScoreCalculator/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/myorientation" element={<UserOrientationPage/>}/>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route path="/dashboard" element={<Dashboardetudiant/>}/>
        <Route path="/etudiants" element={<UserList/>}/>
        <Route path="/orientation-dashboard" element={<OrientationDashboard/>}/>
        <Route path="/speciality" element={<UserOrientationSpecialty/>}/>
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          
          
      </Routes>
      <Footer/>
      <Chatbot />
    </Router>
  );
}

export default App;
