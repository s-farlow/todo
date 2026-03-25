// Create the TO-DO app. Built using React & Redux toolkit in typescript. Node.js & Express to handle the backend.
// Author: Sydney Farlow
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { LuCalendarDays, LuClock3 } from "react-icons/lu";
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence, motion } from "framer-motion";

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
    <button onClick={onClick} ref={ref} style={{ backgroundColor: "#35353552", cursor: "pointer", fontSize: 25, padding: "10px 10px 5px" }}>
      <LuCalendarDays />
    </button>
  )
);

export default function App() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => {
    const items = state.todos.items;
    return [...items].sort((a, b) => {
      if (a.done === b.done) return 0;
      return a.done ? 1 : -1;
    });
  });
  const status = useAppSelector((state) => state.todos.status);
  const error = useAppSelector((state) => state.todos.error);

  const [input, setInput] = useState("");
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [date, setDate] = useState(new Date());
  const [timePicker, setTimePicker] = useState(false);
  const [taskHr, setTaskHr] = useState("12");
  const [taskMin, setTaskMin] = useState("00");
  const [taskAmPm, setTaskAmPm] = useState("AM");
  
  const zeroToSixty: string[] = Array.from({ length: 61 }, (_, i) => {
    return i.toString().padStart(2, '0');
  });


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
    const hasTime = timePicker;
    const isDate = taskDate ? taskDate.toISOString().split("T")[0] : hasTime ? new Date().toISOString().split("T")[0] : null;
    const isTime = hasTime ? `${taskHr}:${taskMin} ${taskAmPm}` : null;
    
    dispatch(
      addTodo({
        text: input,
        due_date: isDate,
        due_time: isTime
      })
    );
    setInput("");
    setTaskDate(null);
    setTimePicker(false);
    setTaskHr("12");
    setTaskMin("00");
    setTaskAmPm("AM");
  }

  // create an array of completed tasks
  const completed = todos.filter((todo) => todo.done);
  // an array of task Ids (for priotity [TO BE ADDED])
  const completedIds = completed.map((todo) => todo.id);

  return (
    <div className="app-container" style={{ fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", textDecorationLine: "underline", textDecorationThickness: "1.5px", textDecorationColor: "#eeeeee", marginBottom: "0px" }}>TO-DO</h1>
      <p style={{ textAlign: "center", fontSize: "20px", marginTop: "20px", marginBottom: "0px", fontFamily: "serif" }}>Today's Date:</p>
      <p style={{ textAlign: "center", fontSize: "25px", marginTop: "0px", marginBottom: "50px", fontFamily: "serif", font: "bold" }}>{formattedDayOfWeek}, {date.toLocaleDateString()}</p>

      {/* Task input */}
      <div className="input-row">
        <input
          value={input}
          onChange={(i) => setInput(i.target.value)}
          onKeyDown={(i) => i.key === "Enter" && handleAddTodo()}
          placeholder="ADD A TASK..."
          style={{ padding: 8 }}
        />
        <DatePicker
          selected={taskDate}
          onChange={(d: Date | null) => setTaskDate(d)}
          customInput={<CustomDateInput />}
        />
        <button
          onClick={() => setTimePicker(!timePicker)}
          style={{
            backgroundColor: "#35353552",
            cursor: "pointer",
            fontSize: 25,
            padding: "10px 10px 5px",
          }}
          aria-label="Toggle time picker">
          <LuClock3 />
        </button>
        <button onClick={handleAddTodo}>ADD</button>
      </div>

      {/* Time pick drop down */}
      {timePicker && (
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <select
            value={taskHr}
            onChange={(e) => setTaskHr(e.target.value)}
            style={{
              backgroundColor: "#1a1a1a",
              color: "#eeeeee",
              border: "1.75px solid #1a1a1a",
              borderRadius: 8,
              padding: "4px 8px",
              fontFamily: "monospace",
              fontSize: 14,
              cursor: "pointer"
            }}>
            {Array.from({ length: 12 }, (_, i) => {
              const hour = String(i + 1);
              return <option key={hour} value={hour}>{hour}</option>;
            })}
          </select>

          <span style={{ color: "#eeeeee", fontFamily: "monospace", fontSize: 18 }}>:</span>

          <select
            value={taskMin}
            onChange={(e) => setTaskMin(e.target.value)}
            style={{
              backgroundColor: "#1a1a1a",
              color: "#eeeeee",
              border: "1.75px solid #1a1a1a",
              borderRadius: 8,
              padding: "4px 8px",
              fontFamily: "monospace",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {zeroToSixty.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={taskAmPm}
            onChange={(e) => setTaskAmPm(e.target.value)}
            style={{
              backgroundColor: "#1a1a1a",
              color: "#eeeeee",
              border: "1.75px solid #1a1a1a",
              borderRadius: 8,
              padding: "4px 8px",
              fontFamily: "monospace",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      )}

      {/* Button controls */}
      <div className="button-row">
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
        <AnimatePresence>
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

            return (
            <motion.li key={todo.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} 
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={Boolean(todo.done)}
                onChange={() => dispatch(toggleTodo(todo))}
              />
              <span style={{ flex: 1, fontSize: 20, textDecoration, color }}>
                {todo.text}
                {todo.due_date && (<span style={{ display: "inline-block", marginLeft: "10px", fontSize: 12, color: isOverdue ? "red" : "#aaa" }}>
                  {shortDayOfWeek}, {new Date(todo.due_date).toLocaleDateString()} {todo.due_time && ` at ${todo.due_time}`}
                </span>
                )}
              </span>
              <button style={{ backgroundColor: "#47474752" }} onClick={() => dispatch(deleteTodo(todo.id))}>DELETE</button>
            </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}