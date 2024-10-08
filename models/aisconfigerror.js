'use strict';

/**
 * Error: AIS Configuration Error
 * @name AisConfigError
 * @class
 * @classdesc Configuration Error
 */
module.exports = class AisConfigError extends Error {
  /**
   * CTOR, these are the fields
   * @name AisConfigError#constructor
   * @function
   * @param {string} configName - Name of missing configuration element
   * @param {string} message    - Helpful correction
   */
  constructor(configName = '(?)', ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AisConfigError);
    }
    this.name = 'AisConfigError';
    this.configName = configName;
  }
};
