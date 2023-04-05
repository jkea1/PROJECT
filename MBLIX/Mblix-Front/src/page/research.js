import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../image/logo.png';
import { AiFillHeart } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import '../css/research.css';

//하트 클릭시 useState의 like가 true일때만 onClick시 리덕스에 정보보내기 
//likeState가 id랑 같으면 handleLikeBtn함수 실행하게 하기 
const Research = () => {
    const [likeMovieId, setLikeMovieId] = useState([]);

    const handleLikeMovieId = (id) => {
        if(likeMovieId.includes(id)){
            const newLikeMovieId = likeMovieId.filter(e => e !== id);
            setLikeMovieId(newLikeMovieId);
        } else {
            setLikeMovieId([...likeMovieId, id]);
        }
    };
    
    const dispatch = useDispatch();
    const like = (poster_url, name) => {
        dispatch({
            type: "LIKE_MOVIE_DETAIL", 
            payload: {poster_url: poster_url, name: name}
        });
    }
    
    const [researchMovieList, setResearchMovieList] = useState('');

    const navigate = useNavigate();
    const goToHomePage = () => {
        navigate('/')
    };

    const getResearchMovies = async() => {
        const response = await axios({
            url: "http://localhost:8081/movie/list",
            method: "GET",
            params: {
            "type": "random",
            "count": "5"
            }
        });
        setResearchMovieList(response.data);
    };
    
    useEffect(() => {
        getResearchMovies();
    }, []);

    /* const researchRandomPoster = []; */
    
    return (
        <div className="research_wrapper">
            <div className="research_title">
                <img src={logo} className="research_logo"  alt="logo"/>
                <div className="research_subtitle">A Research of Preference of Movie</div>
            </div>
            <div className="research_movie">
                    { researchMovieList ? researchMovieList.map((rp) => (
                        <div className="research_main" key={rp.id}>
                            <div className="research_poster"><img src={rp.poster_url} alt='poster_img'/></div>
                            <div className="research_poster_name">{rp.name}</div>
                            <div className="research_preference_like">
                                <div onClick={() => {
                                    like(rp.poster_url, rp.name);
                                    handleLikeMovieId(rp.id);
                                }}>
                                    {likeMovieId.includes(rp.id) ? <IoMdHeart/> : <IoMdHeartEmpty/>}
                                </div>
                            </div>
                        </div>
                    )) : 'Loading...'}
            </div>
            <div className="research_nextBtn_container">
                <button className="research_nextBtn" onClick={() => goToHomePage()}>SKIP</button>
            </div>
            
        </div>
    )
}

export default Research;

/* const Research = () => {
    const [researchMovieList, setResearchMovieList] = useState(null);

    const navigate = useNavigate();
    const goToHomePage = () => {
        navigate('/')
    };

    const getResearchMovies = async() => {
        const response = await axios({
            url: "http://localhost:8081/v1/movie/list",
            method: "GET",
            params: {
            "type": "random",
            "count": "5"
            }
        });
        console.log(response);
        setResearchMovieList(response.data);
    };
    
    const researchRandomPoster = [
        {img : response.data[0].poster_url, name : response.data[0].name },
        {img : '', name : '' },
        {img : '', name : '' },
        {img : '', name : '' },
        {img : '', name : '' },
    ];
    

    return (
        <div className="research_wrapper">
            <div className="research_title">
                <img src={logo} className="research_logo" alt="logo" />
                <div className="research_subtitle">A Research of Preference of Movie</div>
            </div>
            <div className="research_movie">
                    {researchRandomPoster.map((rp) => (
                        <div className= "research_main">
                            <div className="research_poster">{rp.img}</div>
                            <div className="research_poster_name">{rp.name}</div>
                            <div className="research_preference_like">
                                <div onClick={getResearchMovies}><AiFillHeart/></div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="research_nextBtn_container">
                <button className="research_nextBtn" onClick={goToHomePage}>NEXT</button>
            </div>
            
        </div>
    )
} */

