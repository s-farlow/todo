import React, { useState , useEffect } from "react"

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState(new Date());
  const dayOfWeekOptions = { weekday: 'long' };
  const formattedDayOfWeek = date.toLocaleDateString(undefined, dayOfWeekOptions);
  var textDecoration;
  var color;

  // set date
  useEffect(() => {
    var timer = setInterval(function() { setDate(new Date()) }, 1000);
    return function cleanup() {
      clearInterval(timer);
    }
  }, []);

  // adds list item
  function addTodo() {
    if (input.trim() === "") {
      return;
    }
    setTodos([...todos, { text: input, done: false }]);
    setInput("");
  };

  function toggleTodo(index) {
    const updated = todos.map(function(todo, i) {
      if (i === index) {
        return { ...todo, done: !todo.done };
      } else {
        return todo;
      }
    })
    setTodos(updated);
  }

  function deleteTodo(index) {
    setTodos(todos.filter(function(_, i) { return i !== index}));
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{textAlign: "center", textDecorationLine: "underline", marginBottom: "0px"}}>To-Do List</h1>
      <p style={{textAlign: "center", fontSize: "30px", marginBottom: "0px"}}>Today's Date:</p>
      <p style={{textAlign: "center", fontSize: "25px", marginTop: "0px", marginBottom: "30px"}}>{formattedDayOfWeek}, {date.toLocaleDateString()}</p>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={function(e) { setInput(e.target.value) }}
          onKeyDown={function(e) { e.key === "Enter" && addTodo() }}
          placeholder="Add a task..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTodo}>Add</button>
        <button onClick={function() { setTodos([]) }}>Delete All</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {todos.map(function(todo, i) {
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
          return <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={function() { toggleTodo(i) }}
            />
            <span style={{ flex: 1, textDecoration, color }}>
              {todo.text}
            </span>
            <button onClick={function() { deleteTodo(i) }}>Delete</button>
          </li>
        })}
      </ul>
    </div>
  )
}
