const express = require("express");
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { getMe } = require("../controllers/authController");

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
