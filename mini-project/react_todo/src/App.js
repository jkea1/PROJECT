import {useState, useRef, useCallback} from 'react';
import React from 'react';
import TodoInsert from './components/TodoInsert';
import TodoTemplate from './components/TodoTemplate';
import TodoList from './components/TodoList';


function App() {
  const [todos, setTodos] = useState([
    {
      id: 1, 
      text: 111111,
      checked: true,
    },
    {
      id: 2, 
      text: 222222,
      checked: true,
    },
    {
      id: 3, 
      text: 333333, 
      checked: false,
    },
  ]);

  //고유값으로 사용될 id
  //ref를 사용하여 변수 담기 
  const nextId = useRef(4);
  const onInsert = useCallback(
    text => { //text를 파라미터로 받아옴
      const todo = {
        id: nextId.current,
        text,
        checked: false,
      };
      setTodos(todos.concat(todo));
      nextId.current += 1
    },
    [todos],
  )

  const onRemove = useCallback(
    id => { //id를 파라미터로 받아옴
      setTodos(todos.filter(todo => todo.id !== id));
    },
    [todos],
  )

  const onToggle = useCallback(
    id => {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo,
        ),
      );
    },
    [todos],
  )

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert}/> {/* onInsert함수를 넣어줌 */}
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle}/>
    </TodoTemplate>
  );
}

export default App;
