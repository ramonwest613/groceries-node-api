import express from "express";
import UserService from "./src/service/UserService.js";
import StorageAreaService from "./src/service/StorageAreaService.js"
import CategoryService from "./src/service/CategoryService.js";
import ItemService from "./src/service/ItemService.js";
import cors from "cors";
import jwt from "jsonwebtoken";

// initialize app and dependencies
const app = express();
const userService = new UserService();
const storageAreaService = new StorageAreaService();
const categoryService = new CategoryService();
const itemService = new ItemService();
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
// TODO: CREATE NEW USER ENDPOINT
//  POST LOGIN - generate JWT
app.post(process.env.LOGIN_ENDPOINT, async (req, res) => {
  const { username, password } = await req.body;
  // validate user exists in database
  let authUser = await userService.authenticateUser([username, password]);
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
// GET USER GROCERIES
app.get(process.env.GET_USER_DATA_ENDPOINT, validateToken, async (req, res) => {
  let id = req.params.userId;
  let user = await userService.getUserData(id);
  res.json(user);
});

// GET STORAGE AREA BY ID
app.get(process.env.GET_STORAGE_ENDPOINT, validateToken, async (req, res) => {
  let id = req.params.storageId;
  let storageArea = await storageAreaService.getStorageArea(id);
  res.json(storageArea);
});
// GET ALL STORAGE AREAS BY USER_ID
app.get(process.env.GET_USER_STORAGE_ENDPOINT, validateToken, async (req, res) => {
  let userId = req.params.userId;
  let storageAreas = await storageAreaService.getStorageAreasByUserId(userId);
  res.json(storageAreas);
});

// EDIT STORAGE AREA BY ID
// POST NEW STORAGE AREA
app.post(process.env.STORAGE_ENDPOINT, validateToken, async (req, res) => {
  const storageArea = await req.body;
  const response = await storageAreaService.createStorageArea(storageArea);
  res.json(response);
});

// GET CATEGORY BY ID
// EDIT CATEGORY BY ID
// POST NEW CATEGORY
app.post(process.env.CATEGORY_ENDPOINT, validateToken, async (req, res) => {
  const category = await req.body;
  const response = await categoryService.createCategory(category);
  res.json(response);
});

// GET ITEM BY ID
// EDIT ITEM BY ID
// POST NEW ITEM
app.post(process.env.ITEM_ENDPOINT, validateToken, async (req, res) => {
  const item = await req.body;
  const response = await itemService.createItem(item);
  res.json(response);
});
