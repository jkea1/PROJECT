import React from 'react'
import './App.css';
import { Routes, Route} from "react-router-dom";
import HomePage from './page/home';
import Intro from './page/intro';
import Login from './page/login';
import MbtiPage from './page/mbti';
import ProfileSelect from './page/profile';
import Research from './page/research';
import ProfileModal from './component/ProfileModal';
import ProfileChange from './page/profileChange';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="Intro" element={<Intro />} />
        <Route path="Login" element={<Login />} />
        <Route path="Mbti" element={<MbtiPage />} />
        <Route path="ProfileSelect" element={<ProfileSelect />} />
        <Route path="Research" element={<Research />}/>
        <Route path="ProfileDetail" element={<ProfileModal/>} />
        <Route path="ProfileImgChange" element={<ProfileChange/>} />
      </Routes>
    </div>
  );
}

export default App;
