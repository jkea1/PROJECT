import React, { Component, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../image/logo.png';
import '../css/profile.css';
import ESTJ1 from '../image/profile/estj말포이.jpg';
import ESTJ2 from '../image/profile/estj헤르미온느.jpg';
import ESTJ3 from '../image/profile/estj3.jpg';
import ESTJ4 from '../image/profile/estj4.jpg';
import ESTP1 from '../image/profile/estp심슨.jpg';
import ESTP2 from '../image/profile/estp.jpg';
import ESTP3 from '../image/profile/estp3.jpg';
import ESTP4 from '../image/profile/estp4.jpg';
import ESFJ1 from '../image/profile/esfj미니.jpg';
import ESFJ2 from '../image/profile/esfj우디.jpg';
import ESFJ3 from '../image/profile/esfj해리포터.jpg';
import ESFJ4 from '../image/profile/esfj4.jpg';
import ESFP1 from '../image/profile/esfp.jpg';
import ESFP2 from '../image/profile/esfp심바.jpg';
import ESFP3 from '../image/profile/esfp풍선.jpg';
import ESFP4 from '../image/profile/esfp와인.jpg';
import ENTJ1 from '../image/profile/entj심슨아저씨.jpg';
import ENTJ2 from '../image/profile/entj우르슬라.jpg';
import ENTJ3 from '../image/profile/entj3.jpg';
import ENTJ4 from '../image/profile/entj4.jpg';
import ENTP1 from '../image/profile/entp데드풀.jpg';
import ENTP2 from '../image/profile/entp아이언맨.jpg';
import ENTP3 from '../image/profile/entp.jpg';
import ENTP4 from '../image/profile/entp4.jpg';
import ENFJ1 from '../image/profile/enfj주디.jpg';
import ENFJ2 from '../image/profile/enfj2.jpg';
import ENFJ3 from '../image/profile/enfj3.jpg';
import ENFJ4 from '../image/profile/enfj4.jpg';
import ENFP1 from '../image/profile/enfp피터.jpg';
import ENFP2 from '../image/profile/enfp2.jpg';
import ENFP3 from '../image/profile/enfp3.jpg';
import ENFP4 from '../image/profile/enfp4.jpg';
import ISTJ1 from '../image/profile/istj.jpg';
import ISTJ2 from '../image/profile/istj1.jpg';
import ISTJ3 from '../image/profile/istj3.jpg';
import ISTJ4 from '../image/profile/istj4.jpg';
import ISTP1 from '../image/profile/istp도날드덕.jpg';
import ISTP2 from '../image/profile/istp스파이더맨.jpg';
import ISTP3 from '../image/profile/istp3.jpg';
import ISTP4 from '../image/profile/istp4.jpg';
import ISFJ1 from '../image/profile/isfj그루트.jpg';
import ISFJ2 from '../image/profile/isfj캡틴아메리카.jpg';
import ISFJ3 from '../image/profile/isfj3.jpg';
import ISFJ4 from '../image/profile/isfj.jpg';
import ISFP1 from '../image/profile/isfp.jpg';
import ISFP2 from '../image/profile/isfp조커.jpg';
import ISFP3 from '../image/profile/isfp헐크.jpg';
import ISFP4 from '../image/profile/isfp4.jpg';
import INTJ1 from '../image/profile/intj베트맨.jpg';
import INTJ2 from '../image/profile/intj타노스.jpg';
import INTJ3 from '../image/profile/intj3.jpg';
import INTJ4 from '../image/profile/intj4.jpg';
import INTP1 from '../image/profile/intp.jpg';
import INTP2 from '../image/profile/intp뚱이.jpg';
import INTP3 from '../image/profile/intp3.jpg';
import INTP4 from '../image/profile/intp4.jpg';
import INFJ1 from '../image/profile/infj덤블도어.jpg';
import INFJ2 from '../image/profile/infj2.jpg';
import INFJ3 from '../image/profile/infj3.jpg';
import INFJ4 from '../image/profile/infj4.jpg';
import INFP1 from '../image/profile/infp.jpg';
import INFP2 from '../image/profile/infp도비.jpg';
import INFP3 from '../image/profile/infp미니언즈.jpg';
import INFP4 from '../image/profile/infp4.jpg';


//변수명을 넘겨줘야 하는게 아니라 url 을 넘겨줘야 하는데.. 
const ProfileSelect = () => {
    const dispatch = useDispatch();
    const chooseProfileImg = (profileImg, allProfileImg) => (
        dispatch({
            type: "CHOOSE_PROFILE_IMG",
            profileImg : profileImg
        })
    );
    /* const showAllProfileImg = (allProfileImg) => (
        dispatch({
            type: "SHOW_ALL_PROFILE_IMG",
            allProfileImg : {allProfileImg},
        })
    ); */

    /* const profileImg = [
        {mbti: ESFP, }
    ] */
    const mbti = useSelector((state) => state.mbti);
    console.log(mbti);
    const mbtiProfileImg = { 
        ESTJ : [ESTJ1, ESTJ2, ESTJ3, ESTJ4],
        ESTP : [ESTP1, ESTP2, ESTP3, ESTP4],
        ESFJ : [ESFJ1, ESFJ2, ESFJ3, ESFJ4],
        ESFP : [ESFP1, ESFP2, ESFP3, ESFP4],
        ENTJ : [ENTJ1, ENTJ2, ENTJ3, ENTJ4],
        ENTP : [ENTP1, ENTP2, ENTP3, ENTP4],
        ENFJ : [ENFJ1, ENFJ2, ENFJ3, ENFJ4],
        ENFP : [ENFP1, ENFP2, ENFP3, ENFP4],
        ISTJ : [ISTJ1, ISTJ2, ISTJ3, ISTJ4],
        ISTP : [ISTP1, ISTP2, ISTP3, ISTP4],
        ISFJ : [ISFJ1, ISFJ2, ISFJ3, ISFJ4],
        ISFP : [ISFP1, ISFP2, ISFP3, ISFP4],
        INTJ : [INTJ1, INTJ2, INTJ3, INTJ4],
        INTP : [INTP1, INTP2, INTP3, INTP4],
        INFJ : [INFJ1, INFJ2, INFJ3, INFJ4],
        INFP : [INFP1, INFP2, INFP3, INFP4],
    }
    
    const ESFP = {ESFP1, ESFP2, ESFP3, ESFP4};
    const INTJ = {INTJ1, INTJ2, INTJ3, INTJ4};
    const mbtiArray = Array.from({length:4}, (v, i) => i );
    console.log(ESFP);
    console.log("mbtiArray :",mbtiArray);

    const navigate = useNavigate();
    const goToResearchMovie = () => {
        navigate('/Research');
    };
    
    return(
        <div className='profile_wrapper'>
            <div className='profile_title'>
                <img src={logo} className='logo' alt='logo' />
                    <div className='subtitle_profile'>Choose your profile image</div>
                    <div className='mbti'>{mbti}</div>
            </div>        
            <div className='profile_image'>
                <div className='mbti_select_icon'>
                    {mbtiArray.map((profileImg) => (
                        <img 
                        className='mbti_image' 
                        onClick= { (profileImg) => {
                            chooseProfileImg(profileImg.target.src); 
                            goToResearchMovie();
                            console.log('확인:', mbtiProfileImg[mbti]);
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

export default ProfileSelect;
/* src={esfp[0]} */