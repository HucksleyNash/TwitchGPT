const tmi = require("tmi.js");
const config = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Partials,
} = require("discord.js");
const [
  makeSeinfeldJoke,
  somethingThoughtful,
  talkToHucksleyBot,
  butts,
  riddleMeThis,
  answerMeThis,
] = require("./gpt.js");
const { buildCommands } = require("./discordDeploy.js");

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

if (config.discordEnabled && config.discordEnabled === true) {
  buildCommands();
  const dClient = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
  });

  dClient.commands = new Collection();

  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        dClient.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  dClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  });

  dClient.on("ready", () => {
    console.log("Ready freddy");
    // console.log(`Logged in as ${client.user.tag}!`);
  });

  dClient.login(config.discordToken);
}
