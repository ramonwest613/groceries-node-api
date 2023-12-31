// import libraries
import express from "express";
import UserController from "./src/controller/UserController.js";
import cors from "cors";
import jwt from "jsonwebtoken";

// initialize app and dependencies
const app = express();
const userController = new UserController();
const secretKey = process.env.SECRET_KEY;
app.use(cors());
app.use(express.json());

// validate incoming JWT tokens for requests
const validateToken = async (req, res, next) => {
  // get token from request header
  const token = await req.header(process.env.REQUEST_TOKEN_HEADER);
  // if no token is present, return error
  if (!token) {
    return res.status(401).json({ message: "Missing token." });
  }
  // if token is present, verify validity and decode
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

// API ENDPOINTS
app.listen(8080, () => {
  console.log("Welcome, listening on port 8080");
});

// USER ENDPOINTS:
//  POST LOGIN - generate JWT
app.post(process.env.LOGIN_ENDPOINT, async (req, res) => {
  const { username, password } = await req.body;
  // validate user exists in database
  let authUser = await userController.authenticateUser([username, password]);
  if (authUser) {
    // generate token
    const payload = {
      userid: authUser.user_id,
      username: authUser.user_name,
      data: "json object for user data",
    };
    const options = {
      expiresIn: "1h",
      algorithm: "HS256",
    };
    const token = jwt.sign(payload, secretKey, options);
    // return token
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});
// PROTECTED ENDPOINTS
//  GET USER DATA
app.get(process.env.USER_DATA_ENDPOINT, validateToken, async (req, res) => {
  let id = req.params.id;
  let user = await userController.getUserData(id);
  res.json(user);
});
//  POST NEW STORAGE AREA
app.post(process.env.STORAGE_ENDPOINT, validateToken, async (req, res) => {
  const storageArea = await req.body;
  res.json(storageArea);
});
//  POST NEW CATEGORY
app.post(process.env.CATEGORY_ENDPOINT, validateToken, async (req, res) => {
  const category = await req.body;
  res.json(category);
});
//  POST NEW ITEM
app.post(process.env.ITEM_ENDPOINT, validateToken, async (req, res) => {
  const item = await req.body;
  res.json(item);
});
