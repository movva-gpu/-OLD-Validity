const { defEmbedColor } = require('../../../../config/conf.json');
const { System } = require('../../classes.js');
const { createEmbed, sendFullMessage } = require('../../globalFunctions.js');

module.exports = {
    name: 'Show system',
    desc: 'Shows the information of a system',
    usage: 'va!system show [token]',
    execute (msg, db, tokenIdDB) {
        const system = System.from(db[msg.author.id]);
        let color = defEmbedColor;
        let systemColor = 'undefined, define one with `va!system color <color>`';
        let avatar = undefined;
        let banner = undefined;
        if (system.color.length != 0) {
            color = system.color;
            systemColor = color;
        }
        if (system.banner.length != 0) {
            banner = system.banner;
        }
        if (system.avatar.length != 0) {
            avatar = system.avatar;
        }

        const embed = createEmbed(color, system.name, undefined, null, banner, avatar, `Token: ${system.token} • Created on: ${system.date}`)
                        .addFields([
                            {
                                name: 'Color',
                                value: systemColor,
                                inline: true
                            },
                            {
                                name: `Members (${system.members.length})`,
                                value: 'To show the list, excecute `va!system list`',
                                inline: true
                            }
                        ]);
        sendFullMessage(undefined, [embed], undefined, msg.channel);
    }
};