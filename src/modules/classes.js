/**
 * Represents a system
 * @class
 */
class System {

    /**
     * Creates a new System instance
     * @param {string} name - The name of the system
     * @param {string} avatar - The URL of the system's avatar
     * @param {string} banner - The URL of the system's banner
     * @param {Array<Member>} members - The members of the system
     * @param {Array<Groups>} groups - The groups of the system
     * @param {string} color - The color of the system
     * @param {string} token - The token to identify the system
     * @param {string} date - The date the system was created
     */
    constructor (name, avatar, banner, members, groups, color, token, date) {
        this.name = name;
        this.avatar = avatar;
        this.banner = banner;
        this.members = members;
        this.groups = groups;
        this.color = color;
        this.token = token;
        this.date = date;
    }

    /**
     * Converts the System instance to JSON format
     * @function
     * @returns {object} The System instance as a JSON object
     */
    toJSON () {
        return {name: this.name, avatar: this.avatar, banner: this.banner, members: this.members, groups: this.groups, color: this.color, token: this.token, created_on: this.date};
    }

    /**
     * Creates a new System instance from a JSON object
     * @function
     * @static
     * @param {object} JSON - The JSON object to create the System instance from
     * @returns {System} The new System instance
     */
    static from (JSON) {
        return new System(JSON.name, JSON.avatar, JSON.banner, JSON.members, JSON.groups, JSON.color, JSON.token, JSON.created_on);
    }
}

/**
 * Represents a member
 * @class
 */
class Member {
    /**
     * Creates a new Member instance
     * @param {string} name - The name of the member
     * @param {string} displayname - The name of the member in the chat
     * @param {string} desc - Description of the member
     * @param {string} pronouns - The pronouns of the member
     * @param {string} avatar - The URL of the member's avatar
     * @param {string} banner - The URL of the member's banner
     * @param {string} color - The color of the member
     * @param {string} token - The token to identify the member
     * @param {string} date - The date the member was created
     */
    constructor (name, displayname, desc, pronouns, avatar, banner, color, token, date) {
        this.name = name;
        this.displayname = displayname;
        this.desc = desc;
        this.pronouns = pronouns;
        this.avatar = avatar;
        this.banner = banner;
        this.color = color;
        this.token = token;
        this.date = date;
    }

    /**
     * Converts the Member instance to JSON format
     * @function
     * @returns {object} The Member instance as a JSON object
     */
    toJSON () {
        return {name: this.name, displayname: this.displayname, desc: this.desc, pronouns: this.pronouns, avatar: this.avatar, banner: this.banner, color: this.color, token: this.token, created_on: this.date};
    }

    /**
     * Creates a new Member instance from a JSON object
     * @function
     * @static
     * @param {object} JSON - The JSON object to create the Member instance from
     * @returns {Member} The new Member instance
     */
    static from (JSON) {
        return new Member(JSON.name, JSON.displayname, JSON.desc, JSON.pronouns, JSON.avatar, JSON.banner, JSON.color, JSON.token, JSON.created_on);
    }
}

/**
 * Represents a group
 * @class
 */
class Group {
    /**
     * Creates a new Group instance
     * @param {string} name - The name of the group
     * @param {string} desc - Description of the group
     * @param {string} avatar - The URL of the group's avatar
     * @param {string} banner - The URL of the group's banner
     * @param {Array<string>} members - The members of the group, identified by an Array of tokens
     * @param {string} color - The color of the group
     * @param {string} token - The token to identify the group
     * @param {string} date - The date the group was created
     */
    constructor (name, desc, avatar, banner, members, color, token, date) {
        this.name = name;
        this.desc = desc;
        this.avatar = avatar;
        this.banner = banner;
        this.members = members;
        this.color = color;
        this.token = token;
        this.date = date;
    }

    /**
     * Converts the Group instance to JSON format
     * @function
     * @returns {object} The Group instance as a JSON object
     */
    toJSON () {
        return {name: this.name, displayname: this.displayname, desc: this.desc, pronouns: this.pronouns, avatar: this.avatar, banner: this.banner, members: this.members, color: this.color, token: this.token, created_on: this.date};
    }

    /**
     * Creates a new Group instance from a JSON object
     * @function
     * @static
     * @param {object} JSON - The JSON object to create the Group instance from
     * @returns {Group} The new Group instance
     */
    static from (JSON) {
        return new Group(JSON.name, JSON.displayname, JSON.desc, JSON.pronouns, JSON.avatar, JSON.banner, JSON.members, JSON.color, JSON.token, JSON.created_on);
    }
}

module.exports = {
    System,
    Member,
    Group
};
