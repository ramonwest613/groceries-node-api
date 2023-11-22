// import libraries
import express from "express";
import UserController from "./src/controller/UserController.js";
import cors from "cors";
import jwt from "jsonwebtoken";

// initialize app and dependencies
const app = express();
const userController = new UserController();
app.use(cors());
app.use(express.json());

// initialize app constants
const secretKey = process.env.SECRET_KEY;

// API calls
app.listen(8080, () => {
  console.log("Welcome, listening on port 8080");
});

app.get("/v1/api", (req, res) => {
  res.json("hello api");
});


app.get("/v1/api/users/:id", async (req, res) => {
  let id = req.params.id;
  let user = await userController.getUserData(id);
  res.json(user);
});

// authenticate user, create session token
app.post("/v1/api/login", async (req, res) => {
  const { username, password } = await req.body;
  
  // validate user exists in database
  let authUser = await userController.authenticateUser([username, password]);

  if (authUser) {
    // generate token
    const payload = {
      userid: authUser.user_id,
      username: authUser.user_name,
      data: 'json object for user data',
    }
    const options = {
      expiresIn: '1h',
      algorithm: 'HS256',
    }
    const token = jwt.sign(payload, secretKey, options);
    // return token
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});

// validate incoming JWT tokens for requests
const validateToken = async (req, res, next) => {
  // get token from request header
  const token = await req.header('Authorization');
  // if no token is present, return error
  if (!token) {
    return res.status(401).json({message: 'Missing token.'});
  }
  // if token is present, verify validity and decode
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({message: 'Invalid token.'});
  }
};

// Protected route that requires a valid JWT token
app.get("/v2/api/users/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  let user = await userController.getUserData(id);
  res.json(user);
});
