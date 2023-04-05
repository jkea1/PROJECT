import { useEffect,useState } from 'react';
import './App.css';
import WeatherBox from './component/WeatherBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherButton from './component/WeatherButton';
import ClipLoader from "react-spinners/ClipLoader";


//1. 앱이 실행되자마자 현재위치기반의 날씨가 보인다. 
//  ~ useEffect 사용하기 
//2. 현재 도씨, 섭씨 화씨 날씨 상태 
//3. 버튼 5개 (1개는 현재 위치, 4개는 다른 도시)
//4. 도시버튼을 클릭할때 마다 도시별 날씨가 나온다. 버튼 누를때 색깔 바뀜 -> 과제
//5. 현재 위치 기반 날씨 버튼을 클릭하면 다시 현재 위치 기반날씨로 돌아 온다. ->과제
//6. 데이터를 들고오는 동안 로딩 스피너가 돈다.(로딩 스티너가 돌 동안에는 다른 UI는 보이지 않는다.)(사이트정보 읽어보면 loading이라는 props가 true여야 로딩이 보인다. )

//App이 필요한 함수를 모두 가지고 있고, App은 단지 보내주기만 한다. 함수도 보내줄수 있다. 
//UseEffect는 1. UI가 처음에 그려지고나서 실행된다. 2. 배열에 있는 state 값이 바뀔때 마다 호출!

function App() {
  const [weather, setWeather]=useState(null);
  const [city, setCity]=useState('');
  const [loading, setLoading] = useState(true); //
  const cities = ['paris','new york','tokyo','seoul']; //굳이 array로 만들어서 하는 이유: 사용자의 요구가 늘수 있다. 자주쓰는 건 모아 두는것이 좋다. 
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position)=> {
      let lat = position.coords.latitude
      let lon = position.coords.longitude
      getWeatherByCurrentLocation(lat, lon) 
    });
  };

  const getWeatherByCurrentLocation = async(lat, lon) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=52605fac026991fbf3501b07f9ad1dbd&units=metric`; //다이나믹 value에는 $ 넣어준다. 
    setLoading(true);
    let response = await fetch(url); //url를 호출해서 가져올때까지 기다려주세요. & await쓰려면 async 함수여야 한다. 
    let data = await response.json(); //response를 통해서 json을 추출하는 것을 기달려 달라. api는 대부분 json이다.
    setWeather(data);
    setLoading(false);
  };

  const getWeatherByCity = async() => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=52605fac026991fbf3501b07f9ad1dbd&units=metric`;
    setLoading(true);
    let response = await fetch(url);
    let data = await response.json();
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    if(city==""){
      getCurrentLocation();
    }else{
      getWeatherByCity();
    }
  }, [city]);
  //array 안에 아무것도 넣지 않으면 render를 하고 나서 실행을 시킨다. componentdidmount()처럼 행동한다. 
  //city state를 주시하고 있다가 city가 바뀌면  위의 console.log가 실행된다. 
  

  return (
    <div> {/* 삼항연산식을 이용해서 UI가 보여지는 것을 control 한다. */}
      {loading ? (
        <div className="container"> {/* css로 가운데 정렬 맞춰주기 위해서 */}
          <ClipLoader color="#f88c6b" loading={loading} size={150} />
        </div> 
      ) : (
        <div className="container">
          <WeatherBox weather={weather} /> 
          <WeatherButton cities={cities} setCity={setCity}/>
        </div>
      )};
    </div>
  );
}

export default App;
