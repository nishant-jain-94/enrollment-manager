const { google } = require('googleapis');
const { getCalendarIdByTitle } = require('./CalendarList');
const { getClient } = require('./Oauth2Client');

const getCalendarEvents = async (calendarTitles) => {
  try {
    const oAuth2Client = await getClient();
    const calendar = google.calendar({
      version: 'v3',
      auth: oAuth2Client,
    });

    const eventsOfCalendars = await Promise.all(calendarTitles.map(async (calendarTitle) => {
      const calendarId = await getCalendarIdByTitle(calendarTitle);
      console.log('CalendarId');
      console.log(calendarId);
      let events;
      if (calendarId) {
        events = await calendar.events.list({
          calendarId,
          timeMin: (new Date()).toISOString(),
          maxResults: 100,
          singleEvents: true,
          orderBy: 'startTime',
        });
      }
      return events ? events.data : [];
    }));

    return [].concat(...eventsOfCalendars);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getCalendarEvents };
