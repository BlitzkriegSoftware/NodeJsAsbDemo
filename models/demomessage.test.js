'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const Utility = require('../library/utility');

const DemoMessage = require('./demomessage');

describe('Demo Message class', () => {
  /**
   * TEST: format DemoMessage
   */
  test('DemoMessage string', () => {
    const message = new DemoMessage('DoStuff', 'Stuff to do!', 6);
    const text = message.toString();
    expect(text.includes(';')).toBe(true);
  });

  /**
   * TEST: From JSON (good)
   */
  test('fromJson (good)', () => {
    let message = new DemoMessage('DoStuff', 'Stuff to do!');
    expect(message.isValid()).toBe(true);
    let json = JSON.stringify(message);
    let p2 = DemoMessage.fromJson(json);
    expect(p2.isValid()).toBe(true);
    expect(message.kind == p2.kind).toBe(true);
    expect(message.message == p2.message).toBe(true);
  });

  /**
   * TEST: From JSON (null)
   */
  test('fromJson (null)', () => {
    let message = null;
    try {
      let json = JSON.stringify(message);
      let p2 = DemoMessage.fromJson(json);
      expect(p2 == null).toBe(true);
    } catch (e) {
      console.log(e);
    }
  });

  /**
   * TEST: From Object (short)
   */
  test('fromObject (short)', () => {
    let message = new DemoMessage('DoStuff', 'Stuff to do!');
    expect(message.isValid()).toBe(true);
    let p2 = DemoMessage.fromObject(message);
    expect(p2.isValid()).toBe(true);
  });

  /**
   * TEST: From Object (long)
   */
  test('fromObject (long)', () => {
    let message = new DemoMessage('DoStuff', 'Stuff to do!', 6);
    expect(message.isValid()).toBe(true);
    let p2 = DemoMessage.fromObject(message);
    expect(p2.isValid()).toBe(true);
    expect(p2.retries == 6).toBe(true);
  });

  /**
   * TEST: From Object (null)
   */
  test('fromObject (null)', () => {
    try {
      const o = null;
      p2 = DemoMessage.fromObject(o);
      expect(p2.isValid()).toBe(false);
    } catch (e) {}
  });

  /**
   * TEST: From Object (invalid)
   */
  test('fromObject (invalid)', () => {
    try {
      const o = {};
      p2 = DemoMessage.fromObject(o);
      expect(p2.isValid()).toBe(false);
    } catch (e) {}
  });

  test('ToJson', () => {
    let message = new DemoMessage('DoStuff', 'Stuff to do!', 5);
    var json = message.toJson();
    expect(json.includes('}')).toBe(true);
  });
});
