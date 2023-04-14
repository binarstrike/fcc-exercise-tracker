import type { Response, Request } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type ExercisesPostResponse = {
  username: string
  description: string
  duration: number
  date: string
  _id: string
}
type ExercisesPostData = {
  description: string
  duration: string
  date?: Date
}

export default async (req: Request, res: Response) => {
  try {
    const id = req.params._id
    let date = new Date()

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(404).json({ error: "User not found" })

    const exercisesData = req.body as ExercisesPostData

    if (exercisesData.date) date = new Date(exercisesData.date)

    await prisma.user.update({
      where: { id },
      data: {
        exercises: {
          create: {
            description: exercisesData.description,
            duration: parseInt(exercisesData.duration),
            date,
          },
        },
      },
    })
    const result: ExercisesPostResponse = {
      username: user.username,
      description: exercisesData.description,
      duration: parseInt(exercisesData.duration),
      _id: id,
      date: date.toDateString(),
    }
    res.json(result)
  } catch (error) {
    console.error(error)
    res
      .status(409)
      .json({ error: "An error occurred when adding exercises to user" })
  }
}
