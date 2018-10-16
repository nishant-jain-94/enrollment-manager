const express = require('express');

const { getCalendarEvents } = require('../../services/CalendarEvents');
const User = require('../../models/user.model');

const router = express.Router();

router.get('/', getCalendarEvents);

router.get('/user/:associateId', async (req, res, next) => {
  const associate = await User.findOne({ associateId: req.params.associateId });
  const events = await getCalendarEvents(associate.eligibleModules);
  res.json(events);
});

module.exports = router;
