const express = require("express");

const connect = require("./config/db");

const userController = require("./controllers/user.controller");
const postController = require("./controllers/post.controller");

const app = express();
app.use(express.json());

app.use("/users", userController);
app.use("/posts", postController);

const start = async () => {
  await connect();

  app.listen(2244, () => {
    console.log("Listening on port 2244...");
  });
};

module.exports = start;
