import { CommandInteraction } from "discord.js";
import { Potato } from "../client";
import { SlashCommandBuilder } from "@discordjs/builders";

export let echo = {
	name: 'echo',
	description: 'Echo a message',
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Echo a message')
		.addStringOption(option =>
			option.setName('content')
				.setDescription('The message to echo')
				.setRequired(true)),
	slashExecute(interaction: CommandInteraction, client: Potato) {
		return interaction.reply({ content: interaction.options.getString('content') });
	}
}