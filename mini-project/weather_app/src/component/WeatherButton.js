import React from 'react'
import { Button } from 'react-bootstrap';

const WeatherButton = ({cities, setCity}) => {
    console.log('cities',cities);
    return (
        <div>
            <Button variant="warning">Current Location</Button>
            {cities.map((item, index)=>(
                <Button 
                variant="warning"
                key={index}
                onClick={() => setCity(item)} //cities가 바뀌게 된다. 
                >{item}</Button>
                    ))} {/* citiies가 array니까 .map 사용해야 한다. 한줄로 간단하게 코드 작성 가능하다.*/}
        </div>
    )
}

export default WeatherButton;