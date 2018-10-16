require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
const userController = require('./apis/enroll-users/enroll-users.controller');
const eventsController = require('./apis/events/events.controller');

const app = express();

mongoose.connect(`${config.MONGODB_URL}/users`, { useNewUrlParser: true });

app.use(cors());
app.use('/enroll', userController);
app.use('/events', eventsController);

module.exports = app;
