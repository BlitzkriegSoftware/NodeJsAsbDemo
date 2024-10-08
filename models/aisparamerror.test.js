'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const Utility = require('../library/utility');

const AisParamError = require('./aisparamerror');
const { config } = require('yargs');

describe('AisParamError', () => {
  test('throw catch', () => {
    const paramName = 'myparam';
    const message = 'Please supply a valid parameter value';
    try {
      throw new AisParamError(paramName, message);
    } catch (e) {
      if (e instanceof AisParamError) {
        expect(e.name == 'AisParamError').toBe(true);
        expect(e.paramName == paramName).toBe(true);
        expect(e.message == message).toBe(true);
      } else {
        fail('Not a specific instance of AisParamError');
      }
    }
  });
});
