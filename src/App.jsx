import React, { useState , useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import { LuCalendarDays } from "react-icons/lu";

const CustomDateInput = React.forwardRef(({ onClick }, ref) => (
  <button onClick={onClick} ref={ref} style={{ backgroundColor: "#35353552", cursor: "pointer", fontSize: 25, padding: "5px", paddingLeft: "15px", paddingRight:"15px" }}>
    <LuCalendarDays />
  </button>
));

export default function App() {
  // loads todos from localStorage
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    if (saved !== null) {
      return JSON.parse(saved);
    } else {
      return []
    }
  });
  const [input, setInput] = useState("");
  const [date, setDate] = useState(new Date());
  const [taskDate, setTaskDate] = useState(null);
  const dayOfWeekOptions = { weekday: 'long' };
  const formattedDayOfWeek = date.toLocaleDateString(undefined, dayOfWeekOptions);
  var textDecoration;
  var color;

  // set today's date
  useEffect(() => {
    var timer = setInterval(() => { 
      setDate(new Date()) }, 1000);
    return function cleanup() {
      clearInterval(timer);
    }
  }, []);

  // adds todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos]);

  // adds list item
  function addTodo() {
    if (input.trim() === "") {
      return;
    }
    setTodos([...todos, { text: input, done: false, dueDate: taskDate }]);
    setInput("");
    setTaskDate(null);
  }

  function toggleTodo(index) {
    const updated = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, done: !todo.done };
      } else {
        return todo;
      }
    })
    setTodos(updated);
  }

  function deleteTodo(index) {
    setTodos(todos.filter((_, i) => { 
      return i !== index }));
  }

  function clearCompleted() {
    setTodos(todos.filter((todo) => { return !todo.done }));
  }

  // array of completed tasks
  const completed = todos.filter((todo) => { return todo.done });

  return (
    <div style={{ maxWidth: 400, margin: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{textAlign: "center", textDecorationLine: "underline", marginBottom: "0px"}}>TO-DO</h1>
      <p style={{textAlign: "center", fontSize: "20px", marginTop: "20px", marginBottom: "0px", fontFamily: "serif", font: "bold"}}>Today's Date:</p>
      <p style={{textAlign: "center", fontSize: "25px", marginTop: "0px", marginBottom: "50px", fontFamily: "serif", font: "bold"}}>{formattedDayOfWeek}, {date.toLocaleDateString()}</p>

      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value) }}
          onKeyDown={(e) => { e.key === "Enter" && addTodo() }}
          placeholder="ADD A TASK..."
          style={{ padding: 8 }}
        />
        <DatePicker
          selected={taskDate}
          onChange={(date) => {setTaskDate(date)}}
          customInput={<CustomDateInput />}
        />
        <button onClick={addTodo}>ADD</button>
      </div>
      
      {/* Button control */}
      <div style={{ display: "flex", margin: "20px", gap: 8, justifyContent: "center" }}>
        <button onClick={() => { setTodos([]) }}>DELETE ALL</button>
        {completed.length > 0 && <button onClick={clearCompleted}>CLEAR COMPLETED</button>}
      </div>

      {/* Create count for completed tasks. */}
      <div style={{textAlign: "right", fontSize: 14, fontFamily: "monospace", color: "white"}}>
        <p> COMPLETED: {completed.length} / {todos.length}</p>
      </div>

      <ul style={{ listStyle: "none", fontFamily: "serif", padding: 0, marginTop: 16, justifyContent: "center" }}>
        {todos.map((todo, i) => {
          // strikethough completed todo
          if (todo.done) {
            textDecoration = "line-through";
          } else {
            textDecoration = "none";
          }
          // darken completed todo
          if (todo.done) {
            color = "#aaa";
          } else {
            color = "white";
          }
          const isOverdue = todo.dueDate && !todo.done && 
            new Date(todo.dueDate).toDateString() !== new Date().toDateString() && 
            new Date(todo.dueDate) < new Date();
          return <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => { toggleTodo(i) }}
            />
            <span style={{ flex: 1, fontSize: 20, textDecoration, color }}>
              {todo.text}
              {todo.dueDate && <span style={{ display: "inline-block", marginLeft: "10px", fontSize: 12, color: isOverdue ? "red" : "#aaa" }}>
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>}
            </span>
            <button style={{ backgroundColor: "#47474752"}} onClick={() => { deleteTodo(i) }}>DELETE</button>
          </li>
        })}
      </ul>
    </div>
  )
}
