'use strict';

const Utility = require('../library/utility');

/**
 * @name DemoMessage
 * @class
 * @classdesc Model of a Message in our System
 */
module.exports = class DemoMessage {
  /**
   * CTOR, these are the fields
   * @name DemoMessage#constructor
   * @function
   * @param {string} kind
   * @param {string} message
   * @param {number} retries - default 0
   */
  constructor(kind, message, retries = 0) {
    this.kind = kind;
    this.message = message;
    this.retries = retries;
  }

  /**
   * Semi-Colon separated list of fields for debugging
   * @static
   * @memberof DemoMessage
   * @alias DemoMessage.toString - ({DemoMessage})
   * @param {Class} DemoMessage
   * @function
   * @returns {String}
   */
  static toString(Config) {
    const s = `${Config.kind};${Config.message};${Config.retries}`;
    return s;
  }

  /**
   * For this instance return a Semi-Colon separated list of fields for debugging
   * @instance
   * @memberof DemoMessage
   * @alias DemoMessage.toString - Self
   * @function
   * @returns {String}
   */
  toString() {
    return DemoMessage.toString(this);
  }

  /**
   * Parse Config from Json
   * @static
   * @memberof DemoMessage
   * @alias DemoMessage.fromJson - populate a new DemoMessage from given JSON
   * @function
   * @param {String} json
   * @returns {Class} DemoMessage or {null}
   */
  static fromJson(json) {
    let p = null;
    try {
      const o = JSON.parse(json);
      // console.log(Object.getOwnPropertyNames(o));
      let retries = 0;
      if (Utility.propIsValid(o, 'retries')) {
        retries = o.retries;
      }
      p = new DemoMessage(o.kind, o.message, retries);
    } catch (e) {
      p = null;
    }
    return p;
  }

  /**
   * Parse Config from Object
   * @static
   * @memberof DemoMessage
   * @alias DemoMessage.fromObject - Populate a new Config from given object
   * @function
   * @param {Object} o
   * @returns {Class} DemoMessage
   */
  static fromObject(o) {
    let p = null;
    if (o == null) {
      p = null;
    } else {
      let retries = 0;
      if (Utility.propIsValid(o, 'retries')) {
        retries = o.retries;
      }
      p = new DemoMessage(o.kind, o.message, retries);
    }
    return p;
  }

  /**
   * Returns true if this Config has the minumum fields: id, first, last
   * @instance
   * @memberof DemoMessage
   * @alias DemoMessage.isValid - True if required fields are present
   * @function
   * @returns {Boolean}
   */
  isValid() {
    return !Utility.isBlank(this.kind) && !Utility.isBlank(this.message);
  }

  /**
   * Converts to JSON
   * @function
   * @returns {string}
   */
  toJson() {
    return JSON.stringify(this);
  }
};
