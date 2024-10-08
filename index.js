'use strict';

/**
 * index.js - Entry Point
 * @name   Index
 * @module ApplicationRoot
 */

const fs = require('node:fs');
const fsp = require('fs').promises;
const path = require('path');
const { exitCode } = require('node:process');

const Utility = require('./library/utility');
const AsbHelper = require('./library/asbhelper');
const DemoMessage = require('./models/demomessage');
const AsbConfig = require('./models/asbconfig');

/**
 * Where is the app root folder?
 * @global
 */
global.appRoot = path.resolve(__dirname);
/**
 * Continue working or abort?
 * @global
 */
global.continueWork = false;

/**
 * handle SIGTERM signals gracefully
 */
process.on('SIGTERM', () => {
  const msg = 'Received SIGTERM, performing graceful shutdown.';
  shutdown(-1, msg);
});

/**
 * handle SIGQUIT signals gracefully
 */
process.on('SIGQUIT', () => {
  const msg = 'Received SIGQUIT, performing graceful shutdown.';
  shutdown(-2, msg);
});

/**
 * Orderly shutdown
 * @function
 * @param {number}} exitcode
 * @param {string} msg
 * @returns {void}
 */
function shutdown(exitcode, msg) {
  global.continueWork = false;
  if (!Utility.isNumber(exitcode)) {
    exitCode = 0;
  }
  if (!Utility.isBlank(msg)) {
    console.log(JSON.stringify(msg));
  }

  process.exit(exitcode);
}

/**
 * Message callback prototype
 * @function
 * @param {*} message
 * @returns {void}
 */
function messageCallback(message) {}

/**
 * Main() Async Entry Point
 */
async function main() {
  /**
   * Argument parsing
   */
  const yargs = require('yargs');

  const commandlineargs = yargs
    .option('c', {
      alias: 'config',
      describe: 'path to configuration file',
      type: 'string',
      demandOption: true
    })
    .option('s', {
      alias: 'send',
      describe: 'How many messages to make',
      type: 'number',
      demandOption: false
    })
    .option('r', {
      alias: 'receive',
      describe: 'Get messages for N minutes',
      type: 'number',
      demandOption: false
    }).argv;

  /**
   * Validate config file exists
   */
  if (!fs.existsSync(commandlineargs.config)) {
    const msg = `Unable to find '-config' file: $($options.config)`;
    shutdown(8, msg);
  }

  /**
   * Read config file
   */
  let asbconfig = new AsbConfig('', '', false);
  const data = fs.readFileSync(commandlineargs.config, 'utf8');
  asbconfig = AsbConfig.asConfig(data);
  asbconfig.dryRun = false;

  /**
   * Create helper
   */
  let asqhelper = new AsbHelper(asbconfig);

  /**
   * If invalid try getting from environment variables
   */
  if (!asqhelper.isValid()) {
    asbconfig.connectionString = process.env.AsbDemoConnection;
    asbconfig.queue = process.env.AsbDemoQueue;
    asqhelper = new AsbHelper(asbconfig);
  }

  /**
   * Still invalid, abort
   */
  if (!asqhelper.isValid()) {
    const msg =
      'Connection String or Queue name is invalid from file or environment variables';
    shutdown(6, msg);
  }

  /**
   * Validate send, default to zero
   */
  if (!Utility.isNumber(commandlineargs.send)) {
    commandlineargs.send = 0;
  }

  /**
   * Send >= zero
   */
  if (commandlineargs.send < 0) {
    commandlineargs.send = 0;
  }

  /**
   * Send Less than 20
   * */
  if (commandlineargs.send > 20) {
    const msg = 'Send can not exceed 20.';
    shutdown(4, msg);
  }

  /**
   * Validate receive minutes, default to zero
   */
  if (!Utility.isNumber(commandlineargs.receive)) {
    commandlineargs.receive = 0;
  }

  /**
   * receive less than 5 minutes
   */
  if (commandlineargs.receive > 5) {
    const msg = 'receive can not exceed 5 minutes';
    shutdown(5, msg);
  }

  /**
   * DO SEND
   */
  if (commandlineargs.send > 0) {
    var newDate = new Date();
    var stamp = Utility.makeStamp(newDate);
    var whoIam = 'test';
    for (let i = 0; i < commandlineargs.send; i++) {
      var delay = Math.round(Utility.dice(0, 600));
      var index = (i + 1).toString();
      var kind = 'Test';
      var body = `${stamp}; ${kind}; Index ${index}; ${delay}`;
      var message = new DemoMessage(kind, body);
      var json = message.toJson();
      await asqhelper.send(json, whoIam, delay);
    }
  }

  /**
   * DO Receive
   */
  if (commandlineargs.receive > 0) {
    asqhelper.receive(commandlineargs.receive, messageCallback);
  }
}

main();
shutdown(0, 'Normal Exit');
