require('dotenv').config();
const express = require("express");
const cors= require("cors");
const initDatabase = require('./src/db.js');
const userRouter = require('./src/routes/user');
const postRouter = require('./src/routes/post');
const providerRouter = require('./src/routes/provider');


initDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",userRouter);
app.use("/posts", postRouter);
app.use("/provider", providerRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));