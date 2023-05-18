const path = require("path");
const fs = require("fs");
const filePath = path.join(__dirname, "../commands.json");

function getCommands() {
  let resp = fs.readFileSync(filePath, "utf8");
  return JSON.parse(resp);
}

function getCommand(commandID) {
  let commands = getCommands();
  if (commands.hasOwnProperty(commandID)) {
    return commands[commandID];
  } else {
    return "No Command Found";
  }
}

function addCommand(commandID, prompt, userLevel, coolDown, type) {
  let commands = getCommands();
  if (!commands.hasOwnProperty(commandID)) {
    commands[commandID] = {
      trigger: commandID,
      prompt,
      userLevel,
      coolDown,
      type,
    };
    writeData(commands);
  }
}

function updateCommand(commandID, prompt, userLevel, coolDown, type) {
  let commands = getCommands();
  commands[commandID] = {
    trigger: commandID,
    prompt,
    userLevel,
    coolDown,
    type,
  };
  writeData(commands);
}
function deleteCommand(commandID) {
  let commands = getCommands();
  delete commands[commandID];
  writeData(commands);
}

function writeData(data) {
  if (data) {
    data = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error("An error occurred while overwriting the file:", err);
        return;
      }
    });
  } else {
    throw "No data to write to file";
  }
}

module.exports = {
  getCommands,
  getCommand,
  addCommand,
  updateCommand,
  deleteCommand,
};
