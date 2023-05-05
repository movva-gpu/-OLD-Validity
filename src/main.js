const { Client, Events, GatewayIntentBits } = require('discord.js');

const { token, prefix, invitationLink } = require('../config/conf.json');

const { sendPartialMessage, authorIsDev, authorIsMod, authorIsOwner } = require('./modules/globalFunctions.js');
let db = require('../data/database.json');
let tokenIdDB = require('../data/token-id.json');

const bot = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	]});

const help = require('./modules/commands/help/helpBasic.js');

const system = {
	create: require('./modules/commands/system/create.js'),
	show: require('./modules/commands/system/show.js')
};

const dbFlush = require('./modules/commands/dbFlush.js');
const setModRole = require('./modules/commands/setModRole');

const credits = require('./modules/commands/misc/credits.js');

bot.once(Events.ClientReady, b => {
	console.log(`Client is ready. Logged in as ${b.user.id} -- ${b.user.tag}`);
	b.user.setPresence({ status: 'idle', activities: [{ name: 'The Owl House', type:3 }] });
	// b.user.setAvatar('./avatar.png');
});

bot.on(Events.MessageCreate, msg => {

	if (!msg.content.startsWith(prefix) || msg.author.bot || msg.channel == bot.user.dmChannel) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		sendPartialMessage(`There is ${bot.ws.ping}ms between me and Discord! °^°`, msg.channel);
	}

	if (command === 'setmodrole') {
		if (args.length == 1) {
			if (authorIsOwner(msg) || authorIsMod(msg)) {
				setModRole.execute(args, msg);
			} else {
				sendPartialMessage('This command is for moderators only, sorry.. :\'(', msg.channel);
			}
		} else {
			sendPartialMessage('Wrong arguments! `n´ :(\n' + `Command usage: \`${setModRole.usage}\``, msg.channel);
		}
	}

	if (command === 'help') {
		if (args.shift() == undefined) {
			help.excecute(msg);
		}
	}

	if (command === 'system') {
		if (args[0] != undefined) {
			const subCommand = args.shift().toLowerCase();
			if (subCommand === 'create') {
				if (args.length >= 1) {
					if (db[msg.author.id] == undefined) {
						const DBs = system.create.execute(args, msg, db, tokenIdDB);
						db = DBs.db;
						tokenIdDB = DBs.tokenIdDB;
					} else {
						sendPartialMessage('You already have a system! <3', msg.channel);
					}
				} else {
					sendPartialMessage('Not enough or too much arguments!! ˋn´\n' + `Command usage: \`${system.create.usage}\``, msg.channel);
				}
			}
			if (subCommand === 'show') {
				if (args.length == 0) {
					if (db[msg.author.id] != undefined) {
						system.show.execute(msg, db, tokenIdDB);
					}
				} else {
					sendPartialMessage('There shouln\'t be any any arguments on this command! :p\n' + `Command usage: \`${system.show.usage}\``, msg.channel);
				}
			}
		} else if (db[msg.author.id] != undefined) {
			system.show.execute(msg, db, tokenIdDB);
		}
	}

	if (command === 'credits') {
		credits.execute(msg);
	}

	if (command === 'dbflush' && authorIsDev(msg)) {
		const DBs = dbFlush.execute(msg, db, tokenIdDB);
		db = DBs.db;
		tokenIdDB = DBs.tokenIdDB;
	}

	if (command === 'kill' && authorIsDev(msg)) {
		bot.destroy();
	}

	if (command === 'invite') {
		sendPartialMessage('Here\'s the invitation link:' + invitationLink, msg.channel);
	}
});


bot.login(token);