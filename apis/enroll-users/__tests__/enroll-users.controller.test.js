require('should');
const path = require('path');
const express = require('express');
const request = require('supertest');

jest.mock('../../../models/user.model');

const enrollUserController = require('../enroll-users.controller');

const app = express();
app.use('/enroll', enrollUserController);

describe('Enroll Users', () => {
  test('Should return 200 when uploading empty csv file', (done) => {
    request(app)
      .post('/enroll/users')
      .field('Content-Type', 'multipart/form-data')
      .attach('users', path.join(__dirname, './empty.csv'))
      .expect(200)
      .end(done);
  });

  test('Should be able to upload csv file', (done) => {
    request(app)
      .post('/enroll/users')
      .field('Content-Type', 'multipart/form-data')
      .attach('users', path.join(__dirname, './test.csv'))
      .expect(200)
      .end((err, res) => {
        res.body.length.should.be.exactly(1);
        const enrolledUser = res.body[0];
        enrolledUser.should.have.properties(['associateId', 'name', 'batch', 'stack', 'overallScore', 'uiLayer', 'mwLayer', 'lgLayer']);
        enrolledUser.name.should.be.exactly('Test User');
        enrolledUser.associateId.should.be.exactly('428342');
        enrolledUser.overallScore.should.be.exactly(58);
        enrolledUser.uiLayer.should.be.exactly(43);
        enrolledUser.mwLayer.should.be.exactly(57);
        enrolledUser.lgLayer.should.be.exactly(76);
        enrolledUser.eligibleModuleTypes.should.be.an.instanceOf(Array);
        enrolledUser.eligibleModuleTypes[0].should.be.exactly('FSD_EXPRESS');
        enrolledUser.eligibleModules.should.be.an.instanceOf(Array);
        enrolledUser.eligibleModules[0].should.be.exactly('MEAN_FSD_EXPRESS');
        done(err, res);
      });
  });

  test('Should throw 404 when the route is not found', (done) => {
    request(app)
      .get('/enroll/resourceWhichDoesntExist')
      .expect(404)
      .end(done);
  });
});
