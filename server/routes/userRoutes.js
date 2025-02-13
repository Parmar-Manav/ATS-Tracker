import express from "express";
import {
  currentUser,
  loginUser,
  registerUser,
} from "../controllers/userCtrl.js";
import { validateToken } from "../middleware/validateTokenHandler.js";

export const userRouter = express.Router();

userRouter.route("/current").get(validateToken, currentUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
