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
      let events;
      if (calendarId) {
        events = await calendar.events.list({
          calendarId,
          timeMin: (new Date()).toISOString(),
          maxResults: 100,
          singleEvents: false,
        });
      }
      return events ? { ...events.data, calendarId } : {};
    }));

    return [].concat(...eventsOfCalendars);
  } catch (err) {
    console.log(err);
  }
};

const addAttendees = async (calendarId, event, attendee) => {
  const oAuth2Client = await getClient();
  const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client,
  });
  const response = await calendar.events.patch({
    calendarId,
    eventId: event.id,
    sendNotifications: true,
    sendUpdates: 'all',
    requestBody: {
      attendees: [...event.attendees, attendee],
      recurrence: event.recurrence,
    },
  });
  return response;
};

module.exports = { getCalendarEvents, addAttendees };
