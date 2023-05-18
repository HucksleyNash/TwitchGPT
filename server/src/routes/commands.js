const express = require("express");
const router = express.Router();
const {
  getCommands,
  getCommand,
  addCommand,
  updateCommand,
  deleteCommand,
} = require("../commandManager");

router.get("/", function (req, res) {
  res.send(getCommands());
});

router.post("/", function (req, res) {
  if (
    req.body.hasOwnProperty("commandID") &&
    req.body.hasOwnProperty("prompt") &&
    req.body.hasOwnProperty("userLevel") &&
    req.body.hasOwnProperty("coolDown") &&
    req.body.hasOwnProperty("type")
  ) {
    let { commandID, prompt, userLevel, coolDown, type } = req.body;
    try {
      addCommand(commandID.toLowerCase(), prompt, userLevel, coolDown, type);
      res.send("Success");
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.get("/:commandID", function (req, res) {
  res.send(getCommand(req.params.commandID.toLowerCase()));
});

router.put("/:commandID", function (req, res) {
  if (
    req.body.hasOwnProperty("commandID") &&
    req.body.hasOwnProperty("prompt") &&
    req.body.hasOwnProperty("userLevel") &&
    req.body.hasOwnProperty("coolDown") &&
    req.body.hasOwnProperty("type")
  ) {
    try {
      let { commandID, prompt, userLevel, coolDown, type } = req.body;
      updateCommand(commandID.toLowerCase(), prompt, userLevel, coolDown, type);
      res.send("Success");
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:commandID", function (req, res) {
  try {
    res.send(deleteCommand(req.params.commandID.toLowerCase()));
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
