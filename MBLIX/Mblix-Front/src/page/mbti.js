import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import '../css/mbti.css';
import logo from '../image/logo.png';
import { FaEarlybirds } from 'react-icons/fa';
import { GiMaterialsScience } from "react-icons/gi";
import { GiOldKing } from "react-icons/gi";
import { GiRevolt } from "react-icons/gi";
import { VscLaw } from "react-icons/vsc";
import { GiMountainRoad } from "react-icons/gi";
import { FaSlideshare } from 'react-icons/fa';
import { FaCocktail } from 'react-icons/fa';
import { GiSwordman } from "react-icons/gi";
import { GiHiking } from "react-icons/gi";
import { GiMagnifyingGlass } from "react-icons/gi";
import { FaTools } from 'react-icons/fa';
import { FaHandHoldingMedical } from 'react-icons/fa';
import { FaPalette } from 'react-icons/fa';
import { GiFlyingFlag } from "react-icons/gi";
import { GiCandleLight } from "react-icons/gi";

const MbtiPage = () => {
    const dispatch = useDispatch();

    const choose = (mbti) => {
        dispatch({
            type: "CHOOSE_MBTI", 
            mbti: mbti,
        });
        
    }

    const mbtiList_E = [
        {mbti : 'ESTJ', icon : <VscLaw/>}, 
        {mbti : 'ESTP', icon : <GiMountainRoad/>},
        {mbti : 'ESFJ', icon : <FaSlideshare/>},
        {mbti : 'ESFP', icon : <FaCocktail/>},
        {mbti : 'ENTJ', icon : <GiOldKing/>},
        {mbti : 'ENTP', icon : <GiRevolt/>},
        {mbti : 'ENFJ', icon : <GiSwordman/>},
        {mbti : 'ENFP', icon : <GiHiking/>},
    ];
    
    const mbtiList_I = [
        {mbti : 'ISTJ', icon : <GiMagnifyingGlass/>}, 
        {mbti : 'ISTP', icon : <FaTools/>},
        {mbti : 'ISFJ', icon : <FaHandHoldingMedical/>},
        {mbti : 'ISFP', icon : <FaPalette />},
        {mbti : 'INTJ', icon : <GiFlyingFlag/>},
        {mbti : 'INTP', icon : <GiCandleLight/>},
        {mbti : 'INFJ', icon : <FaEarlybirds/>},
        {mbti : 'INFP', icon : <GiMaterialsScience/>},
    ];
    
    const navigate = useNavigate();
    
    const goToResearchPage = () => {
        navigate('/ProfileSelect');
    }

    return (
        <div className='mbti_wrapper'>
            <div className="mbti_title">
                <img src={logo} className="mbti_logo" alt="logo" />
                <div className="subtitle_mbti">Choose your MBTI</div>
            </div>
            <div className='MBTI'>
            <div className='E'>
            {mbtiList_E.map((mbti_E) => (
                <div className='E_items' onClick= { () => {
                    choose(mbti_E.mbti);
                    /* console.log(mbti_E.mbti); */
                    goToResearchPage();}}>
                    <div className='icon'>{mbti_E.icon}</div>
                    <div className='mbti_name'>{mbti_E.mbti}</div>
                </div>
            ))}
            </div>
            <div className='I'>
                {mbtiList_I.map((mbti_I) => (
                    <div  className='I_items' onClick= { () => {
                        choose(mbti_I.mbti);
                        goToResearchPage(); 
                        console.log('mbti 확인:', mbti_I);
                        }}>
                        <div className='icon'>{mbti_I.icon}</div>
                        <div className='mbti_name'>{mbti_I.mbti}</div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
}

export default MbtiPage;