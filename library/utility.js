'use strict';

const path = require('path');
const fs = require('node:fs');
const os = require('os');
const validator = require('validator');

/**
 * @class
 * @name Utility
 * @classdesc General Purpose Utility
 * @summary
 * requires 'global.appRoot'
 */
module.exports = class Utility {
  /**
   * Adds time to a date. Modelled after MySQL DATE_ADD function.
   * Example: dateAdd(new Date(), 'minutes', 30)  //returns 30 minutes from now.
   * @see {@link https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object}
   * @function
   * @param date  - Date to start with
   * @param unit  - One of: year, quarter, month, week, day, hour, minute, second
   * @param interval - amount of date/time to add
   * @returns {date} - Date increments or 'undefined' on error
   */
  static dateAdd(date, unit, interval) {
    if (!(date instanceof Date)) {
      throw new Error('Passed "date" is not a valid javascript date');
    }
    var ret = new Date(date); //don't change original date
    var checkRollover = function () {
      if (ret.getDate() != date.getDate()) ret.setDate(0);
    };
    switch (String(unit).toLowerCase()) {
      case 'year':
        ret.setFullYear(ret.getFullYear() + interval);
        checkRollover();
        break;
      case 'month':
        ret.setMonth(ret.getMonth() + interval);
        checkRollover();
        break;
      case 'day':
        ret.setDate(ret.getDate() + interval);
        break;
      case 'hour':
        ret.setTime(ret.getTime() + interval * 3600000);
        break;
      case 'minute':
        ret.setTime(ret.getTime() + interval * 60000);
        break;
      case 'second':
        ret.setTime(ret.getTime() + interval * 1000);
        break;
      default:
        throw new Error(
          `'unit' of ${unit} is invalid must be year, quarter, month, week, day, hour, minute, second`
        );
    }
    return ret;
  }

  /**
   * Generates a number between min (inclusive) and max (exclusive)
   * @function
   * @param {number} - low
   * @param {number} - high
   * @returns {number}
   */
  static dice(low, high) {
    return Math.random() * (high - low) + low;
  }

  /**
   * Creates a folder if it does not exist
   * @name Utility#ensureFolderExists
   * @function
   * @param {String} folder - Path to folder we want
   * @returns {null} - none
   */
  static ensureFolderExists(folder) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  /**
   * Gets the argument array for a function
   * @see {@link https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically}
   * @param {*} func
   * @returns {Array} - of function arguments
   */
  static getFunctionArguments(func) {
    return (func + '')
      .replace(/[/][/].*$/gm, '') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
      .split('){', 1)[0]
      .replace(/^[^(]*[(]/, '') // extract the parameters
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .replace(')', '') // remove trailing end paren
      .split(',')
      .filter(Boolean); // split & filter [""]
  }

  /**
   * True if is falsy or just whitespace
   * @name Utility#isBlank
   * @function
   * @param {String} str
   * @returns {Boolean} isNullOrWhitespace
   */
  static isBlank(text) {
    return !text || /^\s*$/.test(text);
  }

  /**
   * Is passed parameter a function
   * @name Utility#isFunction
   * @function
   * @param {*} f - thing to test
   * @returns {boolean} - true if so
   */
  static isFunction(f) {
    return !!(f && f.call && f.apply);
  }

  /**
   * Tests to see if passed argument is a number
   * @name Utility#isNumber
   * @function
   * @param {*} value
   * @returns {boolean}
   */
  static isNumber(value) {
    return typeof value === 'number';
  }

  /***
   * Does function return a promise
   * @function
   * @param {*} f
   * @returns {boolean} - true if so
   */
  static isPromise(f) {
    let fText = Function.prototype.toString.call(f);
    return fText.indexOf('Promise') >= 0;
  }

  /**
   * Tests if an object is a string
   * @name Utility#isString
   * @function
   * @param {Object} o
   * @returns {Boolean} - true if so
   */
  static isString(o) {
    return Object.prototype.toString.call(o) === '[object String]';
  }

  /**
   * Makes a rotating filename when called into '$/logs/', makes folder if not exists
   * @name Utility#logFilename
   * @function
   * @param {Date} time
   * @param {Number} index
   * @returns {String} - log filename
   * @see {@link https://stackoverflow.com/questions/61650047/how-to-specify-rotated-file-location-by-using-rotating-file-stream|Log file path}
   */
  static logFilename(time, index) {
    const logFolder = path.join(global.appRoot, 'logs');
    Utility.ensureFolderExists(logFolder);
    const ext = '.log';
    let logFile = 'personapi.w3c';
    logFile = path.join(logFolder, logFile);
    if (!time) return logFile + ext;
    const stamp = Utility.makeStamp(time);
    logFile = [logFile, index, stamp, ext].join('-');
    return logFile;
  }

  /**
   * Makes a string timestamp from a date
   * @name Utility#makeStamp
   * @function
   * @param {Date} d - Date
   * @returns {String} - Timestamp from Date
   */
  static makeStamp(d) {
    const year = `${d.getFullYear()}`;
    let month = `${d.getMonth()}`;
    let day = `${d.getDate()}`;
    let hour = `${d.getHours()}`;
    let minute = `${d.getMinutes()}`;
    let second = `${d.getSeconds()}`;

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    if (hour.length < 2) hour = `0${hour}`;
    if (minute.length < 2) minute = `0${minute}`;
    if (second.length < 2) second = `0${second}`;

    return [year, month, day, hour, minute, second].join('-');
  }

  /**
   * True if prop exists and has a value
   * @name Utility#propIsValid
   * @function
   * @param {Object} o
   * @param {String} prop
   * @returns {Boolean}
   */
  static propIsValid(o, prop) {
    let isOk = false;

    if (o == null || prop == null) {
      return isOk;
    }

    if (Object.hasOwn(o, prop)) {
      const value = String(o[prop]);
      if (value != null && value.length > 0) {
        isOk = true;
      }
    }
    return isOk;
  }

  /**
   * Generates a temp filename
   * @name Utility#tempFile
   * @function
   * @param {String} name - Filename w/o path but with extension
   * @param {*} data - data to put in file
   * @param {String} encoding - defaults to utf8
   * @returns filename with path
   */
  static tempFile(name = 'filename', data = '', encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      const tempPath = os.tmpdir();
      fs.mkdtemp(tempPath, (err, folder) => {
        if (err) return reject(err);
        const file_name = path.join(folder, name);
        fs.writeFile(file_name, data, encoding, (error_file) => {
          if (error_file) return reject(error_file);
          resolve(file_name);
        });
      });
    });
  }

  /**
   * Returns a 'safer' string
   * @name Utility#toSafeString
   * @function
   * @param {String} text
   * @returns {String} - Trimmed, Cleaned up string
   */
  static toSafeString(text) {
    if (!text) {
      return '';
    }

    if (!Utility.isString(text)) {
      text = text.toString();
    }

    return validator.escape(validator.stripLow(text)).trim();
  }
};
