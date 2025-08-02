import { useRef, useState } from 'react';
import TodoList from "./TodoList";
import { v4 as uuidv4 } from "uuid";

function App() {
  // todoList의 useState() 선언
  const [ todos, setTodos ] = useState([]);

  // 입력내용 저장 변수 선언 useRef()
  const todoNameRef = useRef();


  // 1) 항목 추가
  const handleAddTodo = () => {
    // 내용 -> 내용변수.current.value 로 대입
    const name = todoNameRef.current.value;
    // 만약 내용이 없으면 return
    if(name === "") return;

    // 마지막에 set {id: uuid사용(uuidv4()), name: 내용, completed: false}
    setTodos((prevTodos) => {
      return [...prevTodos, {id: uuidv4(), name: name, completed: false}]
    });

    // todoNameRef값 초기화
    todoNameRef.current.value = null;
  }
  
  // 2) checkbox관리
    // 매개변수로 id받기
  const toggleTodo = (id) =>{
    // todoList복사
    const newTodos = [...todos];
    // 복사본에서 동일 id를 가지는 항복을 find()
    const todo = newTodos.find((todo) => todo.id === id);
    // 해당 항목의 completed를 반전
    todo.completed = !todo.completed;
    // 수정한 복사본을 set
    setTodos(newTodos);
  }

  // 3) 항목 삭제
  const handleClear = () => {
    // completed가 false인 값만 추출하여 set
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  }


  return (
    <div>
      {/* todoList 컨포넌트 (todoList과 checkbox관리를 전달) */}
      <TodoList todos={todos} toggleTodo={toggleTodo} />

      {/* 입력 창 / ref-> 내용 */}
      <input type='text' ref={todoNameRef} />
      {/* 저장 버튼 onClick-> (1) */}
      <button onClick={handleAddTodo}>Add</button>
      {/* 완료된 항목 삭제 onClick-> (3) */}
      <button onClick={handleClear}>delete</button>
      {/* 나머지 항목 개수 출력 / filter()로 completed가 false인 length */}
      <div>나머지 : {todos.filter((todo) => !todo.completed).length}</div>
    </div>
  );
}

export default App;
