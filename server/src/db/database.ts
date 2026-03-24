// Database for todo app. Creates a SQLite db to save as binary file in root.
// Implemented to move app from localStorage to a SQL database
// SOURCE(s): SQL.js Documentation [https://sql.js.org/#/], Cloud Computing, Web Programming

import initSqlJs, { Database } from "sql.js";
import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.join(__dirname, "../../todos.db.bin");

let db: Database;

export async function initDB(): Promise<void> {
    // load in SQL
    const SQL = await initSqlJs();

    // check for a db file on disk
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // create task table
    db.run(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            done INTEGER NOT NULL DEFAULT 0,
            due_date TEXT,
            due_time TEXT,
            priority TEXT NOT NULL DEFAULT 'medium',
            order_index INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);

    saveDB();
}

export function saveDB(): void {
    // wrtie back into the file
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function getDB(): Database {
    if (!db) throw new Error("Database not initialized");
    return db;
}