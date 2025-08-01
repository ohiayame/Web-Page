import { useState, useRef } from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todos, setTodos] = useState([]);

  const todoNameRef = useRef();

  const handleAddTodo = () => {
    // 태스크 추가
    // console.log(todoNameRef.current.value);
    const name = todoNameRef.current.value;

    if(name === "") return;

    setTodos((prevTodos) => {
      return [...prevTodos, {id: uuidv4(), name: name, completed: false}]
    });

    todoNameRef.current.value = null;
  };

  const toggleTodo = (id) => {
    // checkbox
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);

    todo.completed = !todo.completed;

    setTodos(newTodos);
  };

  const handleClear = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  };

  return (
    // 출력
    <>
      <TodoList todos={todos} toggleTodo={toggleTodo}/>
      
      <input type="text" ref={todoNameRef} />
      <button onClick={handleAddTodo}>추가</button>
      <button onClick={handleClear}>삭제</button>
      <div> 나머지 : {todos.filter((todo) => !todo.completed).length}</div>
    </>
  );
}

export default App;
