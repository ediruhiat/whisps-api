import express from "express";
import { authRoutes } from "./routes/auth.route";

const app = express();

// middlewares
app.use(express.json());

// routes middleware
app.use("/api/user", authRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.APP_PORT}`
  );
});
