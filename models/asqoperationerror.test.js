'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const Utility = require('../library/utility');

const AsqOperationError = require('./asqoperationerror');
const { config } = require('yargs');

describe('AsqOperationError', () => {
  test('throw catch', () => {
    const asqError = 'Rats!';
    const message = 'Check connection string and queue name';
    try {
      throw new AsqOperationError(asqError, message);
    } catch (e) {
      if (e instanceof AsqOperationError) {
        expect(e.name == 'AsqOperationError').toBe(true);
        expect(e.asqError == asqError).toBe(true);
        expect(e.message == message).toBe(true);
      } else {
        fail('Not a specific instance of AsqOperationError');
      }
    }
  });
});
