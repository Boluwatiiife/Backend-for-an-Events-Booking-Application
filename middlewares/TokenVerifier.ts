import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";

let TokenVerifier = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void => {
  try {
    let token = request.headers["x-auth-token"];
    if (!token) {
      response.status(401).json({
        errors: [{ msg: "No Token Provided eje, Access Denied" }],
      });
      return;
    }
    let secretKey: string | undefined = process.env.JWT_SECRET_KEY;
    if (typeof token === "string") {
      let decode: any = jwt.verify(token, secretKey);
      request.headers["user"] = decode.user;
      next();
    }
  } catch (error) {
    response.status(500).json({
      errors: [{ msg: "Invalid Token" }],
    });
    return;
  }
};

export default TokenVerifier;
