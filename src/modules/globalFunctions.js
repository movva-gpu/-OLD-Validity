const { Message, Embed, Component, Channel, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');

const modRoles = require('../../data/modRoles.json');
const { avatarURL, devIDs, allowedTokenChars } = require('../../config/conf.json');

module.exports = {
    /**
     * Allows to send a message with embeds and components in a certain channel
     * @function
     * @param {string} message
     * @param {Array<Embed>} embeds
     * @param {Array<Component>} components
     * @param {Channel} channel
     */
    sendFullMessage: function (message, embeds, components, channel) {
		channel.send({
			content: message,
			components: components,
			embeds: embeds
		}).then().catch(error => {
			console.error(error);
		});
	},
    /**
     * Allows to send a simple message in a certain channel
     * @function
     * @param {string} message
     * @param {Channel} channel
     */
    sendPartialMessage: function (message, channel) {
		channel.send(message).then().catch(error => {
			console.error(error);
		});
	},

    /**
     * @function
     * @param {Message} message
     * @returns {boolean} if the author of the message is the Guild owner
    */
    authorIsOwner: function (message) {
		return message.author.id == message.guild.ownerId;
	},
     /**
     * @function
     * @param {Message} message
     * @returns {boolean} if the author of the message is a developper
    */
	authorIsDev: function (message) {
		return devIDs.includes(message.author.id);
	},
    /**
     * @function
     * @param {Message} message
     * @returns {boolean} if the author of the message had the moderator role
    */
	authorIsMod: function (message) {
		return message.member.roles.cache.has(modRoles[message.guildId]);
	},

    /**
     * Saves the database into data/database.json
     * @function
     * @param {object} db
    */
    saveDB: function (db) {
        fs.writeFile('../data/database.json', JSON.stringify(db), 'utf-8', function (error) {
          if (error) {
            console.log(error);
          }
        });
      },
    /**
     * Saves the token-id database into data/token-id.json
     * @function
     * @param {object} tokenIdDB
    */
    saveIdDB: function (tokenIdDB) {
        fs.writeFile('../data/token-id.json', JSON.stringify(tokenIdDB), 'utf-8', function (error) {
            if (error) {
                console.error;
            }
        });
    },

    /**
     * Create a new EmbedBuilder instance
     * @param {string} color
     * @param {string} title
     * @param {string} url
     * @param {string} description
     * @param {string} image
     * @param {string} thumbnail
     * @param {string} footer
     * @returns {EmbedBuilder} The new EmbedBuilder instance
     */
    createEmbed: function (color, title, url, description, image, thumbnail, footer) {
        return new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setThumbnail(thumbnail)
            .setURL(url)
            .setDescription(description)
            .setImage(image)
            .setFooter({
                text: footer,
                iconURL: avatarURL
            });
    },
    /**
     * Create a new ButtonBuilder instance
     * @param {string} emoji
     * @param {ButtonStyle} style
     * @param {string} label
     * @returns {ButtonBuilder} The new ButtonBuilder instance
     */
    createButton: function (emoji, style, label) {
        return new ButtonBuilder()
            .setEmoji(emoji)
            .setStyle(style)
            .setLabel(label);
    },
    /**
     * Allows to update a ButtonStyle of a buttone while an interaction
     * @param {Array<ButtonStyle>} buttonStyleArray - An array of all the new styles for the buttons (must match the length of actionRowBuilder)
     * @param {ActionRowBuilder} actionRowBuilder - The row of buttons to be updated
     * @returns {ActionRowBuilder} The updated row
     */
    updateButtonStyle: function (buttonStyleArray, actionRowBuilder) {
        for (let i = 0; i < actionRowBuilder.components.length; i++) {
            actionRowBuilder.components.at(i).setStyle(buttonStyleArray[i]);
        }
        return actionRowBuilder;
    },
    /**
     * Allows generate a token for a Member, a Group or a System
     * @returns {string} The token
     */
    generateToken: function () {
        let result = '';
        for (let i = 0; i < 4; i++) {
          result += allowedTokenChars.charAt(Math.floor(Math.random() * allowedTokenChars.length));
        }
        return result;
      }
};
