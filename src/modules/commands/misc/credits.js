const { Message } = require("discord.js");
const { sendFullMessage, createEmbed } = require("../../globalFunctions");
const { defEmbedColor, avatarURL, defFooter } = require('../../../../config/conf.json');

module.exports = {
    name: 'Credits',
    desc: 'Shows the credits.',
    usage: 'va!credits',
    /**
     * @function
     * @param {Message} msg
     */
    execute (msg) {
        const creditEmbed = createEmbed(defEmbedColor, 'Credits', null, null, null, avatarURL, defFooter)
            .addFields([
                {
                    name: 'Creator',
                    value: 'Allenyade • @just allenyade#2817 • @thecuthead'
                },
                {
                    name: 'Developers',
                    value: '• Allenyade'
                },
                {
                    name: 'Contributors',
                    value: '• No one'
                },
                {
                    name: 'Special thanks',
                    value: '• @Ske#6201 for PluralKit\n• Dana Terrace for *The Owl House* ,,,,(I just put that here because I love that show, it changed me forever (in a good way))\n• Myself for not giving up this project ~~(yet)~~.'
                },
            ]);
        sendFullMessage(undefined, [ creditEmbed ], undefined, msg.channel);
    }
};