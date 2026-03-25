// set up todo type
export interface Todo {
  id: number;
  text: string;
  done: boolean;
  due_date: string | null;
  due_time: string | null; //alloq for a time-picker
  priority: "low" | "medium" | "high"; // allow for task priority [TO BE ADDED]
  order_index: number; // allow for (potential) drag-and-drop in future dev [TO BE ADDED]
  created_at: string;
}

export type CreateTodoInput = Omit<Todo, "id" | "created_at">;
export type UpdateTodoInput = Partial<Omit<Todo, "id" | "created_at">>;