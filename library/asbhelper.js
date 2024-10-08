'use strict';

const { v4: uuidv4 } = require('uuid');
const { DateTime } = require('luxon');

const Utility = require('./utility');
const AsqConfig = require('../models/asbconfig');
const AisConfigError = require('../models/aisconfigerror');
const AisParamError = require('../models/aisparamerror');
const AsbOperationError = require('../models/asboperationerror');

const { hasUncaughtExceptionCaptureCallback } = require('process');

const { ServiceBusClient, ServiceBusMessage } = require('@azure/service-bus');

/**
 * @name AsbHelper
 * @class
 * @classdesc Azure Service Bus Client Facade
 */
module.exports = class AsbHelper {
  /**
   * CTOR
   * @name AsqHelper#constructor
   * @constructor
   * @function
   * @param {AsqConfig} config
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Open
   * @name AsqHelper#open
   * @function
   * @argument {boolean} reset - default to false
   * @returns {void}
   */
  open(reset = false) {}

  /**
   * Close and dispose the underlying client, open() reverses this operation
   * @name AsqHelper#close
   * @function
   * @returns {void}
   */
  close() {}

  /**
   * Required content type
   * @function
   * @returns {string} - content type
   */
  static contentType() {
    return 'application/json';
  }

  /**
   * Is configuration valid
   * @name AsqHelper#isConfigValid
   * @function
   * @returns {boolean}
   */
  isConfigValid() {
    var c = AsqConfig.fromObject(this.config);
    return c.isValid();
  }

  /**
   * Test for validity
   * @name AsqHelper#isValid
   * @function
   * @returns {boolean}
   */
  isValid() {
    return this.isConfigValid();
  }

  /**
   * in most cases this can be infinity for the demo we set a limit
   * @function
   * @returns {number} - Max for demo
   */
  static maxWaitTimeMinutes() {
    return 60;
  }

  /**
   * Receive messages
   * @name AsqHelper#receive
   * @function
   * @param {number} minutesToWait - (required) Greater than one
   * @param {string} whoIam - (required) Name of process calling the receiver
   * @param {callback} messageProcessor - (required) function that matches required callback signature
   * @returns {void}
   */
  async receive(minutesToWait = 0, whoIam = '', messageProcessor) {
    const minutesToWaitMax = AsbHelper.maxWaitTimeMinutes();
    if (
      !Utility.isNumber(minutesToWait) ||
      minutesToWait <= 0 ||
      minutesToWait > minutesToWaitMax
    ) {
      throw new AisParamError(
        'minutesToWait',
        `Must be an integer 0..${minutesToWaitMax}`
      );
    }

    if (Utility.isBlank(whoIam)) {
      throw new AisParamError('whoIam', 'A "whoIam" is required');
    }

    if (
      messageProcessor == null ||
      !AsbHelper.validateReceiveMessageCallback(messageProcessor)
    ) {
      throw new AisParamError(
        'messageProcessor',
        'must be a function, that returns a promise, and has a single parameter "message"'
      );
    }

    if (!this.config.dryRun) {
      global.continueWork = true;
      setTimeout(() => {
        global.continueWork = false;
      }, minutesToWait * 1000);
      while (global.continueWork) {
        // logic here
      }
    }
  }

  /**
   * Send a message
   * @name AsqHelper#send
   * @function
   * @param {string} messageBody - (required) as json
   * @param {string} whoIam - (required) Name of application doing the sending (lowercase) (should match name in 'package.json') with an optional hyphen and a subsystem name (no punctuation or spaces, lowercase)
   * @param {number} [deliveryDelaySeconds=0] - (optional) to delay message
   * @param {string} [subject=''] - (optional) subject field
   * @param {string} [messageId=''] - (defaulted) auto-created as UUID if blank
   * @param {string} [correlationId=''] - (defaulted) auto-created as UUID if blank
   * @param {{}} [applicationProperties={}] - (optional) hashtable of message properties
   * @returns {message} - Message object as sent including with created properties
   * @throws {AisConfigError} - bad configuration
   * @throws {AisParamError} - bad parameter passed
   */
  async send(
    messageBody,
    whoIam,
    deliveryDelaySeconds = 0,
    subject = '',
    messageId = '',
    correlationId = '',
    applicationProperties = {}
  ) {
    // UTC http://en.wikipedia.org/wiki/ISO_8601 - Luxon Date/Time
    let schedDate = DateTime.utc();

    // Required properties
    if (!this.isValid() || Utility.isBlank(this.config.queue)) {
      throw new AisConfigError('queue', 'please supply a valid value');
    }

    if (Utility.isBlank(whoIam)) {
      throw new AisParamError('whoIam', 'A "whoIam" is required');
    }

    if (Utility.isBlank(messageBody)) {
      throw new AisParamError('messageBody', 'A "message" is required');
    }

    if (!Utility.isNumber(deliveryDelaySeconds)) {
      deliveryDelaySeconds = 0;
    }

    // defaulted properties
    if (Utility.isBlank(messageId)) {
      messageId = uuidv4();
    }

    if (Utility.isBlank(correlationId)) {
      correlationId = uuidv4();
    }

    let contentType = AsbHelper.contentType();

    // https://learn.microsoft.com/en-us/javascript/api/@azure/service-bus/servicebusmessage?view=azure-node-latest
    // https://www.google.com/search?q=javascript+ServiceBusMessage&rlz=1C1GCEA_enUS1090US1090&oq=javascript+ServiceBusMessage&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yDQgCEAAYhgMYgAQYigUyDQgDEAAYhgMYgAQYigUyDQgEEAAYhgMYgAQYigUyDQgFEAAYhgMYgAQYigUyDQgGEAAYhgMYgAQYigUyCggHEAAYgAQYogQyCggIEAAYgAQYogQyCggJEAAYogQYiQXSAQgzNTU5ajBqN6gCCLACAQ&sourceid=chrome&ie=UTF-8
    let message = {};
    try {
      message.body = messageBody;
      message.contentType = contentType;
      message.correlationId = correlationId;
      message.messageId = messageId;

      // Add optional properties
      if (!Utility.isBlank(subject)) {
        message.subject = subject;
      }

      if (
        applicationProperties != null &&
        Object.keys(applicationProperties).length
      ) {
        message.applicationProperties = applicationProperties;
      }

      if (deliveryDelaySeconds > 0) {
        schedDate = schedDate.plus({ seconds: deliveryDelaySeconds });
        schedDate = schedDate.toJSDate();
        message.scheduledEnqueueTimeUtc = schedDate;
      }
    } catch (e) {
      throw new AsbOperationError(e, 'Message is malformed, see error.');
    }

    let opts = { identifier: whoIam };

    // send
    if (!this.config.dryRun) {
      let client = null;
      let sender = null;
      try {
        client = new ServiceBusClient(this.config.connectionString);
        client.identifier = whoIam;
        sender = client.createSender(this.config.queue, opts);
        await sender.sendMessages(message);
      } catch (e) {
        throw new AsbOperationError(e, 'Check connection string or queue name');
      } finally {
        sender = null;
        if (sender != null) {
          await sender.close();
        }
        if (client != null) {
          await client.close();
        }
        client = null;
      }
    }

    // add non-sent properties for logging, etc.
    message.deliveryDelaySeconds = deliveryDelaySeconds;
    message.whoIam = whoIam;

    return message;
  }

  /**
   * Validate Receive Message Callback, must return a promise, and have required args
   * @param {*} callback
   */
  static validateReceiveMessageCallback(callback) {
    var flag =
      Utility.isFunction(callback) &&
      Utility.isPromise(callback) &&
      Utility.getFunctionArguments(callback).includes('message');
    return flag;
  }
};
