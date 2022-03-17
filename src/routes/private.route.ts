import express, { Request, Response } from "express";
import Verify from "../middlewares/verify_token";

export const privateRoutes = express.Router();

privateRoutes.get("/", Verify, (req: Request, res: Response) => {
  return res.status(200).send({
    status: true,
    message: "this is private route.",
  });
});
