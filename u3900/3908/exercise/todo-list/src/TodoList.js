import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import NewTodoForm from "./NewTodoForm";
import Todo from "./Todo";
import "./TodoList.css";

const TodoList = () => {
  const INITIAL_STATE = [];
  const [todos, setTodos] = useState(INITIAL_STATE);
  const addTodo = (newTodo) => {
    setTodos(todos => [...todos, { ...newTodo, id: uuidv4() }]);
  }

  const deleteTodo = id => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }

  return (
    <div className="TodoList">
      <h3>New Todo Form</h3>
      <NewTodoForm addTodo={addTodo} />

      <div className="TodoList-container">        
      <div className="TodoList-container-2">
        <h3 style={{ marginBottom: "10px", }}>Todo List</h3>
        {todos.map(({ id, text }) => 
          <Todo 
            id={id}
            text={text}
            deleteTodo={() => deleteTodo(id)}
            key={id}
          />
        )}
      </div>
      </div>
    </div>
  )
}

export default TodoList;