'use strict';

/**
 * Error: AIS Configuration Error
 * @name AisParamError
 * @class
 * @classdesc Parameter Error
 */
module.exports = class AisParamError extends Error {
  /**
   * CTOR, these are the fields
   * @name AisParamError#constructor
   * @function
   * @param {string} paramName - Name of missing parameter
   * @param {string} message    - Helpful correction
   */
  constructor(paramName = '(?)', ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AisParamError);
    }
    this.name = 'AisParamError';
    this.paramName = paramName;
  }
};
