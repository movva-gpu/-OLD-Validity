const { Message } = require('discord.js');

const { System } = require('../../classes.js');
const { sendPartialMessage, generateToken, saveDB, saveIdDB } = require('../../globalFunctions.js');

module.exports = {
    name: 'Create',
    desc: 'A command that allows you to create your own system! ^^',
    usage: '`va!create <name> [avatarURL]` You can also attach the image (the avatar won\'t work anymore if you delete the message. :3',
    /**
     * @function
     * @param {Array} args 
     * @param {Message} msg
     * @param {object} db
     * @param {object} tokenIdDB
    */
    execute(args, msg, db, tokenIdDB) {
        let name = '';
        let avatarUrl = '';
        for (let i = 0; i < args.length; i++) {
            if (!args[i].startsWith('http') && !args[i].includes('.')) {
                name += args[i] + ' ';
            } else {
                avatarUrl = args.slice(i).join(' ');
                break;
            }
        }
        name = name.trim();
        if (avatarUrl.length > 0 && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('https')) {
            if (!avatarUrl.startsWith('www.') && !avatarUrl.endsWith('.com')) {
                avatarUrl = 'http://' + avatarUrl;
            }
        }
        if (avatarUrl.length > 0 && (!avatarUrl.endsWith('.png') || !avatarUrl.endsWith('.jpg') || !avatarUrl.endsWith('.jpeg'))) {
            sendPartialMessage('The given link isn\'t directing to an image(.png/.jpg/.jpeg only).. Sorry ;r;', msg.channel);
            return;
        }
        if (avatarUrl.length == 0) {
            if (msg.attachments.at(1) == undefined && msg.attachments.at(0) != undefined) {
                if (msg.attachments.at(0).url.endsWith('.png') || msg.attachments.at(0).url.endsWith('.jpg') || msg.attachments.at(0).url.endsWith('.jpeg')) {
                    avatarUrl = msg.attachments.at(0).url;
                } else {
                    sendPartialMessage('The attachment must be an image(.png/.jpg/.jpeg only).. Sorry ;n;', msg.channel);
                    return;
                }
            } else if (msg.attachments.at(1) != undefined) {
                sendPartialMessage('There can be only 1 attachment! Please try again ^3^', msg.channel);
                return;
            }
        }

        const date = new Date(Date.now());
        const dateStr = date.getUTCFullYear().toString() + '-' + date.getUTCMonth().toString() + '-' + date.getUTCDate().toString() + ' ' + date.getUTCHours().toString() + ':' + date.getUTCMinutes().toString() + ':' + date.getUTCSeconds().toString() + ' UTC';
        const token = generateToken();
        const system = new System(name, avatarUrl, '', [], [], '', token, dateStr);
        db[msg.author.id] = system.toJSON();
        tokenIdDB[token] = msg.author.id;
        saveDB(db);
        saveIdDB(tokenIdDB);
        sendPartialMessage(`The system "${name}" has been successfully created! °w°\nTo create a new member, you can do \`va!member add\``, msg.channel);
        return {
            db: db,
            tokenIdDB: tokenIdDB
        };
    }
};