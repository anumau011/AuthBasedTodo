

import { createUser, updateUser, fetchUser, deleteUser, getUser } from "../controller/UserController.js";
import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post(
	"/",
	[
		body("name").trim().notEmpty().withMessage("Name is required"),
		body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
		body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
	],
	createUser
);

router.post(
	"/login",
	[
		body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
		body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
	],
	getUser
);
router.get("/", fetchUser);
router.delete("/:id", deleteUser);
// router.post("/:id", updateUser);

// Logout route
router.post("/logout", (req, res) => {
    res.clearCookie("user_token", { path: "/" });
    res.json({ success: true, message: "Logged out" });
});

export default router;