import type { Response, Request } from "express"
import { PrismaClient, Exercise } from "@prisma/client"

const prisma = new PrismaClient()

type LogsListType = {
  description: string
  duration: number
  date?: string
}
type LogsResponseData = {
  username: string
  count: number
  _id: string
  log: LogsListType[]
}

const filterLogs = (from: any, to: any, limit: any) => {
  if (from && to) {
    if (limit)
      return {
        where: {
          date: {
            gte: new Date(from as string),
            lte: new Date(to as string),
          },
        },
        take: parseInt(limit as string),
      }
    else
      return {
        where: {
          date: {
            gte: new Date(from as string),
            lte: new Date(to as string),
          },
        },
      }
  } else if (limit)
    return {
      take: parseInt(limit as string),
    }
  else return true
}

export default async (req: Request, res: Response) => {
  try {
    const id = req.params._id
    const { limit, from, to } = req.query

    const log = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: true,
        exercises: filterLogs(from, to, limit),
      },
    })
    if (!log)
      return res.status(404).json({ error: "Error data or user not found" })

    const logResults: LogsResponseData = {
      username: log.username,
      _id: log.id,
      count: log._count.exercises,
      log: log.exercises.map(
        (value) =>
          ({
            description: value.description,
            duration: value.duration,
            date: new Date(value.date).toDateString(),
          } as LogsListType)
      ),
    }
    res.json(logResults)
  } catch (error) {
    console.error(error)
    res
      .status(404)
      .json({ error: "An error occurred when get logs of exercises" })
  }
}
