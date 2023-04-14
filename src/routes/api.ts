import usersController from "../controllers/users.controller"
import exercisesController from "../controllers/exercises.controller"
import logsController from "../controllers/logs.controller"
import { Router } from "express"

export const router = Router()

router.get("/", (req, res) => {
  res.send("Hi")
})

router.all("/users", usersController)
router.post("/users/:_id/exercises", exercisesController)
router.get("/users/:_id/logs", logsController)

export default router
