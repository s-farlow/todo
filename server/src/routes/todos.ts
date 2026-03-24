// API 
// SOURCE(s): Zod Documentation [https://zod.dev/], SQL.js Documentation [https://sql.js.org/#/],
//      Express Routing [https://expressjs.com/en/guide/routing.html], Cloud Computing, Web Programming
import { Router, Request, Response } from "express";
import { getDB, saveDB } from "../db/database";
import { z } from "zod"; // input validation

const router = Router();

// Zod validation schemas
const CreateTodoSchema = z.object({
    text: z.string().min(1),
    done: z.boolean().default(false),
    due_date: z.string().nullable().default(null),
    due_time: z.string().nullable().default(null),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    order_index: z.number().default(0),
});

// allow for optional fields
const UpdateTodoSchema = CreateTodoSchema.partial();

// GET /api/todos - fetch all tasks
router.get("/", (_req: Request, res: Response) => {
    try {
        const db = getDB();
        const result = db.exec("SELECT * FROM todos ORDER BY order_index ASC, created_at ASC");
        if (result.length === 0) return res.json([]);

        const { columns, values } = result[0];
        const todos = values.map((row) =>
            Object.fromEntries(columns.map((col, i) => [col, row[i]]))
        );
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// POST /api/todos - create a new task
router.post("/", (req: Request, res: Response) => {
    try {
        // check for type-safe data
        const parsed = CreateTodoSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { text, done, due_date, due_time, priority, order_index } = parsed.data;
        const db = getDB();

        // keep user data separate from the SQL
        db.run(
            `INSERT INTO todos (text, done, due_date, due_time, priority, order_index)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [text, done ? 1 : 0, due_date, due_time, priority, order_index]
        );

        const result = db.exec("SELECT * FROM todos WHERE id = last_insert_rowid()");
        const { columns, values } = result[0];
        const todo = Object.fromEntries(columns.map((col, i) => [col, values[0][i]]));

        saveDB();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: "Failed to create task" });
    }
});

// PATCH /api/todos/:id - update a task
router.patch("/:id", (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const parsed = UpdateTodoSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const fields = parsed.data;
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const db = getDB();
        // handle partial updates
        const setClauses = Object.keys(fields).map((key) => `${key} = ?`).join(", ");
        const values = Object.values(fields).map((v) => (typeof v === "boolean" ? (v ? 1 : 0) : v));

        db.run(`UPDATE todos SET ${setClauses} WHERE id = ?`, [...values, id]);

        const result = db.exec(`SELECT * FROM todos WHERE id = ${id}`);
        if (result.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const { columns, values: rows } = result[0];
        const todo = Object.fromEntries(columns.map((col, i) => [col, rows[0][i]]));

        saveDB();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

// DELETE /api/todos/:id; delete a single task
router.delete("/:id", (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const db = getDB();
        db.run("DELETE FROM todos WHERE id = ?", [id]);
        saveDB();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// DELETE /api/todos; delete all tasks
router.delete("/", (_req: Request, res: Response) => {
    try {
        const db = getDB();
        db.run("DELETE FROM todos");
        saveDB();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete all tasks" });
    }
});

export default router;