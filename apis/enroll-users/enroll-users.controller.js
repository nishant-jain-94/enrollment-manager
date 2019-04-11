const express = require('express');
const Json2csvParser = require('json2csv').Parser;

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

router.get('/users/csv', async (req, res, next) => {
  try {
    const fields = [
      {
        label: 'Associate ID',
        default: 'NA',
        value: 'associateId',
      },
      {
        label: 'name',
        default: 'NA',
        value: 'name',
      },
      {
        label: 'Batch',
        default: 'NA',
        value: 'batch',
      },
      {
        label: 'Stack',
        default: 'NA',
        value: 'stack',
      },
      {
        label: 'Overall Score',
        default: 'NA',
        value: 'overallScore',
      },
      {
        label: 'UI Layer',
        default: 'NA',
        value: 'uiLayer',
      },
      {
        label: 'MW Layer',
        default: 'NA',
        value: 'mwLayer',
      },
      {
        label: 'LG Layer',
        default: 'NA',
        value: 'lgLayer',
      },
      {
        label: 'Eligible Modules',
        default: 'NA',
        value: row => row.eligibleModules.join(','),
      },
      {
        label: 'Enrolled Event',
        default: 'Yet To Enroll',
        value: (row) => {
          if (row.enrolledEvents.length === 0) {
            return undefined;
          }
          return row.enrolledEvents.map(e => `${e.summary}-${e.start.dateTime}`).join(',');
        },
      },
    ];
    const parser = new Json2csvParser({ fields });
    const enrolledUsers = await UserModel.find({}).exec();
    const csv = parser.parse(enrolledUsers);
    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
});

router.use(status404Handler);
router.use(errorHandler);

module.exports = router;
