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
    .setName("compliment")
    .setDescription("Replies with Pong!")
    .addStringOption((option) =>
      option
        .setName("person")
        .setDescription("the person that you want to compliment")
        .setRequired(true)
    ),
  async execute(interaction) {
    const person =
      interaction.options.getString("person") ?? "No person Provided";
    if (person !== "No person Provided") {
      interaction.reply("Complement incoming prepare for kindness!");
      somethingThoughtful(person)
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
      interaction.reply("No person provided ya dummy.");
    }
  },
};
