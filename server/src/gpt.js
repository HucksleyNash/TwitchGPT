const config = require("./config.json");
const commands = require("../commands.json");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: config.gptKey,
});
const openai = new OpenAIApi(configuration);

const riddleMap = new Map();

async function runPrompt(prompt, command) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: command.replace("${prompt}", prompt),
      },
    ],
    temperature: 0.9,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
  });

  let text = response.data.choices[0].message.content;
  text = text.replace("DAN: ", "");
  return text;
}

async function chatWithBot(username, prompt) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `You are a Twitch streamer, who is streaming live and interacting with your viewers. You see the message "${prompt}" from a user ${username} in the chat, and you need to respond to it in character. The response should be short, sweet and filled with gratitude.`,
      },
    ],
    temperature: 0.9,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
  });

  let text = response.data.choices[0].message.content;
  return text;
}

async function riddleMeThis(username) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Create a riddle that uses wordplay and puns 
        and is no longer than 110 tokens in length. 
        The riddle should have a easy difficulty level and 
        the answer should be something common and easily recognizable. 
        Provide the answer to the riddle in the form of A: [riddle answer]`,
      },
    ],
    temperature: 0.8,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
  });

  let text = response.data.choices[0].message.content;
  console.log(text);
  let textArr = text.split("A:");
  riddleMap.set(username, textArr[1]);
  return textArr[0];
}

function answerMeThis(username) {
  if (riddleMap.has(username) && riddleMap.get(username) !== undefined) {
    return riddleMap.get(username);
  }
  return "Sorry you have no riddles to answer. Get Good Kid.";
}

module.exports = {
  runPrompt,
  chatWithBot,
  riddleMeThis,
  answerMeThis,
};
