import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

export const createUser = async (req, res) => {

  await body("name").trim().notEmpty().run(req);
  await body("email").isEmail().normalizeEmail().run(req);
  await body("password").isLength({ min: 6 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    const findUser = await prisma.user.findFirst({ where: { email } });
    if (findUser) {
      return res.status(400).json({ message: "Email Already Taken." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.render("login");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  // const id = req.params.id;
  // const { name, email } = req.body;
  // try {
  //   const updateUser = await prisma.user.update({
  //     where: { id: Number(id) },
  //     data: { name, email },
  //   });
  //   res.json({ status: 200, data: updateUser });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
};

export const fetchUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.json({ status: 200, data: users });
  } catch (error) {
    return res.json({ status: 500, error: error });
  }
};

export const getUser = async (req, res) => {
  await body("email").isEmail().normalizeEmail().run(req);
  await body("password").isLength({ min: 6 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let token;
    try {
      token = jwt.sign(
        {
          id: user.id,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return res.status(500).json({ message: "Error creating token" });
    }
    res.cookie("user_token", token);
    res.redirect("/");
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message || "Internal server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      }
    });
    return res.json({status: 200,message:"User Deleted Sucessfully", data: user})
  } catch (error) {
    return res.json({ status: 500, error: error });
  }
};
