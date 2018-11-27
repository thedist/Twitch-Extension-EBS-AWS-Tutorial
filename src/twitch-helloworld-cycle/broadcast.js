const request = require('request-promise');
const jwt = require('jsonwebtoken');

// Create and return a JWT for use by this service.
const makeServerToken = channelID => {
  const serverTokenDurationSec = 30;

  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    channel_id: channelID,
    user_id: process.env.ownerId,
    role: 'external',
    pubsub_perms: {
      send: ['*'],
    },
  };
  
  const secret = Buffer.from(process.env.secret, 'base64');
  return jwt.sign(payload, secret, { algorithm: 'HS256' });
};

const sendColorBroadcast = channelData => {
  // Set the HTTP headers required by the Twitch API.
  const bearerPrefix = 'Bearer ';
  const headers = {
    'Client-ID': process.env.clientId,
    'Content-Type': 'application/json',
    'Authorization': bearerPrefix + makeServerToken(channelData.channel),
  };

  // Create the POST body for the Twitch API request.
  const body = JSON.stringify({
    content_type: 'application/json',
    message: channelData.colour,
    targets: ['broadcast'],
  });

  // Send the broadcast request to the Twitch API.
  const options = {
    url: `https://api.twitch.tv/extensions/message/${channelData.channel}`,
    method: 'POST',
    headers,
    body
  };

  return request(options);
};

module.exports = channelData => {
  return sendColorBroadcast(channelData);
};