import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../css/ProfileModal.css';
/* import {Col, Row, Container} from 'react-bootstrap'; */
import MbtiDropdown from './Dropdown';
import ProfileLikeMovieList from './ProfileLikeMovieList';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileModal() {
    const navigate = useNavigate();
    const gotoProfileSelect = () => {
        navigate('/ProfileImgChange');
    }
    /* const mbti = useSelector((state) => state.mbti); */
    const profileImg = useSelector((state) => (state.profileImg));
    console.log("이거:",profileImg);
   /*  const allProfileImg = useSelector((state) => (state.allProfileImg)); */
    console.log("프로필모달", profileImg);
    const [show, setShow] = useState(false);

    return (
        <>
            <Button onClick={() => {setShow(true)}}>
                <img 
                className="homeProfileImg" 
                src={profileImg} 
                alt="홈프로필이미지"
                />
            </Button>

            <Modal
                className="ProfileModal"
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton className="modalHeader">
                    <Modal.Title id="example-custom-modal-styling-title" className="modalTitle">
                        Profile Setting
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="profileModal_main">
                    <div className="profileDetail">
                        <div>
                            <img className="profileImg" src={profileImg} alt="프로필이미지" onClick= {gotoProfileSelect}/>
                        </div>
                        <div className="nameAndMbti">
                            <div>Name : 진경</div>
                            {/* <div>MBTI : ENTJ</div> */}
                            <MbtiDropdown /* changedMbti={changedMbti} setChangedMbti={setChangedMbti} *//>
                        </div>
                    </div>
                    <div className="userLikeMovie">
                        <h3>좋아요 누른 영화</h3>
                        <ProfileLikeMovieList />
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

/* render(<ProfileModal/>); */
