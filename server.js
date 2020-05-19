const express = require("express");
const cors= require("cors");
const initDatabase = require('./src/db.js');
const userRouter = require('./src/routes/user');

initDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",userRouter);





app.listen(3000, () => console.log("Listening on port 3000"));