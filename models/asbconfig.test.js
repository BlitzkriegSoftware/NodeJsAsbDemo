'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const Utility = require('../library/utility');

const AsbConfig = require('./asbconfig');

describe('Config class', () => {
  /**
   * TEST: format Config
   */
  test('Config string', () => {
    const config = new AsbConfig('connectionstring', 'queue', false);
    const text = config.toString();
    expect(text.includes(';')).toBe(true);
  });

  /**
   * TEST: From JSON
   */
  test('fromJson (ok)', () => {
    let model = new AsbConfig('connectionstring', 'queue', false);
    expect(model.isValid()).toBe(true);
    let json = JSON.stringify(model);
    let p2 = AsbConfig.fromJson(json);
    expect(p2.isValid()).toBe(true);
    expect(model.connectionString == p2.connectionString).toBe(true);
    expect(model.queue == p2.queue).toBe(true);
  });

  /**
   * TEST: From JSON
   */
  test('fromJson (bad)', () => {
    let config = null;
    try {
      let json = JSON.stringify(config);
      let p2 = AsbConfig.fromJson(json);
      expect(p2 == null).toBe(true);
    } catch (e) {
      console.log(e);
    }
  });

  /**
   * TEST: From Object
   */
  test('fromObject (ok)', () => {
    let config = new AsbConfig('connectionstring', 'queue', false);
    expect(config.isValid()).toBe(true);
    let p2 = AsbConfig.fromObject(config);
    expect(p2.isValid()).toBe(true);
    expect(config.connectionString == p2.connectionString).toBe(true);
    expect(config.queue == p2.queue).toBe(true);
  });

  test('fromObject (bad)', () => {
    let config = null;
    try {
      const o = {};
      let p2 = Config.fromObject(o);
      expect(p2.isValid()).toBe(false);
    } catch (e) {}
  });

  test('fromObject (null)', () => {
    let config = null;
    try {
      const o = null;
      let p2 = Config.fromObject(o);
      expect(p2.isValid()).toBe(false);
    } catch (e) {}
  });

  test('asConfig', () => {
    const o = {
      connectionString:
        'Endpoint=sb://foo.servicebus.windows.net/;SharedAccessKeyName=someKeyName;SharedAccessKey=someKeyValue',
      queue: 'testqueue'
    };

    const json = JSON.stringify(o);

    let config = AsbConfig.asConfig(json);

    expect(o.connectionString == config.connectionString).toBe(true);
  });
});
