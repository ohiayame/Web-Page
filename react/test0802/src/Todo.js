import React from 'react'

// 매개변수 : todoList, checkbox관리
const Todo = ({ todo, toggleTodo }) => {
    const handleTodoClick = () =>{
        toggleTodo(todo.id)
    }

    return (
        <div>
            {/* label */}
            <label>
                {/* 입력: checkbox, readOnly, checked->completed, onChange->chackbox관리  */}
                <input
                    type='checkbox'
                    checked={todo.completed}
                    onChange={handleTodoClick}
                    readOnly
                />
            </label>
            {/* 내용(name) */}
            {todo.name}
        </div>
    )
}

export default Todo