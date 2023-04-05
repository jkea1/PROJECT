import React from 'react'

const WeatherBox = ({weather}) => { /* props라는 object안의 weather이라는 key 불어오기 , {weather}대신 props.weather 해도된다.*/
    console.log("weather", weather);
    return (
        <div className ="weather-box">
            <div>{weather?.name  }</div> {/* weather.name만하면 weather의 초기값이 null이서서 UI를 그릴때 보여줄 수 없다. 그래서 왼쪽 또는 weather && weather.name 하면된다. */}
            <h2>{weather?.main.temp}C/{weather?.main.temp*1.8+32}F</h2>
            <h3>{weather?.weather[0].description}</h3>
        </div>
    )
}

export default WeatherBox