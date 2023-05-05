const fs = require('fs');

const { sendPartialMessage } = require('../globalFunctions.js');
const modRoles = require('../../../data/modRoles.json');

module.exports = {
  name: 'Set mod role',
  desc: 'Sets the moderator role for the bot.',
  usage: 'va!setmodrole <roleID/@role>',
  execute(args, msg) {
    const modRoleIdentifier = args.shift();
				let modRoleID;
				if (modRoleIdentifier.startsWith('<@&')) {
					modRoleID = modRoleIdentifier.slice(3, modRoleIdentifier.length - 1);
				} else if (modRoleIdentifier.startsWith('<@')) {
					sendPartialMessage('It seems you\'ve tried to mention a user instead of a role °o°, please try again! ^w^\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`', msg.channel);
					return;
				} else {
					modRoleID = modRoleIdentifier;
				}

				msg.guild.roles.fetch(modRoleID).then(role => {
					if (role == undefined || role == undefined) {
						sendPartialMessage('There was an error fecthing the role. °-° Please try again! ^^\nCommand usage: `va!setModRole @modRole` or `va!setModRole <modRoleID>`', msg.channel);
					}
		
					let guildId = msg.guildId;
					modRoles[guildId] = modRoleID;
					fs.writeFile('./modRoles.json', JSON.stringify(modRoles, undefined, 4), 'utf-8', function(error) {
						if (error) {
							console.error;
						}
					});
					sendPartialMessage('Moderator role defined successfully!! ^w^', msg.channel);
				});
  }
};