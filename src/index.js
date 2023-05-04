const tmi = require("tmi.js");
const config = require("./config.json");
const [
  makeSeinfeldJoke,
  makeDToshJoke,
  somethingThoughtful,
  talkToHucksleyBot,
  butts,
  riddleMeThis,
  answerMeThis,
] = require("./gpt.js");
const errMessage =
  "Something broke. Try again later maybe? Who am I kidding its your life do what you want.";

// Define configuration options
const opts = {
  identity: {
    username: config.twitchUser,
    password: config.twitchPassword,
  },
  channels: config.channels,
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const input = msg.trim();

  let data = input.split('"');

  switch (data[0].trim().toLowerCase()) {
    case "!seinfeld":
      makeSeinfeldJoke(data[1])
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
      break;
    case "!compliment":
      somethingThoughtful(data[1])
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
      break;
    case "!butts":
      butts()
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
      break;
    case "!comedy":
      client.say(
        target,
        '!seinfeld "Topic", !compliment "Someone". !butts Dont forget the quotes around topic ya jerk.'
      );
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
  if (input.toLowerCase().includes("@hucksley_nash")) {
    talkToHucksleyBot(context.username, input)
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
