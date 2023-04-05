import React from 'react';
import { Container , Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from 'react';

const ProfileLikeMovieCard = ({index}) => {
    const likemovieList = useSelector((state) => (state.likemovieList) )
    const dispatch = useDispatch();
    const deleteLikeMovie = (deleteMovie) => {
        dispatch({
            type : "DELETE_LIKE_MOVIE",
            deleteMovie : deleteMovie,
        })
    };

    const getLikeInfo_url = useSelector((state) => (state.likemovieList[index].poster_url));
    const getLikeInfo_name = useSelector((state) => (state.likemovieList[index].name));

    console.log("지우기능테스트:", {getLikeInfo_name});
    
    useEffect(() => {
        console.log("유즈이펙 비동기 확인: ",getLikeInfo_name);
    }, getLikeInfo_name);

    useEffect(() => {
        console.log("유즈이펙 likemovieList 확인");
    }, [likemovieList]);
    
    return(
        <div className="card" >
            <img src={getLikeInfo_url} /> 
            <div>{getLikeInfo_name}</div>
            <div>
                <AiOutlineClose onClick = {() => {
                    console.log("이름넘어왔는지 재확인", getLikeInfo_name);    
                    deleteLikeMovie(getLikeInfo_name);
                }}
                />
                </div>
        </div>
    )
}

export default ProfileLikeMovieCard;