const express = require("express");
const axios = require("axios");
const router = express.Router();

const client = require("../config/redis");

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    client.get(`${username}.github-profile`, async (err, result) => {
      if (err)
        return res.status(500).json({ status: "failed", message: err.message });

      if (result) {
        res
          .status(201)
          .json({ status: "success", message: JSON.parse(result) });
      } else {
        const response = await axios.get(
          `https://api.github.com/users/${username}`
        );
        client.set(`${username}.github-profile`, JSON.stringify(response.data));

        res.status(200).json({ status: "success", message: response.data });
      }
    });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
});

module.exports = router;
