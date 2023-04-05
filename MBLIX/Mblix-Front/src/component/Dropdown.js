import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'; 
import { AiFillCaretDown } from "react-icons/ai";
import '../css/dropdown.css';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const MbtiDropdown = () => {
    const dispatch = useDispatch();
    const changeMbti = (changedMbti) => {
        dispatch({
            type: "CHANGE_MBTI", 
            mbti: changedMbti,
        });
    }
    
    const resetLikeList = () => {
        dispatch({
            type: "RESET_LIKE_LIST"
        })
    }
    const mbti = useSelector((state) => (state.mbti));
    const [changedMbti, setChangedMbti] = useState(mbti); 
    const [isActive, setIsActive] = useState(false);
    const options = ['ESTJ','ESTP','ESFJ','ESFP','ENTJ','ENTP','ENFJ','ENFP','ISTJ','ISTP','ISFJ','ISFP','INTJ','INTP','INFJ','INFP'];

    useEffect(() => {
        console.log("바뀐 mbti 확인해보자:", changedMbti)
    }, changedMbti)

    return (
        <div className="dropdown">
            <OverlayTrigger
                key='top'
                placement='top'
                overlay={
                    <Tooltip id='tooltip-top'>
                    mbti 재설정시 좋아요 누른 영화 목록이 초기화 됩니다. 
                    </Tooltip>
                }
            >
                <div className="dropdown-btn" onClick={(e) => setIsActive(!isActive)}>
                    {changedMbti}
                    <AiFillCaretDown/>
                </div>
            </OverlayTrigger>
            {/* <div className="dropdown-btn" onClick={(e) => setIsActive(!isActive)}>
                {changedMbti}
                <AiFillCaretDown/>
            </div> */}
            {isActive && (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div
                            onClick={(e) => {
                                setChangedMbti(option);
                                setIsActive(false);
                                changeMbti(option);
                                resetLikeList();
                        }}
                        className="dropdown-item"
                        >
                        {option}
                    </div>
                    ))}
                </div>
            )}
        </div>

    )
}

export default MbtiDropdown;