const jwt = require('jsonwebtoken');
const axios = require('axios');
const { google } = require('googleapis');

const OAuth2Client = () => {
  let oauth2Client;
  const payload = {
    iss: process.env.client_email,
    aud: 'https://www.googleapis.com/oauth2/v4/token',
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.readonly https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify',
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    iat: Math.floor(Date.now() / 1000) - 30,
  };

  const getClient = async () => {
    if (payload.exp < Date.now() || payload.exp === undefined) {
      payload.exp = Math.floor(Date.now() / 1000) + (60 * 60);
      payload.iat = Math.floor(Date.now() / 1000) - 30;
      const token = await jwt.sign(
        payload, process.env.private_key,
        { algorithm: 'RS256' },
      );
      const response = await axios.post(payload.aud, {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      });

      const authToken = response.data;
      oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials(authToken);
    }
    return oauth2Client;
  };
  return { getClient };
};

module.exports = OAuth2Client();
