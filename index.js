import express, { urlencoded } from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
const app = express();
import jwt from "jsonwebtoken";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
import session from "express-session";
import { getTodoById } from "./controller/TodoController.js";


app.use(
  session({
    secret: process.env.SESSION_SECRET || "yoursecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // cookie not accessible to JS
      secure: false, // true if using HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


app.get("/", async (req, res) => {
  //   console.log(token,name)
  const token = req.cookies?.user_token;
  // console.log(token)
  let isAuth = false;
  let name = null;
  let todos = [];
  if (token) {
    try {
      const user = jwt.verify(token,process.env.JWT_SECRET);
      isAuth = true;
      name = user.name;
      todos = await getTodoById(user.id);
    } catch (error) {
      // res.status(403).json({ error: error,message:"please login" });
      res.render("index")
    }
  }
  // console.log(todos)
  res.render("index", { isAuth, name,todos });
});
app.get('/favicon.ico', (req, res) => res.status(204));
app.get("/login", (req, res) => {
  return res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.use(router);
app.listen(process.env.PORT);
