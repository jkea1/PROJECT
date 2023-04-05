import React, { Component, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../image/logo.png';
import '../css/profile.css';
import ESFP1 from '../image/profile/1.jpeg';
import ESFP2 from '../image/profile/2.jpeg';
import ESFP3 from '../image/profile/3.jpeg';
import ESFP4 from '../image/profile/4.png';
import INTJ1 from '../image/profile/a.jpeg';
import INTJ2 from '../image/profile/b.jpeg';
import INTJ3 from '../image/profile/c.png';
import INTJ4 from '../image/profile/d.png';

const ProfileChange = () => {
    const dispatch = useDispatch();
    const chooseProfileImg = (profileImg, allProfileImg) => (
        dispatch({
            type: "CHOOSE_PROFILE_IMG",
            profileImg : profileImg
        })
    );

    const mbti = useSelector((state) => state.mbti);

    const ESFP = {ESFP1, ESFP2, ESFP3, ESFP4};
    const INTJ = {INTJ1, INTJ2, INTJ3, INTJ4};
    const mbtiProfileImg = {
        ESFP : [ESFP1, ESFP2, ESFP3, ESFP4],
        INTJ : [INTJ1, INTJ2, INTJ3, INTJ],
    }
    
    const mbtiArray = Array.from({length:4}, (v, i) => i );
    console.log(ESFP);
    console.log("mbtiArray :",mbtiArray);

    const navigate = useNavigate();
    const goToHomePage = () => {
        navigate('/');
    };
    
    return(
        <div className='profile_wrapper'>
            <div className='profile_title'>
                <img src={logo} className='logo' alt='logo' />
                    <div className='subtitle_profile'>Change your profile image</div>
                    <div className='mbti'>{mbti}</div>
            </div>        
            <div className='profile_image'>
                <div className='mbti_select_icon'>
                    {mbtiArray.map((profileImg) => (
                        <img 
                        className='mbti_image' 
                        onClick= { (profileImg) => {
                            chooseProfileImg(profileImg.target.src); 
                            goToHomePage();
                            console.log('뭐지:', mbtiProfileImg[mbti]);
                            console.log("프로필이미지src찾자", profileImg);
                        }} 
                        src={mbtiProfileImg[mbti][profileImg]}
                        />
                    ))}
                </div>
            </div>    
        </div>      
    )
}

export default ProfileChange;