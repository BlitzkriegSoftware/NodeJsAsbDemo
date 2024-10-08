'use strict';

// https://jestjs.io/docs/getting-started
const { describe, expect, test } = require('@jest/globals');
const exp = require('constants');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const AsqConfig = require('../models/asbconfig');
const AsqHelper = require('./asbhelper');
const { help } = require('yargs');

const configTest = {
  connectionString:
    'Endpoint=sb://foo.servicebus.windows.net/;SharedAccessKeyName=someKeyName;SharedAccessKey=someKeyValue',
  queue: 'testqueue'
};

describe('asqhelper', () => {
  test('close-open', () => {
    let model = new AsqConfig(configTest.connectionString, configTest.queue);
    // For Testing
    model.dryRun = true;
    expect(model.isValid()).toBe(true);

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);
  });

  test('ctor (bad)', () => {
    let model = new AsqConfig(configTest.connectionString);
    model.dryRun = true;
    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);
    let ok = helper.isValid();
    expect(ok).toBe(false);
  });

  test('maxWaitTimeMinutes', () => {
    let mx = AsqHelper.maxWaitTimeMinutes();
    expect(mx > 0).toBe(true);
  });

  test('receive (bad mins)', async () => {
    let waitFor = 0;
    let whoIam = 'test';

    let model = new AsqConfig(configTest.connectionString, configTest.queue);

    // For Testing
    model.dryRun = true;

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);

    try {
      await helper.receive(waitFor, whoIam, processMessageGood);
    } catch (e) {
      expect(e.message.indexOf('Must') >= 0).toBe(true);
    }
  });

  test('receive (bad whoIam)', async () => {
    let waitFor = 5;
    let whoIam = '';

    let model = new AsqConfig(configTest.connectionString, configTest.queue);

    // For Testing
    model.dryRun = true;

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);

    try {
      await helper.receive(waitFor, whoIam, processMessageGood);
    } catch (e) {
      expect(e.message.indexOf('required') >= 0).toBe(true);
    }
  });

  test('receive (bad callback)', async () => {
    let waitFor = 5;
    let whoIam = 'test';

    let model = new AsqConfig(configTest.connectionString, configTest.queue);

    // For Testing
    model.dryRun = true;

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);

    try {
      await helper.receive(waitFor, whoIam, processMessageBad);
    } catch (e) {
      expect(e.message.indexOf('promise') >= 0).toBe(true);
    }
  });

  test('receive (good)', async () => {
    let waitFor = 0.001;
    let whoIam = 'test';

    let model = new AsqConfig(configTest.connectionString, configTest.queue);

    // For Testing
    model.dryRun = true;

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);

    await helper.receive(waitFor, whoIam, processMessageGood);
  });

  test('send (full)', async () => {
    let model = new AsqConfig(configTest.connectionString, configTest.queue);

    // For Testing
    model.dryRun = true;

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);

    let body = {
      f1: 'hello',
      f2: 'there'
    };

    let whoIam = 'test';

    let deliveryDelaySeconds = 0;

    let subject = 'test01';

    let messageId = uuidv4();
    let correlationId = uuidv4();

    let props = {
      p1: 'prop1',
      p2: 'prop2'
    };

    let contentType = AsqHelper.contentType();

    let result = await helper.send(
      body,
      whoIam,
      deliveryDelaySeconds,
      subject,
      messageId,
      correlationId,
      props
    );

    expect(result.contentType == contentType).toBe(true);
    expect(result.body == body).toBe(true);
    expect(result.subject == subject).toBe(true);
    expect(result.messageId == messageId).toBe(true);
    expect(result.correlationId == correlationId).toBe(true);
    expect(result.deliveryDelaySeconds == deliveryDelaySeconds).toBe(true);
    expect(result.whoIam == whoIam).toBe(true);

    console.log(result);
  });

  test('send (min)', async () => {
    let model = new AsqConfig(configTest.connectionString, configTest.queue);

    // For Testing
    model.dryRun = true;

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);

    let body = {
      f1: 'hello',
      f2: 'there'
    };

    let whoIam = 'test';

    let contentType = AsqHelper.contentType();

    let result = await helper.send(body, whoIam);

    expect(result.contentType == contentType).toBe(true);
    expect(result.body == body).toBe(true);
    expect(result.whoIam == whoIam).toBe(true);

    console.log(result);
  });

  test('send (min, delay)', async () => {
    let model = new AsqConfig(configTest.connectionString, configTest.queue);

    // For Testing
    model.dryRun = true;

    let helper = new AsqHelper(model);
    expect(helper != null).toBe(true);

    let payload = {
      f1: 'hello',
      f2: 'there'
    };

    let bodyJson = JSON.stringify(payload);

    let whoIam = 'test';

    let contentType = AsqHelper.contentType();
    let deliveryDelaySeconds = 60 * 1000;

    let result = await helper.send(bodyJson, whoIam, deliveryDelaySeconds);

    expect(result.contentType == contentType).toBe(true);
    expect(result.body == bodyJson).toBe(true);
    expect(result.deliveryDelaySeconds == deliveryDelaySeconds).toBe(true);
    expect(result.whoIam == whoIam).toBe(true);

    console.log(result);
  });
});

function processMessageGood(message) {
  return new Promise(function (resolve, reject) {
    resolve('start of new Promise');
    reject('rejected');
  });
}

function processMessageBad(sqaze, gubbins) {}
