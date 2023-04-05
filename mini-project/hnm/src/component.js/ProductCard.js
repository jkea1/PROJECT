import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({item}) => { /* item이라는 props는 productAll.js에서 ProductCard 컨테이너에서 추가하였다.  */
    const navigate = useNavigate();
    const showDetail = () => {
        navigate(`/product/${item.id}`) /* 동적으로 들어갈 값이 있을 경우에는 벡틱과 ${}을 사용해 준다.  */
    }

    return (
        <div className="card" onClick={showDetail}>
            <img width={264} height={396} src={item?.img} /> {/* item? item이 있는지 확안하고 있다면 item의 img를 불러오는 느낌이다. */}
            <div>Conscious Choice</div>
            <div>{item?.title}</div>
            <div>₩{item?.price}</div>
            <div>{item?.new == true ? "신세품" : ""}</div>
        </div>
    )
}

export default ProductCard;