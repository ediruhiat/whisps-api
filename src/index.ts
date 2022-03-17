import express from "express";
import { authRoutes } from "./routes/auth.route";
import { privateRoutes } from "./routes/private.route";

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api/user", authRoutes);
app.use("/api/private", privateRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.APP_PORT}`
  );
});
