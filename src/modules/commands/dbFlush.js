const { Message } = require('discord.js');

const { sendPartialMessage, saveDB, saveIdDB } = require('../globalFunctions.js');

module.exports = {
    name: 'Database flush',
    desc: 'Developper command.',
    usage: '',
    /**
    * @function
    * @param {Message} msg
    * @param {object} db
    * @param {object} tokenIdDB
    */
    execute (msg, db, tokenIdDB) {
        db = {};
        tokenIdDB = {};
        saveDB(db);
        saveIdDB(tokenIdDB);
        sendPartialMessage('Database flushed successfully! 🚽 o^o', msg.channel);
        return {
            db: db,
            tokenIdDB: tokenIdDB
        };
    }
};