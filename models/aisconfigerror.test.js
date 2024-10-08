'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const Utility = require('../library/utility');

const AisConfigError = require('./aisconfigerror');
const { config } = require('yargs');

describe('AisConfigError', () => {
  test('throw catch', () => {
    const configName = 'TestConfig';
    const message = 'Please supply a valid environment variable';
    try {
      throw new AisConfigError(configName, message);
    } catch (e) {
      if (e instanceof AisConfigError) {
        expect(e.name == 'AisConfigError').toBe(true);
        expect(e.configName == configName).toBe(true);
        expect(e.message == message).toBe(true);
      } else {
        fail('Not a specific instance of AisConfigError');
      }
    }
  });
});
