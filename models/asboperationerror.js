'use strict';

/**
 * Error: AIS Configuration Error
 * @name AsbOperationError
 * @class
 * @classdesc ASB Operation Error
 */
module.exports = class AsbOperationError extends Error {
  /**
   * CTOR, these are the fields
   * @name AsqOperationError#constructor
   * @function
   * @param {string} asqError - ASQ Error
   * @param {string} message    - Helpful correction
   */
  constructor(asqError = '(?)', ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AsbOperationError);
    }
    this.name = 'AsbOperationError';
    this.asqError = asqError;
  }
};
