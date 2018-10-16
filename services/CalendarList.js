const { google } = require('googleapis');
const { getClient } = require('./Oauth2Client');

const CalendarList = () => {
  let listOfCalendars = [];
  const getCalendarIdByTitle = async (calendarTitle) => {
    const matchedCalendars = listOfCalendars.filter(c => c.title === calendarTitle);
    if (matchedCalendars.length === 0) {
      const oauth2Client = await getClient();
      const calendar = google.calendar({
        version: 'v3',
        auth: oauth2Client,
      });
      const response = await calendar.calendarList.list();
      listOfCalendars = response.data.items;
      console.log('list of calendars');
      console.log(listOfCalendars);
      matchedCalendars.push(...listOfCalendars.filter(c => c.summary === calendarTitle));
      console.log('matchedCalendars');
      console.log(matchedCalendars);
    }
    return matchedCalendars[0] ? matchedCalendars[0].id : '';
  };
  return { getCalendarIdByTitle };
};

module.exports = CalendarList();
