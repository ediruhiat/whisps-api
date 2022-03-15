import express, { Request, Response } from "express";
import UserModel from "../models/user.model";
import AuthController from "../controllers/auth.controller";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authRoutes = express.Router();

authRoutes.post("/register", async (req: Request, res: Response) => {
  const registerData = req.body;
  const dataValidation = AuthController.validate(registerData, "REGISTER");

  if (!dataValidation.status) {
    return res.status(400).send(dataValidation);
  }

  const result = await UserModel.create(registerData);

  return res.status(200).send(result);
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  const credential = req.body;
  const dataValidation = AuthController.validate(credential, "LOGIN");

  if (!dataValidation.status) {
    return res.status(400).send(dataValidation);
  }

  const user = await UserModel.findOne("username", credential.username, false);
  if (!user)
    return res.status(403).send({
      status: false,
      message: `username ${credential.username} is not registered.`,
    });

  const validPass = await bcrypt.compare(credential.password, user.password);
  if (!validPass)
    return res.status(403).send({
      status: false,
      message: "incorrect password.",
    });

  const token = jwt.sign(
    {
      id: user.id,
      uuid: user.uuid,
      username: user.username,
      email: user.email,
    },
    process.env.APP_TOKEN_SECRET!
  );

  res.header("auth-token", token).status(200).send({
    status: true,
    message: "logged in successfully.",
  });
});

authRoutes.get("/list", async (req: Request, res: Response) => {
  const query = req.body;

  const result = await UserModel.find(query);

  res.status(200).send(
    result.length > 0
      ? {
          status: true,
          message: "success",
          data: result,
        }
      : {
          status: false,
          message: "no data found",
        }
  );
});
