const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const { verifyToken, isAdmin } = require("../middlewares/auth.js");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
// router.get("/", verifyToken, isAdmin, authController.getAllUsers);
// router.get("/:id", verifyToken, authController.getUserById);
// router.delete("/:id", verifyToken, isAdmin, authController.softDeleteUser);
// router.patch("/restore/:id", verifyToken, isAdmin, authController.restoreUser);
router.get("/users", verifyToken, authController.getAllUsers);
router.get("/users/:id", verifyToken, authController.getUserById);
router.put("/users/:id", verifyToken, authController.updateUser);
router.delete("/users/:id", verifyToken, isAdmin, authController.softDeleteUser);
router.patch("/users/:id/restore", verifyToken, isAdmin, authController.restoreUser);



module.exports = router;
