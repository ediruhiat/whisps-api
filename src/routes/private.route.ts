import express, { Request, Response } from "express";

export const privateRoutes = express.Router();

privateRoutes.get("/", (req: Request, res: Response) => {
  return res.status(200).send({
    status: true,
    message: "this is private route.",
  });
});
