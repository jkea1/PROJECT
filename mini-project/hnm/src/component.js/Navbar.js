 /* map 안에는 menu가 있고, 각각의 menu는 li에 들어있다.   */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const menuList = [
        '여성',
        'Divided',
        '남성',
        '신생아/유아',
        '아동',
        'h&M Home',
        'Sale',
        '지속가능성',
    ];

    const navigate = useNavigate()

    const goToLogin = () => {
        navigate("/login");
    };
    
    const search = (event) => { /* onKeyPress에서 넘겨받은 event를 가지고 이용한다.  */
        if(event.key === "Enter"){
            //입력한 검색어를 읽어와서 
            let keyword = event.target.value; //이건 외워야 겠다. event.target.value를 통해서 input으로 받은 값을 불러온다.
            //url(만)을 바꿔준다. 
            navigate(`/?q=${keyword}`) //파라미터 값이 아닌 쿼리값을 불러오는 것이기 때문에 ?q=검색어 를 불어와야 한다. 
        }
    };

    return (
        <div>
            <div>
                <div className="login-button" onClick={goToLogin}>
                    <FontAwesomeIcon icon={faUser} />
                    <div>로그인</div>
                </div>
            </div>
            <div className="nav-section">
                <img width={100} src="data:image/jpeg;base64,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" />
            </div>
            <div className="menu-area">
                <ul className="menu-list">
                    {menuList.map((menu) => (<li>{menu}</li>))}  
                </ul>
                <div className='search-box'>
                    <FontAwesomeIcon icon ={faSearch}/>
                    <input type="text" onKeyPress={(event) => search(event)}/> {/* 텍스트를 입력하는 등 key를 누르면 함수 search가 실행된다. & onKeyPress와 같은 모든 이벤트리스너는 event를 매개변수로 넘겨준다. 이 event를 함수 search가 받게 한다. */}
                </div>
            </div>
        </div>
    )
}

export default Navbar