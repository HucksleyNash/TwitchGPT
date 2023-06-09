const path = require("path");
const fs = require("fs");
const { getCommands } = require("./commandManager");

const tmi = require("tmi.js");
const config = require("./config.json");
const {
  runPrompt,
  riddleMeThis,
  answerMeThis,
  chatWithBot,
} = require("./gpt.js");

const filePath = path.join(__dirname, "../commands.json");
let commands = getCommands();
let client;

const errMessage =
  "Something broke. Try again later maybe? Who am I kidding its your life do what you want.";

function buildTwitchCommands() {
  let resp = fs.readFileSync(filePath, "utf8");
  commands = JSON.parse(resp);
  // Create a client with our options
  client = new tmi.client(opts);

  // Register our event handlers (defined below)
  client.on("message", onMessageHandler);
  client.on("connected", onConnectedHandler);

  // Connect to Twitch:
  client.connect();
}

// Define configuration options
const opts = {
  identity: {
    username: config.twitchUser,
    password: config.twitchPassword,
  },
  channels: config.channels,
};

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const input = msg.trim();

  let data = input.split('"');
  commands = getCommands();
  let potentialCommand = data[0].trim().toLowerCase();
  if (commands.hasOwnProperty(potentialCommand)) {
    if (commands[potentialCommand].type === "chatGPT") {
      runPrompt(data[1], commands[potentialCommand].prompt)
        .then((resp) => {
          if (resp) {
            client.say(target, resp);
            console.log(resp);
          } else {
            client.say(target, errMessage);
          }
        })
        .catch((err) => {
          client.say(target, errMessage);
          console.log(err);
        });
    } else {
      client.say(target, commands[potentialCommand].prompt);
    }
  }

  switch (potentialCommand) {
    case "!prompts":
      let commandString = "Current Prompts";
      for (let command in commands) {
        commandString += " " + command;
      }
      commandString += ` !riddle !answerTo add an input to any command put "INPUT". Some commands will ignore this!`;
      client.say(target, commandString);
      break;
    case "!riddle":
      riddleMeThis(context.username)
        .then((resp) => {
          if (resp) {
            client.say(target, resp);
          } else {
            client.say(target, errMessage);
            console.log(err);
          }
        })
        .catch((err) => {
          client.say(target, errMessage);
          console.log(err);
        });
      break;
    case "!answer":
      client.say(target, answerMeThis(context.username));
      break;
    default:
  }
  if (input.toLowerCase().includes(config.twitchUser)) {
    chatWithBot(context.username, input)
      .then((resp) => {
        if (resp) {
          client.say(target, resp);
          console.log(resp);
        } else {
          client.say(target, errMessage);
        }
      })
      .catch((err) => {
        client.say(target, errMessage);
        console.log(err);
      });
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

module.exports = { buildTwitchCommands };
