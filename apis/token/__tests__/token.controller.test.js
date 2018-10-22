require('should');
const request = require('supertest');
const express = require('express');

jest.mock('../../../models/user.model.js');
jest.mock('../../../services/Email.js');

const tokenController = require('../token.controller');

const app = express();
app.use('/token', tokenController);

describe('Token Controller', () => {
  test('Should be able to send token', (done) => {
    request(app)
      .post('/token')
      .send({ associateId: '42323' })
      .expect(201)
      .end(done);
  });

  test('Should be able to throw status 404, when a route is not found', (done) => {
    request(app)
      .get('/token/resourceWhichDoesNotExist')
      .expect(404)
      .end(done);
  });
});
