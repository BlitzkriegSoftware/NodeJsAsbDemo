'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const path = require('path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const Utility = require('../library/utility');
const exp = require('constants');
const utilNode = require('node:util');

const { error } = require('console');

describe('Utility class', () => {
  test('dateAdd (good)', () => {
    // year, month, day, hour, minute, second, ms
    const d = new Date(2014, 11, 2, 1, 2, 3, 0);

    let unit = 'year';
    let incBy = 1;
    let result = Utility.dateAdd(d, unit, incBy);
    let value = result.getFullYear();
    expect(value).toBe(2015);

    unit = 'month';
    incBy = -1;
    result = Utility.dateAdd(d, unit, incBy);
    value = result.getMonth();
    expect(value).toBe(10);

    unit = 'day';
    incBy = 3;
    result = Utility.dateAdd(d, unit, incBy);
    value = result.getDay();
    expect(value).toBe(5);

    unit = 'hour';
    incBy = 1;
    result = Utility.dateAdd(d, unit, incBy);
    value = result.getHours();
    expect(value).toBe(2);

    unit = 'minute';
    incBy = 1;
    result = Utility.dateAdd(d, unit, incBy);
    value = result.getMinutes();
    expect(value).toBe(3);

    unit = 'second';
    incBy = 2;
    result = Utility.dateAdd(d, unit, incBy);
    value = result.getSeconds();
    expect(value).toBe(5);
  });

  test('dateAdd (bad)', () => {
    // year, month, day, hour, minute, second, ms
    const d = new Date(2014, 11, 2, 1, 2, 3, 0);
    let unit = 'squids';
    let incBy = 1;
    try {
      let result = Utility.dateAdd(d, unit, incBy);
    } catch (e) {
      expect(e.message.indexOf('unit') >= 0).toBe(true);
    }

    const d2 = 'bannana';
    unit = 'minute';
    incBy = 1;
    try {
      let result = Utility.dateAdd(d2, unit, incBy);
    } catch (e) {
      expect(e.message.indexOf('"date"') >= 0).toBe(true);
    }
  });

  test('dice', () => {
    var v = Utility.dice(1, 100);
    expect(v >= 1 && v < 100).toBe(true);
  });

  test('ensureFolderExists', () => {
    const id = crypto.randomBytes(24).toString('hex');
    let folder = path.join(
      process.env.SystemDrive,
      'temp',
      'personapi-tests',
      id
    );

    Utility.ensureFolderExists(folder);
    expect(fs.existsSync(folder)).toBe(true);

    folder = path.join(folder, 'testresults');
    Utility.ensureFolderExists(folder);
    expect(fs.existsSync(folder)).toBe(true);
  });

  test('getFunctionArguments', () => {
    const fn0 = () => {};
    let result = Utility.getFunctionArguments(fn0);
    expect(result.length == 0).toBe(true);

    const fn1 = (x) => {};
    result = Utility.getFunctionArguments(fn1);
    expect(result.length == 1).toBe(true);
    expect(result[0] == 'x').toBe(true);

    const fn2 = (x, y, z) => {};
    result = Utility.getFunctionArguments(fn2);
    expect(result.length == 3).toBe(true);
    expect(result[0] == 'x').toBe(true);
    expect(result[1] == 'y').toBe(true);
    expect(result[2] == 'z').toBe(true);
  });

  test('isBlank', () => {
    let data = null;
    expect(data == null).toBe(true);
    expect(Utility.isBlank(data)).toBe(true);

    data = 'abc';
    expect(data == null).toBe(false);
    expect(Utility.isBlank(data)).toBe(false);
  });

  test('isFunction', () => {
    const f1 = () => {
      return true;
    };
    let flag = Utility.isFunction(f1);
    expect(flag).toBe(true);
    const x = 5;
    flag = Utility.isFunction(x);
    expect(flag).toBe(false);
    const d = {};
    flag = Utility.isFunction(d);
    expect(flag).toBe(false);
  });

  test('isNumber', () => {
    const t1 = 'abc';
    expect(Utility.isNumber(t1)).toBe(false);
    const t2 = 43;
    expect(Utility.isNumber(t2)).toBe(true);
  });

  test('isPromise', () => {
    const f1 = () => {
      return true;
    };
    let flag = Utility.isPromise(f1);
    expect(flag).toBe(false);

    flag = Utility.isPromise(promiseFunctionExample);
    expect(flag).toBe(true);

    const f3 = async () => {};
    flag = utilNode.types.isAsyncFunction(f3);
    expect(flag).toBe(true);
  });

  test('isString', () => {
    expect(Utility.isString(null)).toBe(false);
    expect(Utility.isString('moo')).toBe(true);
  });

  test('logFilename', () => {
    const id = crypto.randomBytes(24).toString('hex');
    const folder = path.join(
      process.env.SystemDrive,
      'temp',
      'personapi-tests',
      id
    );
    global.appRoot = folder;

    let logFile = Utility.logFilename(null, 1);
    expect(logFile.length > 0).toBe(true);

    let d = new Date(2024, 1, 2, 3, 4, 5, 6, 7);
    logFile = Utility.logFilename(d, 1);
    expect(logFile.length > 0).toBe(true);

    d = new Date(2024, 11, 12, 13, 14, 15, 16, 17);
    logFile = Utility.logFilename(d, 1);
    expect(logFile.length > 0).toBe(true);
  });

  test('makeStamp', () => {
    const d = new Date(2024, 1, 2, 3, 4, 5, 6, 7);
    const stamp = Utility.makeStamp(d);
    expect(stamp.length > 0).toBe(true);
  });

  test('propIsValid', () => {
    const f = 'foo';
    const v = 'boo';
    let o = null;
    expect(o == null).toBe(true);
    expect(Utility.propIsValid(o, f)).toBe(false);

    o = {};
    expect(Utility.propIsValid(o, f)).toBe(false);

    o[f] = v;
    expect(Utility.propIsValid(o, f)).toBe(true);

    o[f] = '';
    expect(Utility.propIsValid(o, f)).toBe(false);
  });

  test('tempFile', async () => {
    const filename = await Utility.tempFile('test', '');
    // console.log(`Filename: ${filename}`);
    expect(fs.existsSync(filename)).toBe(true);
  });

  test('toSafeString', () => {
    expect(Utility.toSafeString(null) == '').toBe(true);
    expect(Utility.toSafeString('moo') == 'moo').toBe(true);
    expect(Utility.toSafeString(99) == '99').toBe(true);
    expect(Utility.toSafeString('\u0006moo\u0007') == 'moo').toBe(true);
  });
});

function promiseFunctionExample() {
  return new Promise(function (resolve, reject) {
    resolve('start of new Promise');
  });
}
