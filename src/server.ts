import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import nanoid from "nanoid";

const jobs = [
    {
        id: nanoid(),
        company: "Google",
        position: "Software Engineer",
    },
    {
        id: nanoid(),
        company: "Microsoft",
        position: "Software Engineer",
    },
    {
        id: nanoid(),
        company: "Amazon",
        position: "Software Engineer",
    }
]

const app = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "Hello World!!" });
});

app.listen(process.env.PORT ?? 5100, () => {
  console.log("server running....");
});

app.post("/api/v1/test", (req, res) => {
  const { name } = req.body;
  res.json({ msg: `hello ${name}!` });
});

app.get("/api/v1/jobs", (req, res) => {
  res.status(200).json({ jobs });
});
