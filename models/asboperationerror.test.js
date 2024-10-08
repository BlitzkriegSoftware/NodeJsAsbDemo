'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const Utility = require('../library/utility');

const AsbOperationError = require('./asboperationerror');
const { config } = require('yargs');

describe('AsbOperationError', () => {
  test('throw catch', () => {
    const asbError = 'Rats!';
    const message = 'Check connection string and queue name';
    try {
      throw new AsbOperationError(asbError, message);
    } catch (e) {
      if (e instanceof AsbOperationError) {
        expect(e.name == 'AsbOperationError').toBe(true);
        expect(e.asqError == asbError).toBe(true);
        expect(e.message == message).toBe(true);
      } else {
        fail('Not a specific instance of AsbOperationError');
      }
    }
  });
});
