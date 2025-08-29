import express from "express";
import test from "./nested/testfile.js";
import morgan from "morgan";
import * as dotenv from "dotenv";

const app = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send({ msg: "Hello World!!" + test});
});

app.listen(process.env.PORT ?? 5100, () => {
    console.log("server running....");
});

app.post("/api/v1/test", (req, res) => {
    const { name } = req.body;
    res.json({ msg: `hello ${name}!` });
}); 