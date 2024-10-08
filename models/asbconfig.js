'use strict';

const Utility = require('../library/utility');

/**
 * @name AsqConfig
 * @class
 * @classdesc Model of a Configuration in our System
 */
module.exports = class AsbConfig {
  /**
   * CTOR, these are the fields
   * @name AsqConfig#constructor
   * @function
   * @param {string} connectionString
   * @param {string} queue - name of queue
   * @param {boolean} [dryRun=false] - If true no integration
   */
  constructor(connectionString, queue, dryRun = false) {
    this.connectionString = connectionString;
    this.queue = queue;
    this.dryRun = dryRun;
  }

  /**
   * Semi-Colon separated list of fields for debugging
   * @static
   * @name AsqConfig#toString
   * @function
   * @param {Class} AsqConfig
   * @returns {String}
   */
  static toString(AsqConfig) {
    const s = `${AsqConfig.connectionString};${AsqConfig.queue};${AsqConfig.dryRun};`;
    return s;
  }

  /**
   * Parse json string into class instance
   * @static
   * @function
   * @param {json} text - configuration as json text
   * @returns {AsbConfig}
   */
  static asConfig(text) {
    let model = null;
    let o = JSON.parse(text);
    let cs = o.connectionString;
    let queue = o.queue;
    let dryRun = o.dryRun;
    model = new AsbConfig(cs, queue, dryRun);
    return model;
  }

  /**
   * For this instance return a Semi-Colon separated list of fields for debugging
   * @instance
   * @name AsqConfig#toString
   * @function
   * @function
   * @returns {String}
   */
  toString() {
    return AsbConfig.toString(this);
  }

  /**
   * Parse AsqConfig from Json
   * @static
   * @name AsqConfig#fromJson
   * @function
   * @param {String} json
   * @returns {AsbConfig} - AsqConfig or {null}
   */
  static fromJson(json) {
    let p = null;
    try {
      const o = JSON.parse(json);
      // console.log(Object.getOwnPropertyNames(o));
      p = new AsbConfig(o.connectionString, o.queue, o.dryRun);
    } catch (e) {
      p = null;
    }
    return p;
  }

  /**
   * Parse AsqConfig from Object
   * @static
   * @name AsqConfig#fromObject
   * @function
   * @param {Object} o
   * @returns {Class} AsqConfig
   */
  static fromObject(o) {
    let p = null;
    if (o == null) {
      p = null;
    } else {
      p = new AsbConfig(o.connectionString, o.queue, o.dryRun);
    }
    return p;
  }

  /**
   * Returns true if this AsqConfig has the required fields
   * @instance
   * @name AsqConfig#isValid
   * @function
   * @returns {Boolean}
   */
  isValid() {
    return (
      !Utility.isBlank(this.connectionString) && !Utility.isBlank(this.queue)
    );
  }
};
