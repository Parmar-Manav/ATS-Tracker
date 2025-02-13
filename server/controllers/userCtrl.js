import { User } from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//@desc Register User
//@route POST /Register
//@access public
export const registerUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({
    where: { email: email },
  });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already Registered!");
    return;
  }

  //hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashedPassword);
  const user = await User.create({ username, email, password: hashedPassword });
  console.log(`User Created. ${user}`);
  if (user) {
    res.status(201).json({ _id: user.user_id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  //res.status(201).json({ message: "User Registered Succesfully..", user });
});

//@desc Login User
//@route POST /Login
//@access public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }
  const user = await User.findOne({
    where: { email: email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const AccessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.user_id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    res.status(200).json({ AccessToken });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

//@desc Current User Info
//@route GET /Current
//@access private
export const currentUser = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});
