const express = require("express");
const rootRouter = require("./routers/index");

const cors=require("cors");
const app=express();

app.use(cors());

app.use(express.json());
app.use("/api/v1",rootrouter);

app.listen(3000);


