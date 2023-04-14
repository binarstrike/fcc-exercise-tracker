import type { Response, Request } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req: Request, res: Response) => {
  if (req.method === "POST") {
    const username = req.body.username
    try {
      const user = await prisma.user.create({ data: { username } })
      res.json({ username: user.username, _id: user.id })
      console.log(`Created user with id ${user.id}`)
    } catch (error) {
      console.error(error)
      res.status(409).json({ error: "Error occurred when create new user" })
    }
  } else if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany()
      if (!users)
        return res.status(404).json({ error: "No one user have been created" })
      res.status(200).json(
        users.map(
          (value) =>
            ({ _id: value.id, username: value.username } as {
              _id: string
              username: string
            })
        )
      )
    } catch (error) {
      console.error(error)
      res
        .status(404)
        .json({ error: "An error occurred when get the list of user" })
    }
  } else res.status(405).json({ error: "Method Not Allowed" })
}
