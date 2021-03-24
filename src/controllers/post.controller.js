const express = require("express");
const router = express.Router();

const client = require("../config/redis");

const Post = require("../models/post.model");

router.get("/", async (req, res) => {
  client.get("posts", async (err, posts) => {
    if (err)
      return res.status(500).json({ status: "failed", message: err.message });

    if (posts) {
      return res.status(201).json({ data: JSON.parse(posts) });
    } else {
      const posts = await Post.find({}).lean().exec();
      client.set("posts", JSON.stringify(posts));
      return res.status(200).json({ status: "success", posts });
    }
  });
});

router.post("/:userId/:postId/like", async (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  client.get(`${userId}.${postId}.like`, async (err, hasLiked) => {
    if (err)
      return res.status(500).json({ status: "failed", message: err.message });
    console.log("hasLiked", hasLiked);
    if (hasLiked == "true") {
      client.set(`${userId}.${postId}.like`, false);
      client.decr(`${postId}.likes`);
      return res
        .status(201)
        .json({ status: "success", message: "Post has been disliked" });
    } else {
      client.set(`${userId}.${postId}.like`, true);
      client.incr(`${postId}.likes`);
      return res
        .status(200)
        .json({ status: "success", message: "Post has been liked" });
    }
  });
});

module.exports = router;
