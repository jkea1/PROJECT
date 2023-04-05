// api 호출은 useEffect에서 한다. useEffect는 변수 2개를 받는다. 함수 하나와 어레이 하나. 
//여기에서 함수(getProductDetail이라는 이름으로 만들었다.)는 product디테일을 받아올 수 있는 함수여야 하다. 
import React,{useEffect, useState} from 'react';
import { Container , Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    let {id} = useParams(); /* useParams의 정보를 하나의 변수( ex)id )에 저장한다. {id} 중괄호 안에 넣고 파라미터 값을 사용 하면 된다.  */
    const [product, setProduct] = useState(null);
    const getProductDetail = async() => { /* await을 쓰면 async을 써야 한다. */
        let url = `https://my-json-server.typicode.com/jkea1/hnm/products/${id}`;  /* ${} 안에 들어갈 id 값은 어디서 받아오나? ~ url 파라미터 값으로 id를 넘겨주고 있으니 이 숫자를 읽어서 json 서버에 넘겨주면 된다. 이 숫자를 읽는 방법은 useParams 이다!  */
        // url fetch 하는 과정 눈감고 써야 한다. 
        let response = await fetch(url) ;/* url은 곧 가져오고자 하는 데이터가 있는 주소지 이고, 여기서 통신해서 response를 통해 json 형식으로 데이터를 반환하여 사용할 수 있다.  */
        let data = await response.json() ;/* data로 response의 json 값을 가져온다. */
        console.log(data);
        setProduct(data); /* getProductDetail 페이지를 호출할때 마다 data를 가지고 올 수 있게 된다.  */
    };

    useEffect(() => { /* useEffect는 리액트가 렌더링 될 때마다 특정 작업을 실행할 수 있도록 하는 Hook */
        getProductDetail()
    }, []) /* 컴포넌트가 화면에 가장 처음 렌더링 될때 한 번만 실행하고 싶을때는 배열자리에 빈 배열으 넣는다. */

    return (
        <Container>
            <Row>
                <Col className = "product-img">
                    <img src={product?.img} alt="상품이미지" /> {/* img의 소스는 Product에서 온다. */}
                </Col>
                <Col>
                    <div>{product?.title}</div>
                    <div>{product?.price}</div>
                </Col>
            </Row>
        </Container>
    )
}

export default ProductDetail