import {Router} from 'express'
import {isAuthUser} from '../middleware/UserAuth.js'
import {createTodo,updateTodo,deleteTodo} from '../controller/TodoController.js'

const router = Router()

router.post("/create", isAuthUser, createTodo);
router.post("/update", isAuthUser, updateTodo);
router.delete("/delete", isAuthUser, deleteTodo);

export default router;