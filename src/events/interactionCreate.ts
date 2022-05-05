import { Potato } from "../client";
import { CommandInteraction } from "discord.js";

export let interactionCreate = {
	name: 'interactionCreate',
	async execute(arg: any[], client: Potato) {
		const interaction = arg[0] as CommandInteraction;

		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				return command.slashExecute(interaction, client);
			} catch (e) {
				console.log(e);
				return interaction.reply({ content: 'There was an error executing that command.' });
			}
		}
	}
}