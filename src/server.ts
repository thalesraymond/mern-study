import express from "express";
import test from "./nested/testfile.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!!" + test);
});

app.listen(5100, () => {
    console.log("server running....");
});