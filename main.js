const {
	Client,
	Events,
	GatewayIntentBits,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require('discord.js');
const fs = require('fs');

const {
	token,
	prefix,
	devIDs,
	avatarURL,
	defEmbedColor,
	defFooter,
} = require('./conf.json');
const modRoles = require('./modRoles.json');
let db = require('./database.json');

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

bot.once(Events.ClientReady, b => {
	console.log(`Client is ready. Logged in as ${b.user.id} -- ${b.user.tag}`);
	b.user.setPresence({ status: 'idle', activities: [{ name: 'Steven Universe', type:3 }] });
	// b.user.setAvatar('./avatar.png');
});

bot.on(Events.MessageCreate, msg => {

	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		sendMessage(`There is ${bot.ws.ping}ms between me and Discord! °^°`);
	}

	if (command === 'setmodrole') {
		if (args.length == 1) {
			if (authorIsOwner || authorIsMod) {
				const modRoleIdentifier = args.shift();
				let modRoleID;
				if (modRoleIdentifier.startsWith('<@&')) {
					modRoleID = modRoleIdentifier.slice(3, modRoleIdentifier.length - 1);
				} else if (modRoleIdentifier.startsWith('<@')) {
					sendMessage('It seems you\'ve tried to mention a user instead of a role °o°, please try again! ^w^\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`');
					return;
				} else {
					modRoleID = modRoleIdentifier;
				}

				msg.guild.roles.fetch(modRoleID).then(role => {
					if (role == null || role == undefined) {
						sendMessage('There was an error fecthing the role. °-° Please try again! ^^\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`');
					}
		
					let guildId = msg.guildId;
					modRoles[guildId] = modRoleID;
					fs.writeFile('./modRoles.json', JSON.stringify(modRoles, null, 4), 'utf-8', function(error) {
						if (error) {
							console.error;
						}
					});
					sendMessage('Moderator role defined successfully!! ^w^')
				});
			} else {
				sendMessage('This command is for moderators only, sorry.. :\'(');
			}
		} else {
			sendMessage('Not enough or too much arguments!! `n´ :(\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`');
		}
	}

	if (command === 'help') {
		if (args.shift() == undefined) {
			const infoEmbed = createEmbed(defEmbedColor, 'Informations', null, 'Hello ^^! I\'m Validity and I\'m a Discord(TM) bot designed for plural systems/teams/communities/etc, allowing you to register a system, members of this system, groups, etc.', null, avatarURL, defFooter)
				.addFields([
					{
						name: 'What are "*plural systems*"?',
						value: 'According to [Pluralpedia](https://pluralpedia.org/w/System), a system is the collection of people and entities, often called headmates or alters, that share a single physical plural body.',
					},
					{
						name: 'What is this bot for?',
						value: 'It serves the exact same use as [PluralKit](https://pluralkit.me), depending on a defined tag, called a proxy, a message will be replaced by a fake account, with the name and the avatar defined by the member.',
					},
				]);
			const basicEmbed = createEmbed(defEmbedColor, 'Basic Commands', null, 'Create a system with `va!system create <system name> [avatar URL]`! °w° (you can attach the picture instead u^u)\nAdd your first member with `va!member add <name> <avatar URL>`. -3-', null, null, defFooter);
			const listEmbed = createEmbed(defEmbedColor, 'Command List', null, 'TODO', null, null, defFooter);//TODO: Fill this one
			

			let infoButtonStyle = ButtonStyle.Primary;
			let basicButtonStyle = ButtonStyle.Secondary;
			let listButtonStyle = ButtonStyle.Secondary;
			let buttons = new ActionRowBuilder()
				.addComponents(
					createButton('ℹ️', infoButtonStyle, 'Informormations').setCustomId('info'),
					createButton('📄', basicButtonStyle, "Basic Commands").setCustomId('basic'),
					createButton('📜', listButtonStyle, 'Complete command List').setCustomId('list')
				)

			sendMessage(null, [infoEmbed], [buttons]);

			const collector = msg.channel.createMessageComponentCollector();
			collector.on('collect', async i => {
				if (i.customId === 'info') {
					try {
						infoButtonStyle = ButtonStyle.Primary;
						basicButtonStyle = ButtonStyle.Secondary;
						listButtonStyle = ButtonStyle.Secondary;
						await i.update({
							embeds: [infoEmbed],
							components: [updateButtonStyle([ infoButtonStyle, basicButtonStyle, listButtonStyle ], buttons)]
						});
					} catch (err) {
						console.error();
					}
				} else if (i.customId === 'basic') {
					try {
						infoButtonStyle = ButtonStyle.Secondary;
						basicButtonStyle = ButtonStyle.Primary;
						listButtonStyle = ButtonStyle.Secondary;
						await i.update({
							embeds: [basicEmbed],
							components: [updateButtonStyle([ infoButtonStyle, basicButtonStyle, listButtonStyle ], buttons)]
						});
					} catch (err) {
						console.error();
					}
				} else if (i.customId === 'list') {
					try {
						infoButtonStyle = ButtonStyle.Secondary;
						basicButtonStyle = ButtonStyle.Secondary;
						listButtonStyle = ButtonStyle.Primary;
						await i.update({
							embeds: [listEmbed],
							components: [updateButtonStyle([ infoButtonStyle, basicButtonStyle, listButtonStyle ], buttons)]
						});
					} catch (err) {
						console.error();
					}
				}
			});

		} else {
			const subCommand = args.shift().toLowerCase();
		}
	}
	if (command === 'system') {
		const subCommand = args.shift().toLowerCase();
		if (subCommand === 'create' && args.length >= 1) {
			if (db[msg.author.id] == undefined || db[msg.author.id] == null) {
				let name = '';
				let url = '';
				for (let i = 0; i < args.length; i++) {
					if (!args[i].startsWith('http') && !args[i].includes('.')) {
						name += args[i] + ' ';
					} else {
						url = args.slice(i).join(' ');
						break;
					}
				}
				name = name.trim();
				console.log(url.length, url)
				if (url.length > 0 && !url.startsWith('http') && !url.startsWith('https')) {
					if (!url.startsWith('www.') && !url.endsWith('.com')) {
						url = 'http://' + url;
					}
				}
				if (url.length > 0 && (!url.endsWith('.png') || !url.endsWith('.jpg') || !url.endsWith('.jpeg'))) {
					sendMessage('The given link isn\'t directing to an image(.png/.jpg/.jpeg only).. Sorry ;r;');
					return;
				}
				if (url.length == 0) {
					if (msg.attachments.at(1) == null && msg.attachments.at(0) != null) {
						if (msg.attachments.at(0).url.endsWith('.png') || msg.attachments.at(0).url.endsWith('.jpg') || msg.attachments.at(0).url.endsWith('.jpeg')) {
							url = msg.attachments.at(0).url;
						} else {
							sendMessage('The attachment must be an image(.png/.jpg/.jpeg only).. Sorry ;n;');
							return;
						}
					} else if (msg.attachments.at(1) != null) {
						sendMessage('There can be only 1 attachment! Please try again ^3^');
						return;
					}
				}

				let date = new Date(Date.now());
				let dateStr = date.getUTCFullYear().toString() + '-' + date.getUTCMonth().toString() + '-' + date.getUTCDate().toString() + ' ' + date.getUTCHours().toString() + ':' + date.getUTCMinutes().toString() + ':' + date.getUTCSeconds().toString() + ' UTC';

				let system = { name:name, avatar:url, members:[], groups:[], color:'', token:generateToken(), created_on:dateStr };

				db[msg.author.id] = system;
				saveDB();
				sendMessage(`The system "${name}" has been successfully created! °w°\nTo create a new member, you can do \`va!member add\``);
			} else {
				sendMessage('You already have a system, so you cannot create a new one! °<° To delete it, please use `va!system delete`. ^w^');
			}
		} else if (subCommand === 'create' && !(args.length >= 0)) {
			sendMessage('Not enough or too much arguments!! ˋn´\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`');
		}
	}


	function authorIsOwner() {
		return msg.author.id == msg.guild.ownerId;
	}
	function authorIsDev() {
		return devIDs.includes(msg.author.id);
	}
	function authorIsMod() {
		return msg.member.roles.cache.has(modRoles[msg.guildId]);
	}

	function sendMessage(message, embeds, components) {
		msg.channel.send({
			content: message,
			components: components,
			embeds: embeds
		})
		.then()
		.catch(error => {
			console.error(error);
		});
	}
});

function saveDB() {
	fs.writeFile('./database.json', JSON.stringify(db), 'utf-8', function(error) {
		if (error) {
			console.error;
		}
	});
}
function generateToken() {
	let t = Math.floor(Math.random() * 999999).toString(36);
	let final = [];
		for (let i = 0; i < 4; i++) {
			if (t[i] != null) {
				final[i] = t[i];
			} else {
				final[i] = 0;
			}
		}
		return final.toString().replace(',', '').replace(',', '').replace(',', '');
}

function createEmbed(color, title, url, description, image, thumbnail, footer) {
	return new EmbedBuilder()
		.setColor(color)
		.setTitle(title)
		.setThumbnail(thumbnail)
		.setURL(url)
		.setDescription(description)
		.setImage(image)
		.setFooter({
			text: footer,
			iconURL: bot.user.displayAvatarURL()
		});
}
function createButton(emoji, style, label) {
	return new ButtonBuilder()
		.setEmoji(emoji)
		.setStyle(style)
		.setLabel(label)
}
function updateButtonStyle(buttonStyleArray, actionRowBuilder) {
	for (let i = 0; i < actionRowBuilder.components.length; i++) {
		actionRowBuilder.components.at(i).setStyle(buttonStyleArray[i]);
	}
	return actionRowBuilder;
}

bot.login(token);