import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import logo from '../image/logo.png'
import '../css/login.css';
/* import '../css/intro_main.css'; */
import AutomaticSlider from '../component/AutomaticSlider';


const LoginAndJoin = () => {

    return (
        <div className="login_wrapper">
            <div className="login_contentBox">
                <img src={logo} className="login_title" alt="logo" />
                <div className="centerBox">
                    <div>로그인1</div>
                    <div>로그인2</div>
                    <div>로그인3</div>
                </div>
                <AutomaticSlider className="loginPageAutoSlider"/>
            </div>
        </div>
    )
}



export default LoginAndJoin