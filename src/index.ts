import api from "./routes/api"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { join } from "path"

export const app = express()
const PORT = process.env?.PORT || 3000

app.set("trust proxy", true)
app.use(cors({ optionsSuccessStatus: 200 }))
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))
app.use(express.static(join(process.cwd(), "public")))
app.use((req, res, next) => {
  next()
})
app.use("/api", api)

app.get("/", (req, res) => {
  res.sendFile(join(process.cwd(), "views/index.html"))
})

app.listen(PORT, () =>
  console.log(`Application is running... http://localhost:${PORT}`)
)

export default app
