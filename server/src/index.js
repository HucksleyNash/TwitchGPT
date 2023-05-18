const config = require("./config.json");
const { buildTwitchCommands } = require("./twitchCommands.js");

const express = require("express");
const index = require("./routes/index");
const commands = require("./routes/commands");
const app = express();
const bodyParser = require("body-parser");
const port = 3001; // or any other port you want to use
const { buildCommands, runBot } = require("./discordDeploy.js");

//Do Twitch things
buildTwitchCommands();

//do discord things
if (config.discordEnabled && config.discordEnabled === true) {
  buildCommands();
  runBot();
}
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", index);
app.use("/commands", commands);

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});
