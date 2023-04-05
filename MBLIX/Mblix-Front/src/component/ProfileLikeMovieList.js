import React from 'react'
import ProfileLikeMovieCard from './ProfileLikeMovieCard';
import {Container, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const ProfileLikeMovieList = () => {
    const LikeMovieList = useSelector((state) => state.likemovieList);
    let render = LikeMovieList.map((e, index) => { 
        return (
            <Col lg={3}>
                <ProfileLikeMovieCard index={index}/> 
            </Col>
        )
    });

    useEffect(() => {
        render = LikeMovieList.map((e, index) => { 
            return (
                <Col lg={3}>
                    <ProfileLikeMovieCard index={index}/> 
                </Col>
            )
        });
    }, LikeMovieList)

    return (
        <div>
            <Container> 
                <Row>
                    {render}
                </Row>
            </Container> 
        </div>
    )
}

export default ProfileLikeMovieList