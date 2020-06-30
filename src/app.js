const express = require("express");
const cors= require("cors");
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const providerRouter = require('./routes/provider');
const initDatabase = require('./db.js');

initDatabase();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendStatus(200);
})

app.use("/users",userRouter);
app.use("/posts", postRouter);
app.use("/provider", providerRouter);

module.exports = app;