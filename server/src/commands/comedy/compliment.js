const { SlashCommandBuilder } = require("discord.js");
const commands = require("../../../commands.json");
const { runPrompt } = require("../../gpt.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("compliment")
    .setDescription("compliments a person")
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
      runPrompt(person, commands.commands["!compliment"].prompt)
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
