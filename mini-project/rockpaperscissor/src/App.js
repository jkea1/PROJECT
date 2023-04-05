import { useState } from 'react';
import './App.css';
import Box from './component/Box';
//1. 박스 2개 (타이틀, 사진, 결과)
//2. 가위 바위 보 버튼
//3. 버튼을 클릭하면 클릭한 값이 박스에 보임
//4. 컴퓨터는 랜점하게 아이쳄 선택이 된다. 
//5. 3,4 의 결과를 가지고 누가 이겼는지 승패를 따진다. 
//6. 승패 결과에 따라 테두리 색이 바뀐다. (이기면-초록, 지면-빨강 비기면-검)
//play() 괄호안에 들어가는 것은 매개변수이다. 그걸 userChoice가 받는다. 
//함수() 해버리면 바로 실행 돼 버린다. 콜백함수처럼 함수안에 원하는 함수를 넣어줘야 한다. () => 함수() 해줘야 한다.  

const choice = { //바뀌지 말라고 choice를 사용했다. 
  rock: { //key 값
    name: "Rock",
    img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEBAVEBAQEBAQEBEQEBAQGBAQFhEWFhcVFRUYHSkgGBsmGxcYITEhJiksLi46Fx8zODMsNyotLisBCgoKDg0OGhAQGi0lHR0rLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tKy0tLS0rLS0tLS0rLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABAECAwUGBwj/xAA3EAACAgECBAQFAAoCAwEAAAABAgARAxIhBDFBUQUTImEGMnGBkQcjQlJiobHB0fCC4TOi8RT/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAgED/8QAGxEBAQEBAQEBAQAAAAAAAAAAAAECETEhEkH/2gAMAwEAAhEDEQA/APboiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIluTIqi2YKBzLEAfkwLolAwIsGweRG9xArEtuQj4vw9sPNBKi2ChmIH0AuBPiQeD8VwZWOPHkByKoc4zswUmr0ner2uTbgViUuVgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAmm8XzY2Yq7UMdftFQWZSALH1/Im5nOeJ4wuhmo6GfK7k7isbKCAPmarAHsT0Fxu/FZc/8AEfEtwwRcOQ4BmLMGXMUZcmkXeP5WAH4JveYuG8UzOpObM2QBdRLnGl0dtOkEAGv/AGHbfF41lwuVGjXkBYhs643DAjbSd6GroD05yGOIAxFVKYwWJGRUxghmOwU6eh3r+LoJz66Kcf8AEg0h0yZsrOLrzCwQfLT47pTdbjqd+01Q+JHORUw7EtoUv6SpK7lmJ9WwP85IdGw42THQw2Xcr+qLLtQLKQaAB39z2nP8VkOJxu2bC7aHQqzFNW2pcjgmhzFc+uxkdvVc+JS8Rmx5g3n5MWbG+jHkLG1XpqB3Km9+fXYgz0XwX48DN5XGYvIYKP1qsWV2uidNWo67WPeebcYmrGgBL7A4cu9m7vGSTtzArpXWQzmdFVGXWg3CvaldiCQTuDvuD2m51Z4y5lfQ+DMrqrowdGAKspDBgeoI5zIDPF/h7xh8SLk4fI58q9WNmZQf3iyatD3y6HsbE7jwn9IHC5ds4bhTt68oPls1WQH6fcCds7lc7ix2QiWI4IBBsEAgjqDyMvloIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIFGOx6Tzz4l41suXy12TGCDfqGS1Nkj92rHP8AxO/4gjS1mhpO56bTzPxLxL9axAuwhAAO9KLTfdeTH7fec9rygrju8TDUAVZVIa1I5hdX0B7jeZeGNDYgoKIqvTtQuv8AdpIZVyKWQhle9lOoA37jY2Lo0Rci4cGRGYimumPrrW24IIIJG1b3IUuTGWUlgBqHQ6uXUtMHF+FasYCbFGDLzsKGBKm9iBuPYUJPVxswBB1EMvLfYG/cd5KKkHGFBI3JPUVW/Y8z+PtFhK0K8OiIUZW8s3kyncHE2wDIB1B6j3ml4/h2TRlyL5thg2Ox6/VVlgwAYd+o08unccfw2w07FbDaANwWJKduVmj13E0CsSTj+VFJVAQpobbgHuD/AEkcV1yXE50sHEVxKzKr48rG1bqAT0Jo7+/2k8BjyYdSf+RHAZbphpHIMQaYb8/ebrieAwMWXSjgIxsZHFbUDpHLrtVbyJwWJwQyaCjKihSflK0GU/8ALeiQd+p3mleg/o18fbMr8LlrViXXh574QdOncnZTQB+vad0J5B8KcWvD8SuUrVagw9OsYsgsqb3b1AHpy/PrqmdsXsctT6viUErLSREQEREBERAREQEREBERAREQEREBERAREQEREBERA1vxDk08LmayNKEkjnpHOvep57wZxEEH5hjZcb8tLaaHPsCRyNXO++KMxThslAEsNIBF89uV7gc69p5woA3Jr5auxsT9fc7+85av1efGJl8soyFwcmwpTpc8hsQLPTvY2PfPgztVMtEk+oEbj97tv/aSFKuqqwtVJbGWq1Y1ei+m19f5TG59S6Q2hVLM3c9QV972rrty2mNSeHwhl8w2mRfSWWiavexyI2NbSQuaiUI3FFOzDnsT1A5g7/3hcCMgDAAHsp2Dg1VHfT1539pK4jSwY/KKu+WkruTy2Iojl2gZeKzWXX5RpsZByckCiRzux/KaTj3bGwLozhiFbykB8t6HqYg7LXWun0mzfMxFEavUpuqXItdB9dvzv2lZAFBJF7EKWO9+x5dv59plbHE8bwTXhzqKtH8wKSRlNimDL2FbVRuUbIuPKVQjWzBh8pptNAsbN7AWT2+86F+Eu1FaGuxQAJK0Wrv/ALvOXyeCNiIXG2sJ6yGpWpjvTVRUae2w6yY21vvOdl0kDUvrQrpGrbcdDys/cz0v4c4s5eHQt8ylsbVyJU0CPqKM8o8O4xchZELIxQMX6New0gHfcnf/AKI7T9H3jWPIc2EMhbzGddL3qb5WXST6SNN19dtp0x8qdeO4EuExgy8Tq5qxEQEREBERAREQEREBERAREQEREBERAREQEREBERA5r4t4pVFH1ah5emytHmxscjpI/P54/i+FddDLWi2sbg6q9JPadZ8bcMQq5UQuVDllRdTbLsVA63V+w6c5pfCeIXJjexQrUCwsagaNC999ve5x166TxrRiYeoAkhgQpFG73H1IJ/Ms47gyzl8b6dRPoK3bFbAAHQi9rHTnNlxqH0kkKSdx79N+8Bzuo5oQBv3F17DlA53wzzOHyZF0pob1KAGBV1Gojc7jnt/1N83EEaWIDCl9QK7Cqo/zo9pEz4tTeoK9cidq33B25n/e0xplKNTC8JNgaSSp7huRBJ5bV0uBsxkVseTSdK6AVrT299qJ7zVcLnd0ZyGKh7o6yGsC9Ja66Hn12MnYdAGkNVMT1OrVZpt6NHcfbttBbxAuapSxNMA9hlUAawtEjrtyii5MhKmqA26WV/qAftU1449WbSoKHUDbgbtfWt/9MmDVYtbG4bcGmvbSe2/XvI2LAgrYgqtAVoO19O8DX8TibG3nKbTSRSqQQNwNJ67knftfOcv4ViyYOKylk9OVmbFmQgp5eoudhybfa+xrlPQXYVYFiq07D69PvRkLxDg02YBW0uCFybqwI9Wk701bkCrq6MxrrPhP45xuRw3FPWVCMYynYPsCNd8j/FyPPad4J89+KeFrkKOqMj4kseuiAFNaq9wWvpy716T+izxvNmTNw2RG08No0ZSQQAyg+Ua5Eb0O1e13jX8qdZd6IiJ0QREQEREBERAREQEREBERAREQEREBERAREQEREDjPj/jKbBiXIUe/M9JHy2But7iyvP8AzOd4fieItCcrMASGtUF2QaIKi/qBfe51Xxf4FkzOmXBj1vp0PbKAVB2+br/ic1xnhuXDS5sZUsQACQQxHYgkHbpOWvXSeJPHeW4TZmTS15B5bICOZbe65G6NSOchBA/aI1k9GAAB35EkEbe0sC2GRwxGzKRQOrcXXfmCNwQT3jw7FpyYUILI+tFNF1Ukkf8ACj27VtMaudhyrSTdct9/yTvMK3ekmulVsOm//wBklv4vSeQP3/zMbKRqVgQwJXvXLr1mMRlUq261qr1D1AncC79X8pXPjUsuUIPMAIHpUnT13/2/eFYhuQO3Q9L57zIGBOoHcbMpIBF8q73/AGgRhyCZLVqIViQ3I9W257fXe5XF5l0TqYc7ABcHnQvYgdtv7U4plNMxNgHYGgPrWwNjnLFbUUNg6wSL9N9Ro79TAvzKq2xIIJ3NDuKvre/XtLMXFAN6yDjNAGgNLV16ff3luYt5ZOIAZDbFSPQaILKwHLry95ahVw2jYj50NUwroPt9qmjNxnADIwcALYKEqwFKdtS/gWPxO9+CPA24LhijtqfJkOVgOSWqqFF73pUXOL8NbXnwICCrZcdDfemFggduc9UErEZqroiJ0QREQEREBERAREQEREBERAREQEREBERAREQEREBMeVFYFWAYHmGAIP2MuJlpMDW8R4Dwzg/q9J7oStfYbfynJ+L+HngzjJJdVsKUu0t9m089rs12ndM8g+I8JizgDIL0m1P7p/oR7HaTcqlcjmYMz0KJeijAEqNZFkdrVpYy422LercIQLC10JI5dv8AEx+Ltj4fiv1jDGuRWHr0AO+kNqJPeyLO23eQeBbHqYIwA+YAGxR5XvXO9x2+s5rCDqoBv4gQRVb9/rLkQ0dNEmwCaPXkdt7PtMnGvtVHVqGlhz2o0e/Kt6lmHMCmq9Qsi1Ug6huQQORArY+0wQ34cso30MAKvkACdiOhv6dPpLl9KAVen5lttqHzKa9rklcikGvUtm6AJBB5HtR6dJB4vxDHdB7YXTKA1bVW3vEEttjYsk7+kc6A571N34T8NhmGfM5UsBSLQOmv2j0J/M5nhfEiDZTV7FjV3N5w3jZPNPw0uSf1Ndb4Z4TwuBtWLEofenPqYXzAY7gH2m4Rpy/AcejVzH1m+4dpcQnCJapl00IiICIiAiIgIiICIiAiIgIiICIiAiIgIiICUMrKGBjdpHd5mySM8CxjLC0NLTMEfj+Dx50KZUGRDzVhYmhX4F4BSTjR8N8/Jz5cd/gzpJWZyN65fi/gXhsi6Wy8QV7f/offat/3vvci8B+jnhOHcZML5UYdspph2YciPYzs5WPy3rjeO+Cny+k8SRj39C461b36zq9X9PaWYvgZE2Dn7KBO1AlamfmH6rksfwoo/aMlYfh9R3nSaJeuObxnWr4XwtVm44XFUqmKSESprF6y6UErNCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAlDKykDFkEjusmETGyQITJLdMmHHLfKgRdEaJK8qXDFAiaYCSZ5cqMcCIEl4xySElwWBGXFMypMmmVqBQCXARUrAREQEREBERAREQEREBERAREQEREBERAREQEREBERASlREClRpiICoqIgKlalIgVqKiIFaiIgIiICIiAiIgIiICIiAiIgIiIH//Z",
  },
  scissors: {
    name: "Scissors",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzDEX0-UwyDcryKvB7W_7b3qmdMHV0IkAgQ&usqp=CAU",
  },
  paper: {
    name: "Paper",
    img: "https://www.collinsdictionary.com/images/full/paper_111691001.jpg",
  },
};

function App() {
  const [userSelect, setUserState] = useState(null);
  const [computerSelect, setComputerSelect] = useState(null);
  const [result, setResult] = useState("");
  const play = (userChoice) => {
    setUserState(choice[userChoice]); //다시 할당하고 싶은값을 함수의 괄호 안에 넣어주었다. 
    let computerChoice = randomChoice(); //computerChoice는 randomChoice가 선택한 값
    setComputerSelect(computerChoice);
    setResult(judgement(choice[userChoice],computerChoice)); //2가지 값을 받을 수 있게 했다. // judgement는 "win" 혹은 "lose"로 string 값을 return 한다. 
  };

  const judgement = (user,computer) => { //매개변수:  user와 computer 에 각각 choice[userChoice]와 computerChoice가 들어간다. 
    console.log("user:",user, "computer:", computer); 
    //user == computer tie
    //user == rock, computer = scissors user 이김
    //user == rock, computer = paper user 짐
    //user == scissors, computer = paper user 이김
    //user == scissors, computer = rock user 짐
    //user == paper, computer = rock user 이김
    //user == paper, computer =  user 짐
    if(user.name == computer.name){
      return "tie";
    }else if(user.name == "Rock") return computer.name == "Scissors" ? "win" : "lose";
    else if (user.name == "Scissors") return computer.name == "Paper" ? "win" : "lose";
    else if (user.name == "Paper") return computer.name == "Rock" ? "win" : "lose";
  }; 
  const randomChoice = () => {
    let itemArray = Object.keys(choice); //Object.keys()는 객체의 key값 만 뽑아서 array로 만들어준다. 
    console.log("item array: ", itemArray);
    let randomItem = Math.floor(Math.random() * itemArray.length); //Math.romdom() 함수는 1이하의 소수를 랜덤하게 알려준다.  
    console.log("random value:", randomItem);
    let final  = itemArray[randomItem];
    return choice[final]; //[]안에는 choice의 key 값이 들어간다. 
  };// return한 값은 computerChoice 값으로 들어간다. 

  return (
    <div>
      <div className='main'>
        <Box title="you" item={userSelect} result={result}/>
        <Box title="Computer" item={computerSelect} result={result}/>
      </div>
      <div className='main'>
        <button onClick={() => play("scissors")}>가위</button> 
        <button onClick={() => play("rock")}>바위</button>
        <button onClick={() => play("paper")}>보</button>
      </div>
    </div>
    
  );
}

export default App;
