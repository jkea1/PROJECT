import React from 'react'

const Box = (props) => {
    console.log("props :",props);
        return (
            <div className='box'>
                <h1>{props.title}</h1>
                    <img 
                        className="item-img"
                        src = {props.item && props.item.img} /> 
                {/* react에서는 에러를 막기위해 event전까지는 userSelect 같이 null이다.
                그래서 이렇게 props.item 과 같은 가드값을 넣어줘야 한다. */}
                <h2>{props.result}</h2>
            </div>
        );
}

export default Box;