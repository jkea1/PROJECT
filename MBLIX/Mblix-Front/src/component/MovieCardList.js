import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from 'react-redux';
import MovieDetailModal from './MovieDetailModal';

const MovieCardList = () => {
    const [movieDetail, setMovieDetail] = useState('')
    const [show, setShow] = useState(false);
    const mbti = useSelector((state) => state.mbti);
    console.log("돼라", mbti);
    
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
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
    
    const [MbtiMovieList, setMbtiMovieList] = useState('');
    
    useEffect(() => {
        const getHomeMovies = async() => {
            await axios({
                url: "http://localhost:8081/movie/list",
                method: "GET",
                params: {
                "type": "normal",
                "count": "100",
                "mbti" : mbti
                }
            }).then(res => {
                setMbtiMovieList(res.data);
            })

        };
        getHomeMovies()
    }, [mbti]); //여기에  mbti 안 넣어 줬었어! 
    
    console.log("슬라이더 확인하기", typeof MbtiMovieList);
    return (
        <div className="App">
            <div style={{ position: "relative" }}>
                {MbtiMovieList ? (<Carousel responsive={responsive}>
                        {MbtiMovieList.map(movie => {
                            return (
                                <div key={movie.id}>
                                    <div>
                                        <img 
                                            src={movie.poster_url}
                                            onClick={() => {
                                                setShow(true);
                                                setMovieDetail(movie);
                                                console.log(movie);
                                            }} 
                                            alt="영화이미지"
                                        />
                                    </div>
                                    <div>{movie.name}</div>
                                </div>
                            )
                        })}    
                    </Carousel>) : 'Loading'}
            </div>
            <MovieDetailModal 
                show={show} 
                setShow={setShow}
                movie={movieDetail}
            />
        </div> 

    )
}

export default MovieCardList;
