"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Util_1 = require("../util/Util");
/**
 * Command class to extend to create commands users can execute
 * @param {CommandInfo} info - Object containing required command properties
 */
class Command {
    constructor(info = null) {
        /**
         * YAMDBF Client instance
         * @type {Client}
         */
        this.client = null;
        /**
         * The name of the command, used by the dispatcher
         * to determine the command being executed
         * @name Command#name
         * @type {string}
         */
        /**
         * A brief description of the command, displayed
         * in the commands list via the Help command
         * @name Command#desc
         * @type {string}
         */
        /**
         * An example of command usage. The token `<prefix>` will
         * be replaced by the guild-specific command prefix in the Help command when
         * `help <command>` is called
         * @name Command#usage
         * @type {string}
         */
        /**
         * Extra information about the command to be displayed
         * by the Help command when `help <command>` is called
         * @name Command#info
         * @type {string}
         */
        /**
         * The command group that the command belongs to. Allows commands to be
         * grouped for disabling. The group 'base' cannot be disabled.
         * @name Command#group
         * @type {string}
         */
        /**
         * Aliases the command can be called by other than its name
         * @name Command#aliases
         * @type {string[]}
         */
        /**
         * Whether or not a command can only be used within a
         * guild text channel
         * @name Command#guildOnly
         * @type {boolean}
         */
        /**
         * Whether or not the command is to be hidden from the
         * commands list via the default help command
         * @name Command#hidden
         * @type {boolean}
         */
        /**
         * Options for how arguments should be parsed.<br>
         * **See:** {@link ArgOpts}
         * @name Command#argOpts
         * @type {ArgOpts}
         */
        /**
         * Array of permissions required by the command
         * caller to be able to execute the command in
         * the guild the command is called in.
         *
         * If any permissions are provided the command's `guildOnly`
         * property will be automatically overridden to true
         * @name Command#callerPermissions
         * @type {external:PermissionResolvable[]}
         */
        /**
         * Array of permissions required by the client
         * to be able to execute the command in the guild
         * the command is called in.
         *
         * If any permissions are provided the command's `guildOnly`
         * property will be automatically overridden to true
         * @name Command#clientPermissions
         * @type {external:PermissionResolvable[]}
         */
        /**
         * Array of specific {@link external:Role} names required to use the command.
         * If the command caller has any (even just one) of the roles in the array,
         * they will be able to use the command.
         *
         * If any roles are provided the command's `guildOnly` property will be
         * automatically set to `true`
         *
         * >**Note:** This is far inferior to {@link Command#callerPermissions},
         * using the base `limit` command's role-limiting system, or really even
         * a custom-engineered solution to control who can use a command. Forcing
         * servers to create Roles with specific names makes your bot that much
         * less configurable on a per-guild basis, and configurability is what
         * YAMDBF is all about. But, for the sake of simplicity, this is available
         * @name Command#roles
         * @type {string[]}
         */
        /**
         * Whether or not the command can be used only by the client/bot owner(s).<br>
         * **See:** [Client#config.owner]{@link Client#config}
         * @name Command#ownerOnly
         * @type {boolean}
         */
        /**
         * Whether or not this command was registered via {@link CommandRegistry#registerExternal}
         * by some means other than the command loader like a Plugin
         * @name Command#external
         * @type {boolean}
         */
        // Middleware function storage for the Command instance
        this._middleware = [];
        this._initialized = false;
        if (info)
            Object.assign(this, info);
    }
    /**
     * The ratelimit for this command per user
     * @type {string}
     */
    get ratelimit() { return this._ratelimit; }
    set ratelimit(value) {
        Util_1.Util.parseRateLimit(value);
        this._ratelimit = value;
    }
    /**
     * Can be included in a command to initlialize any resources a command
     * needs at runtime that require things that are not available within
     * a command's constructor like the client instance or client/guild storages.
     *
     * Will be called after all commands are loaded (including those from
     * any loaded plugins) and after all base framework storages (client and guild)
     * are ready for use.
     *
     * >**Note:** Can be async if needed
     * @returns {Promise<void>}
     */
    init() { }
    /**
     * Action to be executed when the command is called. The following parameters
     * are what command actions will be passed by the {@link CommandDispatcher} whenever
     * a command is called. Be sure to receive these in proper order when writing
     * new commands
     * @param {external:Message} message Discord.js message object
     * @param {any[]} args An array containing the args parsed from the command calling message.<br>
     * 					   Will contain strings unless middleware is used to transform the args
     * @returns {any}
     */
    action(message, args) {
        message = null;
        args = null;
        throw new Error(`\`${this.constructor.name}\` has not overloaded the command action method`);
    }
    /**
     * Make necessary asserts for Command validity.
     * Called internally by the command loader
     * @private
     */
    _register(client) {
        this.client = client;
        // Set defaults if not present
        if (typeof this.aliases === 'undefined')
            this.aliases = [];
        if (typeof this.group === 'undefined')
            this.group = 'base';
        if (typeof this.guildOnly === 'undefined')
            this.guildOnly = false;
        if (typeof this.hidden === 'undefined')
            this.hidden = false;
        if (typeof this.argOpts === 'undefined')
            this.argOpts = {};
        if (typeof this.argOpts.separator === 'undefined')
            this.argOpts.separator = ' ';
        if (typeof this.callerPermissions === 'undefined')
            this.callerPermissions = [];
        if (typeof this.clientPermissions === 'undefined')
            this.clientPermissions = [];
        if (typeof this.roles === 'undefined')
            this.roles = [];
        if (typeof this.ownerOnly === 'undefined')
            this.ownerOnly = false;
        if (typeof this.external === 'undefined')
            this.external = false;
        if (typeof this._disabled === 'undefined')
            this._disabled = false;
        if (typeof this._classloc === 'undefined')
            this._classloc = '<External Command>';
        // Make necessary asserts
        if (!this.name)
            throw new Error(`A command is missing a name:\n${this._classloc}`);
        if (!this.desc)
            throw new Error(`A description must be provided for Command: ${this.name}`);
        if (!this.usage)
            throw new Error(`Usage information must be provided for Command: ${this.name}`);
        if (this.aliases && !Array.isArray(this.aliases))
            throw new TypeError(`Aliases for Command "${this.name}" must be an array of alias strings`);
        if (this.callerPermissions && !Array.isArray(this.callerPermissions))
            throw new TypeError(`\`callerPermissions\` for Command "${this.name}" must be an array`);
        if (this.clientPermissions && !Array.isArray(this.clientPermissions))
            throw new TypeError(`\`clientPermissions\` for Command "${this.name}" must be an array`);
        if (this.callerPermissions && this.callerPermissions.length)
            this._validatePermissions('callerPermissions', this.callerPermissions);
        if (this.clientPermissions && this.clientPermissions.length)
            this._validatePermissions('clientPermissions', this.clientPermissions);
        if (this.roles && !Array.isArray(this.roles))
            throw new TypeError(`\`roles\` for Command "${this.name}" must be an array`);
        if (!this.action || !(this.action instanceof Function))
            throw new TypeError(`Command "${this.name}".action: expected Function, got: ${typeof this.action}`);
        // Default guildOnly to true if permissions/roles are given
        if (!this.guildOnly && (this.callerPermissions.length
            || this.clientPermissions.length
            || this.roles.length))
            this.guildOnly = true;
    }
    /**
     * Whether or not this command is disabled
     * @type {boolean}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * Enable this command if it is disabled
     * @returns {void}
     */
    enable() {
        this._disabled = false;
    }
    /**
     * Disable this command if it is enabled
     * @returns {void}
     */
    disable() {
        this._disabled = true;
    }
    /**
     * Adds a middleware function to be used when the command is called
     * to make modifications to args, determine if the command can
     * be run, or anything else you want to do whenever this command
     * is called.
     *
     * See {@link MiddlewareFunction} for information on how a middleware
     * function should be represented
     *
     * Usage example:
     * ```
     * <Client>.use((message, args) => [message, args.map(a => a.toUpperCase())]);
     * ```
     * This will add a middleware function to this command that will attempt
     * to transform all args to uppercase. This will of course fail if any
     * of the args are not a string.
     *
     * >**Note:** Middleware functions should only be added to a command one
     * time each and thus should not be added within any sort of event or loop.
     * Multiple separate middleware functions can be added to the via multiple
     * separate calls to this method
     * @param {MiddlewareFunction} func The middleware function to use
     * @returns {Command}
     */
    use(func) {
        this._middleware.push(func);
        return this;
    }
    /**
     * Send provided response to the provided message's channel
     * via edit or send, depending on whether or not the client is
     * a selfbot
     * @protected
     * @param {external:Message} message Discord.js Message object
     * @param {string} response String to send
     * @param {external:MessageOptions} [options] Optional Discord.js MessageOptions
     * @returns {Promise<external:Message | external:Message[]>}
     */
    respond(message, response, options) {
        if (this.client.selfbot)
            return message.edit(response, options);
        return message.channel.send(response, options);
    }
    /**
     * Validate PermissionResolvables in the given array, throwing an error
     * for any that are invalid
     * @private
     */
    _validatePermissions(field, perms) {
        let errString = (i, err) => `Command "${this.name}" permission "${perms[i]}" in ${field}[${i}] is not a valid permission.\n\n${err}`;
        for (const [index, perm] of perms.entries())
            try {
                discord_js_1.Permissions.resolve(perm);
            }
            catch (err) {
                throw new TypeError(errString(index, err));
            }
    }
}
exports.Command = Command;

//# sourceMappingURL=Command.js.map