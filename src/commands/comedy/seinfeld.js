const { SlashCommandBuilder } = require("discord.js");
const [
  makeSeinfeldJoke,
  somethingThoughtful,
  talkToHucksleyBot,
  butts,
  riddleMeThis,
  answerMeThis,
] = require("../../gpt.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("seinfeld")
    .setDescription("Replies with Pong!")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setDescription("Topic of the Joke")
        .setRequired(true)
    ),
  async execute(interaction) {
    const topic = interaction.options.getString("topic") ?? "No Topic Provided";
    if (topic !== "No Topic Provided") {
      interaction.reply("Working on a silly joke just for you darling");
      makeSeinfeldJoke(topic)
        .then((resp) => {
          if (resp) {
            interaction.editReply(resp);
            console.log(resp);
          } else {
            interaction.editReply("Something went wrong");
          }
        })
        .catch((err) => {
          interaction.editReply("Something went wrong");
        });
    } else {
      interaction.reply("No topic provided ya dummy.");
    }
  },
};
