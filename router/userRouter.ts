import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import { IUser } from "../models/IUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import TokenVerifier from "../middlewares/TokenVerifier";

const userRouter: express.Router = express.Router();

// Logic

/**
 * @usage : register a User
 * @url : http://127.0.0.1:5000/users/register
 * @method : POST
 * @fields : name, email, password
 * @access : public
 */

userRouter.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is Required"),
    body("email").not().isEmpty().withMessage("Email is Required"),
    body("password").not().isEmpty().withMessage("Password is Required"),
  ],
  async (
    request: express.Request,
    response: express.Response
  ): Promise<any> => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      let { name, email, password } = request.body;

      // check if the email exists
      let user: IUser | null = await User.findOne({ email: email });
      if (user) {
        return response.status(400).json({
          errors: [{ message: "User Exists Already" }],
        });
      }

      // encrypt the password
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      // get avatar url
      let avatar = gravatar.url(email, {
        s: "300",
        r: "pg",
        d: "mm",
      });

      // register the user
      user = new User({ name, email, password, avatar });
      user = await user.save();

      response.status(200).json({
        message: "Registration is Successfully eje!",
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        errors: [
          {
            message: error,
          },
        ],
      });
    }
  }
);

/**
 * @usage : Login a User
 * @url : http://127.0.0.1:5000/users/login
 * @method : POST
 * @fields : email, password
 * @access : public
 */

userRouter.post(
  "/login",
  [
    body("email").not().isEmpty().withMessage("Email is Required"),
    body("password").not().isEmpty().withMessage("Password is Required"),
  ],
  async (
    request: express.Request,
    response: express.Response
  ): Promise<any> => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      let { email, password } = request.body;

      // check for email
      let user: IUser | null = await User.findOne({ email: email });
      if (!user) {
        return response.status(401).json({
          errors: [{ msg: "Invalid Email" }],
        });
      }

      //check for password
      let isMatch: boolean = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(401).json({
          errors: [{ msg: "Invalid Password" }],
        });
      }

      //create token
      let payload: any = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      let secretKey: string | undefined = process.env.JWT_SECRET_KEY;
      if (secretKey) {
        let token = await jwt.sign(payload, secretKey);
        response.status(200).json({ msg: "Login Successful", token: token });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({
        errors: [
          {
            message: error,
          },
        ],
      });
    }
  }
);

/**
 * @usage : Get User Info
 * @url : http://127.0.0.1:5000/users/me
 * @method : GET
 * @fields : no-fields
 * @access : private
 */

userRouter.get(
  "/me",
  TokenVerifier,
  async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let requestedUser: any = request.headers["user"];
      let user: IUser | null = await User.findById(requestedUser.id).select(
        "-password"
      );
      if (!user) {
        response.status(400).json({ errors: [{ msg: "User Data not Found" }] });
        return;
      }
      response.status(200).json({
        user: user,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        errors: [
          {
            message: error,
          },
        ],
      });
    }
  }
);

export default userRouter;
