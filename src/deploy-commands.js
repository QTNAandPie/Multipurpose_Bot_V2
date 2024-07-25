require("dotenv/config");

const { REST, Routes } = require("discord.js");
const { clientId } = require("./../config.json");

const rest = new REST().setToken(process.env.TOKEN);

rest.delete(Routes.applicationCommand(clientId, "commandId"))
	.then(() => console.log("Successfully deleted application command"))
	.catch(console.error);
