import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../image/logo.png';
import '../css/intro_main.css';

const Intro = () => {
    const navigate = useNavigate();
    
    const goToLoin = () => {
        navigate('/Login')
    }
    return (
        <div className="wrapper">
        <div className="contentBox">
            <img src={logo} className="title" alt="logo" />
            <div className="notice">소개내용</div>
            <button className="loginBtn" onClick={goToLoin}>LOGIN</button>
        </div>
    </div>
    )
}

export default Intro