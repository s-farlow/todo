// define type for frontend 
// leave out priority and order for now
export interface Todo {
  id: number;
  text: string;
  done: boolean;
  due_date: string | null;
  due_time: string | null;
  created_at: string;
}