import prisma from "../DB/db.config.js";

export const createTodo = async (req, res) => {
  const user_id = req.user.id;
  const { todo } = req.body;
  try {
    const todoObject = await prisma.todo.create({
      data: {
        text: todo,
        user_id: Number(user_id)
      },
    });
    res.json(todoObject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  const user_id = req.user.id;
  const { id, status } = req.body;
  try {
    await prisma.todo.update({
      where: { id: Number(id) },
      data: { is_completed: status }
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodoById = async (id) => {
  return prisma.todo.findMany({
    where: { user_id: Number(id) },
    orderBy: { created_at: "desc" }
  });
};

export const deleteTodo = async (req, res) => {
  const todo_id = req.body.id;
  try {
    await prisma.todo.delete({ where: { id: Number(todo_id) } });
    res.json({ status: 200, message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};