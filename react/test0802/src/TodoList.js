import React from 'react'
import Todo from './Todo'

// 매개변수 : todoList, checkbox관리
const TodoList = ({ todos, toggleTodo }) => {
    // map함수를 사용해 Todo컨포넌트(todo, key=id, checkbox관리를 전달)로 Todos를 하나씩 반환
    return todos.map((todo) => <Todo todo={todo} toggleTodo={toggleTodo} key={todo.id}/>);
};

export default TodoList