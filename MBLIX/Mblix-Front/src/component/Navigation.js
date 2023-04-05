import React from 'react';
import '../App.css';
import '../css/home.css';
import '../css/navigation.css';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import ProfileModal from './ProfileModal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';


const Navigation = () => {
    const mbti = useSelector((state) => state.mbti);
    console.log(mbti);
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container className="home_navigation">
                <div>
                    <Form className="home_search">
                        <Form.Control
                            type="search"
                            placeholder="Movie name or Actor"
                            className="me-2"
                            aria-label="Search"
                    />
                    <Button variant="outline-success" className="search_button_icon">
                        <FaSearch/>
                    </Button>
                    </Form>
                </div>
                
                <div className="home_header_profile">
                    <div classname="home_header_mbti">{mbti}</div>
                    <div classname="home_header_name">Name</div>
                    <div className="home_header_profile_img_container">
                        <ProfileModal/>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
}

export default Navigation;