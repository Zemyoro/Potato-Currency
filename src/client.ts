import { Client, Collection } from 'discord.js';
require('dotenv').config();

export class Potato extends Client {
	prefix: string;
	commands: Collection<string, any>;
	sinceLast: number = 0;
	waitingForClaim: Boolean = false;
	constructor(options: any) {
		super(options);

		this.prefix = process.env.PREFIX as string;
		this.commands = new Collection();
	}
}

export const client = new Potato({
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_MESSAGES'
	],
	allowedMentions: { parse: ['users'] }
});