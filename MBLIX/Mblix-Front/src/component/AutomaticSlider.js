import React from 'react';
import { useEffect, useState } from 'react';
import { useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import axios from 'axios';
import "react-multi-carousel/lib/styles.css";
import "../css/automaticSlider.css";
/* import { useRef } from 'react'; */
//map()으로 하면 오류 뜸
//타입에러 확인하기 
const AutomaticSlider = () => {
    const RandomMovie = useSelector((state) => (state.randomMovie));
    console.log("유즈셀렉터 확인", RandomMovie)
    const dispatch = useDispatch();
    const getRandomMovieData = (randomMovie) => {
        console.log(randomMovie)
        dispatch({
            type: "GET_RANDOM_MOVIE_DATA", 
            randomMovie: [
                randomMovie[0].poster_url, 
                randomMovie[1].poster_url,
                randomMovie[2].poster_url,
                randomMovie[3].poster_url,
                randomMovie[4].poster_url,
                randomMovie[5].poster_url, 
                randomMovie[6].poster_url,
                randomMovie[7].poster_url,
                randomMovie[8].poster_url,
                randomMovie[9].poster_url,
                randomMovie[10].poster_url, 
                randomMovie[11].poster_url,
                randomMovie[12].poster_url,
                randomMovie[13].poster_url,
                randomMovie[14].poster_url,
                randomMovie[15].poster_url, 
                randomMovie[16].poster_url,
                randomMovie[17].poster_url,
                randomMovie[18].poster_url,
                randomMovie[19].poster_url,
            ],
        });
    }

    useEffect(() => {
        const getLoginSliderMovies = async() => {
            await axios({
                url: "http://localhost:8081/movie/list",
                method: "GET",
                params: {
                "type": "random",
                "count" : "30",
                }
            }).then(res => {
                getRandomMovieData(res.data);
            })
        };
        getLoginSliderMovies();
    }, []);
    
    return (
        <div className='loginSlider'>
            <div className='loginSlideTrack'>
                <div className='loginSlide'>
                    <img src={RandomMovie[0]} height={200} width={120} alt="" />
                    <img src={RandomMovie[1]} height={200} width={120} alt="" />
                    <img src={RandomMovie[2]} height={200} width={120} alt="" />
                    <img src={RandomMovie[3]} height={200} width={120} alt="" />
                    <img src={RandomMovie[4]} height={200} width={120} alt="" />
                    <img src={RandomMovie[5]} height={200} width={120} alt="" />
                    <img src={RandomMovie[6]} height={200} width={120} alt="" />
                    <img src={RandomMovie[7]} height={200} width={120} alt="" />
                    <img src={RandomMovie[8]} height={200} width={120} alt="" />
                    <img src={RandomMovie[9]} height={200} width={120} alt="" />
                    <img src={RandomMovie[10]} height={200} width={120} alt="" />
                    <img src={RandomMovie[11]} height={200} width={120} alt="" />
                    <img src={RandomMovie[12]} height={200} width={120} alt="" />
                    <img src={RandomMovie[13]} height={200} width={120} alt="" />
                    <img src={RandomMovie[14]} height={200} width={120} alt="" />
                    <img src={RandomMovie[15]} height={200} width={120} alt="" />
                    <img src={RandomMovie[16]} height={200} width={120} alt="" />
                    <img src={RandomMovie[17]} height={200} width={120} alt="" />
                    <img src={RandomMovie[18]} height={200} width={120} alt="" />
                    <img src={RandomMovie[19]} height={200} width={120} alt="" /> 
                </div>
            </div>   
        </div>
    )    
}

export default AutomaticSlider;

/* useEffect(() => {
    const getLoginSliderMovies = async () => {
        await axios({
            url: "http://localhost:8081/movie/list",
            method: "GET",
            params: {
            "type": "random",
            "count" : "5",
            }
        }).then(res => {
            getRandomMovieData(res.data);
        })
    };
    getLoginSliderMovies();
}, []) */
/* const list = [
        {name: '기본이미지1', poster_url : "https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png"},
        {name: '기본이미지2',poster_url : "https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png"},
    ]; */
    /* console.log("로그인페이지 슬라이더 확인", list); */

    
    /* const [movieList, setMovieList] = useState('');
    const list = [
        {name: '기본이미지1', poster_url : "https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png"},
        {name: '기본이미지2',poster_url : "https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png"},
    ];
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    useEffect(() => {
        const getLoginSliderMovies = async () => {
            await axios({
                url: "http://localhost:8081/movie/list",
                method: "GET",
                params: {
                "type": "random",
                "count" : "5",
                }
            }).then(response => {
                setMovieList(response.data);
            })
        };
        getLoginSliderMovies();
        
    }, []); */

    /* const axios = require('axios');
    axios.get(`http://localhost:8081/movie/list`,{
        params: {
            "type": "random",
            "count" : "5",
        }
    })
    .then(res => 
        console.log("확인 :", res.data);
        
        ) */

{/* <div className="login_slider">
            {movieList ? (<Carousel responsive={responsive}>
                {movieList.map(movie => {
                    return (
                        <div key={movie.id}>
                            <div><img src={movie.poster_url} alt="자동슬라이더"/></div>
                        </div>
                    )
                })}    
            </Carousel>) : 'Loading'}             
        </div>    */}

        /* const [sliderMovie, setSliderMovie] = useState(null);

        useEffect(() => {
            async 선언하는 함수 따로 선언
            const fetchData = async () => {
                try {
                    const response = await axios.get(
                        'http://localhost:8081/movie/list',{
                            params: {
                                "type": "random",
                                "count" : "5",
                            }
                        }
                    );
                    setSliderMovie(response.data);
                    console.log("response 확인", response.data[0].poster_url);
                } catch (e) {
                    console.log("e 확인",e.response);
                }
            }
            fetchData();
        }, [sliderMovie]);
    
        아직 url 값이 설정되지 않았을 떄 
        if(!sliderMovie) {
            return null;
        } */