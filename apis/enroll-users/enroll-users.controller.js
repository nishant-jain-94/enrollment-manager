const express = require('express');

const enrollmentRule = require('../../rules/enrollment-rules');
const loadCsvData = require('../../middlewares/loadCsvData.middleware');
const UserModel = require('../../models/user.model');
const { errorHandler, status404Handler, upload } = require('../../middlewares');

const router = express.Router();

const normalizeUser = user => ({
  associateId: user['Associate ID'],
  name: user.Name,
  batch: user.Batch,
  stack: user.Stack ? user.Stack : 'MEAN',
  overallScore: +user['Overall Score'].slice(0, -1),
  uiLayer: +user['UI Layer'].slice(0, -1),
  mwLayer: +user['MW Layer'].slice(0, -1),
  lgLayer: +user['Lg Layer'].slice(0, -1),
});

router.post('/users', upload, loadCsvData, async (req, res, next) => {
  try {
    const users = req.file.data;
    const normalizedUsers = users.map(normalizeUser);
    const usersWithAssignedModules = await Promise.all(normalizedUsers.map(async (normalizedUser) => {
      const enrollments = await enrollmentRule.run(normalizedUser);
      const eligibleModuleTypes = enrollments.map(enrollment => enrollment.type);
      const eligibleModules = eligibleModuleTypes.map(type => `${normalizedUser.stack}_${type}`);
      return {
        ...normalizedUser,
        eligibleModuleTypes,
        eligibleModules,
      };
    }));
    const enrolledUsers = await UserModel.enrollUsers(usersWithAssignedModules);
    res.json(enrolledUsers);
  } catch (err) {
    next(err);
  }
});

router.use(status404Handler);
router.use(errorHandler);

module.exports = router;
