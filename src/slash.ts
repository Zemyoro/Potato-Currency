import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'

require('dotenv').config();

const GuildID = process.env.GUILD_ID;
const ClientID = process.env.CLIENT_ID;
const argv = process.argv[2]

const rest = new REST().setToken(`${process.env['TOKEN']}`);
const guild = Routes.applicationGuildCommands
const global = Routes.applicationCommands

let commands = [];
import * as Commands from './commands';

for (const command of Object.values(Commands)) {
	console.log(command.data.toJSON())
	if (command.data) commands.push(command.data.toJSON());
}

(async () => {
	try {
		console.log(`Started refreshing application (/) commands ${argv === "--guild" ? "in guild" : "globally"}.`);

		argv === "--guild" ? await rest.put(guild(ClientID as string, GuildID as string), { body: commands })
			: await rest.put(global(ClientID as string), { body: commands });

		console.log(`Successfully refreshed application commands (/) ${argv === "--guild" ? "in guild" : "globally"}.`);
	} catch (e) {
		console.error(e);
	}
})();