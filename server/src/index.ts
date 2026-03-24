// Implement Express framework 
// SOURCE(S): Express Documentation [https://expressjs.com/], 
//   Cross-Origin Resource Sharing (CORS) [https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS]
import express from "express";
import cors from "cors"; // allow for frontend+backend communication on different ports
import { initDB } from "./db/database";
import todoRoutes from "./routes/todos";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// route todos to the API
app.use("/api/todos", todoRoutes);

// confirm server is running
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// initalize DB before server starts:
//   prevents hitting routes before DB is initialized
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});