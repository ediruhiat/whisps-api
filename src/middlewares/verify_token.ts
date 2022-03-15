import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const Verify = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).send({
      status: false,
      message: "access denied.",
    });

  try {
    const verified = jwt.verify(token, process.env.APP_TOKEN_SECRET!);
    req.body.user = verified;

    next();
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: "invalid token.",
    });
  }
};

export default Verify;
