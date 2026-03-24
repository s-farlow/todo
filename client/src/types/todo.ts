// define type for frontend 
// leave out priority, order, and time-picker for now
export interface Todo {
  id: number;
  text: string;
  done: boolean;
  due_date: string | null;
  created_at: string;
}