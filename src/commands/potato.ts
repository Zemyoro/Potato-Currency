import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { potatodb } from '../model';
import { Potato } from "../client";

export let potato = {
	name: 'potato',
	description: 'Potato currency',
	data: new SlashCommandBuilder()
		.setName('potato')
		.setDescription('Potato currency')
		.addSubcommand(subcommand =>
			subcommand.setName('amount')
				.setDescription('How many potatoes do you have?')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('How many potatoes do you have?')))
		.addSubcommand(subcommand =>
			subcommand.setName('claim')
				.setDescription('Claim your potatoes!'))
		.addSubcommand(subcommand =>
			subcommand.setName('daily')
				.setDescription('Claim your daily potato!'))
		.addSubcommand(subcommand =>
			subcommand.setName('gift')
				.setDescription('Gift your potatoes to another user!')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('User to gift to.')
						.setRequired(true))
				.addIntegerOption(option =>
					option.setName('amount')
						.setDescription('Amount to gift.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('leaderboard')
				.setDescription('Show top 5 potato collectors!'))
		.addSubcommand(subcommand =>
			subcommand.setName('remove')
				.setDescription('(Mods only) Remove a user\'s data from the potato bot.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('User to remove.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('set')
				.setDescription('(Mods only) Set a user\'s potato amount.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('User to set amount.')
						.setRequired(true))
				.addIntegerOption(option =>
					option.setName('amount')
						.setDescription('Amount to set.')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('daily')
						.setDescription('The last claim of daily potato.'))),
	async slashExecute(interaction: CommandInteraction, client: Potato) {
		const sub_command = interaction.options.getSubcommand();

		switch (sub_command) {
			case 'amount':
				const amount_user = interaction.options.getUser('user') || interaction.user;
				let amount_account = await potatodb.findOne({ userid: amount_user.id });
				if (!amount_account) amount_account = await new potatodb({
					userid: amount_user.id,
					potatoes: 0
				}).save();

				const string =
					`${amount_user.id !== interaction.user.id ? `${amount_user} has` : 'You have'} ${amount_account?.potatoes} potato${amount_account?.potatoes as number > 1 || amount_account?.potatoes === 0 ? 'es' : ''}.`

				const amount_embed = new MessageEmbed()
					.setTitle(`${client.user?.username} | Amount`)
					.setDescription(string)
					.setThumbnail(amount_user.displayAvatarURL({ dynamic: true, size: 1024 }))
					.setTimestamp()

				return interaction.reply({ embeds: [amount_embed] });
			case 'claim':

				if (!client.waitingForClaim) return interaction.reply({ content: 'There is no potato to claim!' });
				let claim_account = await potatodb.findOne({ userid: interaction.user.id });
				if (!claim_account) claim_account = await new potatodb({
					userid: interaction.user.id,
					potatoes: 1
				}).save();

				client.waitingForClaim = false;
				return interaction.reply({ content: `You have claimed the potato!` });
			case 'daily':
				return interaction.reply({ content: `You earned ||0|| potatoes :O` });
			case 'gift':
				const gift_user = interaction.options.getUser('user')
				const gift_amount = interaction.options.getInteger('amount');

				if (gift_user?.id === interaction.user.id) return interaction.reply({ content: `You cannot gift yourself potatoes.` });

				const author_account = await potatodb.findOne({ userid: interaction.user.id });
				if (!author_account) return interaction.reply({ content: `You do not have any potatoes.` });

				// @ts-ignore
				if (author_account.potatoes < gift_amount) return interaction.reply({ content: `You do not have enough potatoes.` });

				author_account.potatoes -= gift_amount as number;
				await author_account.save();

				let gift_account = await potatodb.findOne({ userid: gift_user?.id });
				if (!gift_account) gift_account = await new potatodb({ userid: gift_user?.id, potatoes: gift_amount })
				else gift_account.potatoes += gift_amount as number;
				await gift_account.save();

				return interaction.reply({ content: `There is no gift. Take off your clothes. ||jk we gifted ${gift_user?.username} ${gift_amount} potatoes!||` });
			case 'leaderboard':
				const leaderboard_embed = new MessageEmbed()
					.setTitle(`${client.user?.username} | Leaderboard`)
					.setDescription('Here are the top 5 potato collectors!')
					.setThumbnail(client.user?.displayAvatarURL({ dynamic: true, size: 1024 }) as string)
					.setTimestamp()

				const leaderboard_users = [...await potatodb.find({})];
				const leaderboard_users_amount = leaderboard_users.sort((a, b) => b.potatoes - a.potatoes).slice(0, 5);
				const leaderboard_users_string = leaderboard_users_amount.map(user => `<@!${user.userid}> - ${user.potatoes} potatoes`).join('\n');

				leaderboard_embed.addField('Leaderboard', leaderboard_users_string);
				return interaction.reply({ embeds: [leaderboard_embed] });
			case 'remove':
				const remove_user = interaction.options.getUser('user') || interaction.user;
				const remove_account = await potatodb.findOne({ userid: remove_user.id });
				if (!remove_account) return interaction.reply({ content: `${remove_user} does not have a Potato account.` });

				await potatodb.deleteOne({ userid: remove_user.id });
				return interaction.reply({ content: `${remove_user}'s Potato account has been removed.` });
			case 'set':
				const set_user = interaction.options.getUser('user');
				const set_amount = interaction.options.getInteger('amount');

				let set_user_account = await potatodb.findOne({ userid: set_user?.id });
				if (!set_user_account) set_user_account = await new potatodb({ userid: set_user?.id, potatoes: 0 })

				set_user_account.potatoes = set_amount as number;
				await set_user_account.save();

				return interaction.reply({ content: `You have set ${set_user?.id === interaction.user.id ? 'your' : `${set_user?.username}'s`} potatoes to ${set_amount}.` });
		}
	}
}