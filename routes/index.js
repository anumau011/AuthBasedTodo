import { Router } from "express";

import CreateUserRoutes from './CreateUserRoutes.js'
import CreateTodoRoutes from './CreateTodoRoutes.js'
const router = Router();

router.use("/api/user",CreateUserRoutes)
router.use("/api/todo",CreateTodoRoutes)
export default router;

