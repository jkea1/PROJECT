//1. 전체상품페이지, 로그인페이지, 상품상세페이지 ~ 페이지가 여러개일경우 react에서 react-router을 사용한다. 설치해야 한다. 
//1-1 네비게이션 바 : 페이지가 바껴도 상단에 그대로 있다. 
//2. 전체 상품페이지: 전체상품 볼 수 있다. 
//3. 로그인 버튼을 누르면 로그인 페이지가 보인다. 
//4. 상품디테일을 눌렀으나, 로그인인 안돼 있을 경우에는 로그인 페이지가 먼저 나온다. 
//5. 로그인이 돼 있을 경우에는 상품 디테일 페이지를 볼 수 있다. 
//6. 로그아웃 버튼을 클릭하면 로그아웃이 된다. 
//7. 로그아웃이 되면 상품 디테일 페이지를 볼수 없다. 다시 로그인페이지가 보인다. 
//8. 로그인을 하면 로그아웃이 보이고 로그아웃을 하면 로그인이 보인다. 
//9. 삼품을 검색할 수 있다. 
import { useState } from 'react';
import './App.css';
import { Routes, Route} from "react-router-dom";
import ProductAll from './page/ProductAll';
import ProductDetail from './page/ProductDetail';
import Login from './page/Login';
import Navbar from './component.js/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import PrivateRoute from './route/PrivateRoute';


function App() {
  /* 로그인한 유저인지 아닌지를 구분하기 위해 state를 만든다. false면 로그인이 안됐다. true면 로그인 된것이다. */
  /* 로그인 버튼을 클릭하면 authenticate의 값이 true로 바뀌어야 한다. 버튼을 눌렀을때 event를 만들어줘야 한다.  */
  /* authenticate 값을 바꾸기 위해서 setAuthenticate 함수를 써야 하는데 이 함수를 당연히 Login 컴포넌트에서 사용해 줘야한다.  */
  /* 그러기 위해서는 setAuthenticate를 props로 보내버리면 된다. */
  const[authenticate, setAuthenticate] = useState(false); 
  useEffect(() => {
    console.log("Aaaa : ", authenticate);
  },[authenticate]); /* authenticate 값이 바뀔때 마다 useEffect 가 실행된다. */

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ProductAll/>} />
        <Route path="/login" element={<Login setAuthenticate={setAuthenticate}/>} /> {/* 함수도 props로 보내줄 수 있다. 그러면 Login 함수(컴포넌트)는 props로 setAuthenticate를 받아 볼수 있다. */}
        <Route path="/product/:id" element={<PrivateRoute authenticate={authenticate}/>} /> {/* 보호해 줘야 하는 페이지이다. */}
      </Routes>
    </div>
  );
}

export default App;
