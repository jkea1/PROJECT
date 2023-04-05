import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import {Container, Row, Col } from "react-bootstrap";
import { GrLike, GrDislike } from "react-icons/gr";
import { AiTwotoneLike } from "react-icons/ai";
import '../css/movieDetailModal.css';

function MovieDetailModal({show, setShow, movie}) {
    const [like, setLike] = useState(false);
    const handleLikeBtn = () => {
        setLike(!like);
    };

    
    const [MbtiRanking, setMbtiRanking] = useState('')
    useEffect(() => {
        const id = movie.id;
        const getHomeMovies = async() => {
            await axios({
                url: `http://localhost:8081/movie/search/id/${id}`,
                method: "GET",
            }).then(res => {
                setMbtiRanking(res.data);
            })
        };
        getHomeMovies()
    }, [movie]); 

    return (
        <>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-95w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    이 영화 어떠세요?
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>
                            <img src={movie.poster_url} alt="movie_detail_modal" />
                        </div>
                        <div>
                            {movie.name}
                        </div>
                        <div>
                            <Row>
                                <Col>{movie.genre}</Col>
                                <Col>{movie.prod_year}</Col>
                                <Col>{movie.watch_grade}</Col>
                                <Col>{movie.show_time}분</Col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <Col>1 {MbtiRanking[0]}</Col>
                                <Col>2 {MbtiRanking[1]}</Col>
                                <Col>3 {MbtiRanking[2]}</Col>
                            </Row>
                        </div>
                        <div>
                            <Row>감독 {movie.director}</Row>
                            <Row>출연배우 {movie.actors}</Row>
                        </div>
                        <div>
                            <Col><AiTwotoneLike className={"likeBtn"+(like ? "Active" : "")} onClick={handleLikeBtn}/></Col>
                        </div>
                    </div>
                    
                    
                </Modal.Body>
            </Modal>
        </>
    );
}

export default MovieDetailModal;