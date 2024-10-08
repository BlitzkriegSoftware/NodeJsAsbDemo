'use strict';

/**
 * Error: AIS Configuration Error
 * @name AsqOperationError
 * @class
 * @classdesc ASQ Operation Error
 */
module.exports = class AsqOperationError extends Error {
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
      Error.captureStackTrace(this, AsqOperationError);
    }
    this.name = 'AsqOperationError';
    this.asqError = asqError;
  }
};
