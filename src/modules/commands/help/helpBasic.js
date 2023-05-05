const { ButtonStyle, ActionRowBuilder } = require('discord.js');

const { avatarURL, defEmbedColor, defFooter } = require('../../../../config/conf.json');
const { createEmbed, createButton, sendFullMessage, updateButtonStyle } = require('../../globalFunctions.js');

const system = {
	create: require('../system/create.js'),
	show: require('../system/show.js')
};

const setModRole = require('../setModRole.js');

module.exports = {
    name: 'Help',
    desc: 'The help command, it can be also used with an argument.',
    usage: 'va!help <command>',
    /**
     * @function
     * @param {Array} args
     * @param {Message} msg
    */
    excecute (msg) {
        const infoEmbed = createEmbed(defEmbedColor, 'Informations', null, 'Hello ^^! I\'m Validity and I\'m a Discord(TM) bot designed for plural systems/teams/communities/etc, allowing you to register a system, members of this system, groups, etc.', undefined, avatarURL, defFooter)
            .addFields([
                {
                    name: 'What are "*plural systems*"?',
                    value: 'According to [Pluralpedia](https://pluralpedia.org/w/System), a system is the collection of people and entities, often called headmates or alters, that share a single physical plural body.',
                },
                {
                    name: 'What is this bot for?',
                    value: 'It serves the exact same use as [PluralKit](https://pluralkit.me), depending on a defined tag, called a proxy, a message will be replaced by a fake account, with the name and the avatar defined by the member.',
                }
            ]);
        const basicEmbed = createEmbed(defEmbedColor, 'Basic Commands', null, 'Create a system with `va!system create <system name> [avatar URL]`! °w° (you can attach the picture instead u^u)\nAdd your first member with `va!member add <name> <avatar URL>`. -3-', undefined, undefined, defFooter);
        const listEmbed = createEmbed(defEmbedColor, 'Command List', null, null, undefined, undefined, defFooter)
            .addFields([
                {
                    name: 'Help',
                    value: 'The help command, it can be also used with an argument.\nUsage: `va!help <command>`'
                },
                {
                    name: 'System commands:',
                    value: `• Create: ${system.create.desc}\n Usage: ${system.create.usage}\n• Show: ${system.show.desc}\n U,,,,,sage: \`${system.show.usage}\``
                },
                {
                    name: setModRole.name,
                    value: `${setModRole.desc}\nUsage: \`${setModRole.usage}\``
                }
            ]);

        let infoButtonStyle = ButtonStyle.Primary;
        let basicButtonStyle = ButtonStyle.Secondary;
        let listButtonStyle = ButtonStyle.Secondary;
        let buttons = new ActionRowBuilder()
            .addComponents(
                createButton('ℹ️', infoButtonStyle, 'Informormations').setCustomId('info'),
                createButton('📄', basicButtonStyle, "Basic Commands").setCustomId('basic'),
                createButton('📜', listButtonStyle, 'Complete command List').setCustomId('list')
            );

        sendFullMessage(undefined, [infoEmbed], [buttons], msg.channel);

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
    }
};