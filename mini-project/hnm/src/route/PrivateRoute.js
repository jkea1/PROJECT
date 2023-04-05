import React from 'react';
import ProductDetail from '../page/ProductDetail';
import { Navigate } from 'react-router-dom';

/* authenticate가 true면 상품디테일 페이지를 보여주고 false면 보여주지 않는다. */
/* authenticate 정보를 PrivateRoute로 불러와야 한다. */
/* authenticate가 true면 상품디테일페이지로 아니면 로그인 페이지로 이동한다. */
const PrivateRoute = ({authenticate}) => {
    return(
        authenticate == true ? <ProductDetail/> : <Navigate to="/login" />
    ) 
}

export default PrivateRoute;