// Create the TO-DO app. Built using React & Redux toolkit in typescript. Node.js & Express to handle the backend.
// Author: Sydney Farlow
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { LuCalendarDays } from "react-icons/lu";
import "react-datepicker/dist/react-datepicker.css";

// import Redux store
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  deleteAllTodos,
  clearCompleted,
} from "./store/todosSlice";
import type { Todo } from "./types/todo";

// get icon for date-picker
const CustomDateInput = React.forwardRef<HTMLButtonElement, { onClick?: () => void }>(
  ({ onClick }, ref) => (
    <button onClick={onClick} ref={ref} style={{ backgroundColor: "#35353552", cursor: "pointer", fontSize: 25, padding: "5px", paddingLeft: "15px", paddingRight: "15px" }}>
      <LuCalendarDays />
    </button>
  )
);

export default function App() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.items);
  const status = useAppSelector((state) => state.todos.status);
  const error = useAppSelector((state) => state.todos.error);

  const [input, setInput] = useState("");
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [date, setDate] = useState(new Date());

  const dayOfWeekOptions: Intl.DateTimeFormatOptions = { weekday: "long" };
  const dayOfWeekShort: Intl.DateTimeFormatOptions = { weekday: "short" };
  const formattedDayOfWeek = date.toLocaleDateString(undefined, dayOfWeekOptions);

  // fetch todos from API on mount
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // update today's date every second
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // add a task using the Redux store
  function handleAddTodo() {
    if (input.trim() === "") return;
    dispatch(
      addTodo({
        text: input,
        due_date: taskDate ? taskDate.toISOString().split("T")[0] : null,
      })
    );
    setInput("");
    setTaskDate(null);
  }

  // create an array of completed tasks
  const completed = todos.filter((todo) => todo.done);
  // an array of task Ids (for priotity [TO BE ADDED])
  const completedIds = completed.map((todo) => todo.id);

  return (
    <div style={{ maxWidth: 400, margin: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", textDecorationLine: "underline", textDecorationThickness: "1.5px", textDecorationColor: "#eeeeee", marginBottom: "0px" }}>TO-DO</h1>
      <p style={{ textAlign: "center", fontSize: "20px", marginTop: "20px", marginBottom: "0px", fontFamily: "serif" }}>Today's Date:</p>
      <p style={{ textAlign: "center", fontSize: "25px", marginTop: "0px", marginBottom: "50px", fontFamily: "serif", font: "bold" }}>{formattedDayOfWeek}, {date.toLocaleDateString()}</p>

      {/* Task input */}
      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
        <input
          value={input}
          onChange={(t) => setInput(t.target.value)}
          onKeyDown={(t) => t.key === "Enter" && handleAddTodo()}
          placeholder="ADD A TASK..."
          style={{ padding: 8 }}
        />
        <DatePicker
          selected={taskDate}
          onChange={(d: Date | null) => setTaskDate(d)}
          customInput={<CustomDateInput />}
        />
        <button onClick={handleAddTodo}>ADD</button>
      </div>

      {/* Button controls */}
      <div style={{ display: "flex", margin: "20px", gap: 8, justifyContent: "center" }}>
        <button onClick={() => dispatch(deleteAllTodos())}>DELETE ALL</button>
        {completed.length > 0 && (
          <button onClick={() => dispatch(clearCompleted(completedIds))}>
            CLEAR COMPLETED
          </button>
        )}
      </div>

      {/* Status messages */}
      {status === "loading" && (
        <p style={{ textAlign: "center", color: "#aaa" }}>Loading...</p>
      )}
      {status === "failed" && (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      )}

      {/* Task counter */}
      <div style={{ textAlign: "right", fontSize: 14, fontFamily: "monospace", color: "white" }}>
        <p>COMPLETED: {completed.length} / {todos.length}</p>
      </div>

      {/* Todo list */}
      <ul style={{ listStyle: "none", fontFamily: "serif", padding: 0, marginTop: 16, justifyContent: "center" }}>
        {todos.map((todo: Todo) => {
          const textDecoration = todo.done ? "line-through" : "none";
          const color = todo.done ? "#aaa" : "white";
          const isOverdue =
            todo.due_date &&
            !todo.done &&
            new Date(todo.due_date).toDateString() !== new Date().toDateString() &&
            new Date(todo.due_date) < new Date();
          const shortDayOfWeek = todo.due_date
            ? new Date(todo.due_date).toLocaleDateString(undefined, dayOfWeekShort)
            : null;

          return (<li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={Boolean(todo.done)}
              onChange={() => dispatch(toggleTodo(todo))}
            />
            <span style={{ flex: 1, fontSize: 20, textDecoration, color }}>
              {todo.text}
              {todo.due_date && (<span style={{ display: "inline-block", marginLeft: "10px", fontSize: 12, color: isOverdue ? "red" : "#aaa" }}>
                {shortDayOfWeek}, {new Date(todo.due_date).toLocaleDateString()}
              </span>
              )}
            </span>
            <button style={{ backgroundColor: "#47474752" }} onClick={() => dispatch(deleteTodo(todo.id))}>DELETE</button>
          </li>
          );
        })}
      </ul>
    </div>
  );
}