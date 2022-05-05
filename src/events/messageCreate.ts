import { Message } from "discord.js";
import { Potato } from "../client";

export let messageCreate = {
	name: 'messageCreate',
	async execute(arg: any[], client: Potato) {
		const message = arg[0] as Message;
		if (message.author.bot) return;

		let messages = (await message.channel.messages.fetch({ limit: 6 })).toJSON()
		let potatoMessage = messages.filter(m => m.author.bot || m.author.id === message.author.id).length + 1;
		if (Math.random() < 0.01 * ((message.content.length / 50) + 1) * (client.sinceLast / 3) / (potatoMessage * 2)) {
			message.channel.send('🥔');
			client.waitingForClaim = true;
			client.sinceLast = 0;
		} else client.sinceLast++;

		const match = message.content.match(/<@!?(\d+)>/g);
		if (match) {
			const id = client.user?.id as string || '';
			const index = match.findIndex(m => m.includes(id));
			if (index !== -1) {
				return message.reply(`Use /potato to interact with me.`);
			}
		}
	}
}