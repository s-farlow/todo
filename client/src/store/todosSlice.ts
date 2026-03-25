// SOURCE(s): Redux Toolkit - createSlice [https://redux-toolkit.js.org/api/createSlice];
//    Redux Toolkit - createAsyncThun [https://redux-toolkit.js.org/api/createAsyncThunk]
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Todo } from "../types/todo";

/* ---- State shapes ---- */
interface TodosState {
  items: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  status: "idle",
  error: null,
};

/* ---- API calls ---- */
// fetch all tasks - GET
export const fetchTodos = createAsyncThunk("todos/fetchAll", async () => {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return (await res.json()) as Todo[];
});

// add tasks to list - POST
export const addTodo = createAsyncThunk(
  "todos/add",
  async (payload: { text: string; due_date: string | null; due_time: string | null }) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: payload.text,
        done: false,
        due_date: payload.due_date,
        due_time: payload.due_time,
        priority: "medium",
        order_index: 0,
      }),
    });
    if (!res.ok) throw new Error("Failed to add task");
    return (await res.json()) as Todo;
  }
);

// marks the task as complete - PATCH
export const toggleTodo = createAsyncThunk(
  "todos/toggle",
  async (todo: Todo) => {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    if (!res.ok) throw new Error("Failed to toggle task");
    return (await res.json()) as Todo;
  }
);

// delete one task - DELETE:id
export const deleteTodo = createAsyncThunk(
  "todos/delete",
  async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
    return id;
  }
);

// delete all tasks - DELETE
export const deleteAllTodos = createAsyncThunk(
  "todos/deleteAll",
  async () => {
    const res = await fetch("/api/todos", { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete all tasks");
  }
);

// clear completed tasks - DELTETE 
export const clearCompleted = createAsyncThunk(
  "todos/clearCompleted",
  async (completedIds: number[]) => {
    await Promise.all(
      completedIds.map((id) =>
        fetch(`/api/todos/${id}`, { method: "DELETE" })
      )
    );
    return completedIds;
  }
);

/* ---- Slice state ---- */ 
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchTodos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      });

    // addTodo
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // toggleTodo
    builder.addCase(toggleTodo.fulfilled, (state, action) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    });

    // deleteTodo
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    });

    // deleteAllTodos
    builder.addCase(deleteAllTodos.fulfilled, (state) => {
      state.items = [];
    });

    // clearCompleted
    builder.addCase(clearCompleted.fulfilled, (state, action) => {
      state.items = state.items.filter((t) => !action.payload.includes(t.id));
    });
  },
});

export default todosSlice.reducer;