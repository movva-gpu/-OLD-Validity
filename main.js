/* eslint-disable prefer-const */
/* eslint-disable no-var */
const { Client, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const { token: token, prefix, devIDs } = require('./conf.json');
const modRoles = require('./modRoles.json');
var db = require('./database.json');

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
	// b.user.setPresence({ status: 'idle', activities: [{ name: 'Steven Universe', type:3 }] });
	// b.user.setAvatar('./avatar.png');
});

bot.on(Events.MessageCreate, async msg => {

	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	if (startsWith(msg, 'ping')) {
		// TODO: Remplacer par si rôle modération
		if (authorIsDev(msg) || authorIsOwner(msg) || authorIsMod(msg)) {
			msg.channel.send(`Between me and Discord there is ${bot.ws.ping}ms!`);
		} else {
			msg.channel.send('This command is reserved for devs and moderators.');
		}
	}

	if (startsWith(msg, 'setModRole') && authorIsOwner(msg)) {
		let modRoleID = msg.content.slice(prefix.length + 11, msg.content.length);
		if (!modRoleID.startsWith('<@&') && modRoleID.startsWith('<@')) {
			msg.channel.send('It seems you\'ve tried to mention a user instead of a role, please try again.\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`');
			return;
		}
		if (modRoleID.charAt(0) == '<' && modRoleID.charAt(1) == '@') {
			modRoleID = modRoleID.slice(3, modRoleID.length - 1);
		}

		msg.guild.roles.fetch(modRoleID).then(role => {
			if (role == null || role == undefined) {
				msg.channel.send('There was an error fecthing the role, please try again\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`');
			}

			let guildId = msg.guildId;
			modRoles[guildId] = modRoleID;
			fs.writeFile('./modRoles.json', JSON.stringify(modRoles, null, 4), 'utf-8', function(error) {
				if (error) {
					console.error;
				}
			});
		});
	}

	if (startsWith(msg, 'system')) {
		let com = msg.content.slice(prefix.length + 7, msg.content.length);
		if (com.startsWith('create')) {
			if (db[msg.author.id] == undefined || db[msg.author.id] == null) {
				let system = new Map(db[msg.author.id]);
				com = com.slice(7, com.length);
				if (com.length == 0) {
					await msg.channel.send('The `<name>` field must be at least 1 character long.\nCommand usage: `va!system create <name> [avatar URL]` (no `_` and no spaces in the URL)');
					return;
				}

				let arg = com.split(' ');
				if (arg.length > 2) {
					await msg.channel.send('There cannot be more than 2 arguments(use `_` for spaces).\nCommand usage: `va!system create <name> [avatar URL]` (no `_` and no spaces in the URL)');
					return;
				}
				let tmpArg;
				while (arg[0].includes('_')) {
					tmpArg = arg[0].replace('_', ' ');
					arg[0] = tmpArg;
				}
				if (arg[0].length < 80) {
					let date = new Date(Date.now());
					let dateStr = date.getUTCFullYear().toString() + '-' + date.getUTCMonth().toString() + '-' + date.getUTCDate().toString() + ' ' + date.getUTCHours().toString() + ':' + date.getUTCMinutes().toString() + ':' + date.getUTCSeconds().toString() + ' UTC';
					system = { name:arg[0], avatar:'', members:[], color:'', token:generateToken(), created_on: dateStr };
				} else if (arg[0].length > 80) {
					await msg.channel.send('The `<name>` field cannot be more than 80 character long.');
					return;
				}

				if (arg[1] != null) {
					if ((arg[1].startsWith('https://') || arg[1].startsWith('http://'))) {
						if (arg[1].endsWith('.png') || arg[1].endsWith('.jpg') || arg[1].endsWith('.jpeg')) {
							system.avatar = arg[1];
						} else {
							await msg.channel.send('The given link isn\'t directing to an image(.png/.jpg/.jpeg only).');
							return;
						}
					} else {
						await msg.channel.send('The second argument isn\'t a link(must start with `http://` or `https://`)\n Command usage: `va!system create <name> [avatar URL]` (no `_` and no spaces in the URL, use `_` for spaces of the name)');
						return;
					}
				} else if (arg[1] == null && msg.attachments.at(1) == null && msg.attachments.at(0) != null) {
					if (msg.attachments.at(0).url.endsWith('.png') || msg.attachments.at(0).url.endsWith('.jpg') || msg.attachments.at(0).url.endsWith('.jpeg')) {
						system.avatar = msg.attachments.at(0).url;
					} else {
						await msg.channel.send('The attachment must be an image(.png/.jpg/.jpeg only).');
						return;
					}
				} else if (msg.attachments.at(1) != null) {
					await msg.channel.send('There can be only 1 attachment.');
					return;
				}
				if (arg[1] != null && msg.attachments.at(0) != null) {
					await msg.channel.send('Don\'t use URL and attachment simultaneously.');
					return;
				}
				db[msg.author.id] = system;
				saveDB();
			} else {
				await msg.channel.send('You appear to already have a system. To delete a system please use `va!system delete`.');
			}
		}
	}
});

function startsWith(msg, command) {
	return msg.content.startsWith(prefix + command);
}
function authorIsOwner(msg) {
	return msg.author.id == msg.guild.ownerId;
}
function authorIsDev(msg) {
	return devIDs.includes(msg.author.id);
}
function authorIsMod(msg) {
	return msg.member.roles.cache.has(modRoles[msg.guildId]);
}


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

bot.login(token);