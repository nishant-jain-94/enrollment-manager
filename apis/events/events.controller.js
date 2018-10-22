const express = require('express');
const bodyParser = require('body-parser');
const { getCalendarEvents, addAttendees } = require('../../services/CalendarEvents');
const User = require('../../models/user.model');

const router = express.Router();

router.get('/', getCalendarEvents);

router.get('/user/:associateId', async (req, res) => {
  const associate = await User.findOne({ associateId: req.params.associateId });
  const events = await getCalendarEvents(associate.eligibleModules);
  res.json(events);
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/user/:associateId/enroll', async (req, res) => {
  const { calendarId, event, attendee } = req.body;
  const response = await addAttendees(calendarId, event, attendee);
  const eventToBeAdded = { ...event, calendarId };
  await User.enrollUserToEvent(req.params.associateId, eventToBeAdded);
  res.json({ status: response.status });
});

router.get('/user/:associateId/enrolled', async (req, res) => {
  const { associateId } = req.params;
  const enrolledEvents = await User.getEnrolledEvents(associateId);
  res.json(enrolledEvents);
});

module.exports = router;
