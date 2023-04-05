import React, {useState} from 'react'
import { ReactDOM } from 'react';
import Navigation from '../component/Navigation';
import MovieCardList from '../component/MovieCardList';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/home.css';
import { useSelector} from 'react-redux';
import { useEffect } from 'react';
import MbtiPage from './mbti';
import AutomaticSlider from '../component/AutomaticSlider';

const HomePage = () => {
    const mbti = useSelector((state) => state.mbti);
    
    useEffect((mbti) => {
        console.log("홈 mbti 선택: ", mbti);
    }, mbti)

    return (
        <div className='home_wrapper'>
            <Navigation/>
            {/* <MbtiPage/> */}
            <h1>{mbti} 유형이 많이 찾는영화 입니다</h1>
            <div>
                <MovieCardList/>
            </div>
        </div>
    )
}

export default HomePage