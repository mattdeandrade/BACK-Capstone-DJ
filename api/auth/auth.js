const express = require("express");
const router = express.Router();

//This creates the token we will use for registered and logged in users
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

const prisma = require("../../prisma");

// This router attaches the token to the request
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);

  if (!token) return next();

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
});

// This router is used for registering new users
router.post("/register", async (req, res, next) => {
  console.log(req.body);
  const { username, password, email, firstName, lastName, admin } = req.body;

  try {
    const user = await prisma.user.register(
      username,
      password,
      email,
      firstName,
      lastName,
      admin
    );
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

// This router is for logging in already registered users
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  
  try {
    const user = await prisma.user.login(username, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
   console.error(e);
   //send a clear JSON error reponse.
   res.status(401).json({ message: "Invalid username or password."})
  }
});

/** Checks the request for an authenticated user. */
function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    next({ status: 401, message: "You must be logged in." });
  }
}

module.exports = {
  router,
  authenticate,
};
