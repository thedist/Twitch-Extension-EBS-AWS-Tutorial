const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });
const jwt = require('jsonwebtoken');
const color = require('color');

const verifyAndDecode = auth => {
  const bearerPrefix = 'Bearer ';
  if (!auth.startsWith(bearerPrefix)) return { err: 'Invalid authorization header' };
  try {
    const token = auth.substring(bearerPrefix.length);
    const secret = process.env.secret;
    return jwt.verify(token, Buffer.from(secret, 'base64'), { algorithms: ['HS256'] });
  } catch (err) {
    return { err: 'Invalid JWT' };
  }
};

const getChannelData = async channelID => {
  const params = {
    TableName: 'Twitch-Ext-HelloWorld',
    Key: { channel: channelID }
  };

  const channelData = await documentClient.get(params).promise();

  // If DynamoDB contains an item with the channelID, return it, otherwise create a new item.
  if (channelData.Item) return channelData.Item;

  const newEntry = {
    TableName: 'Twitch-Ext-HelloWorld',
    Item: {
      channel: channelID,
      colour: '#6441A4',
      userCooldowns: [],
      channelCooldown: 0
    }
  };

  await documentClient.put(newEntry).promise();
  return newEntry.Item;
};

exports.handler = async event => {
  // Response function
  const response = (statusCode, body) => {
    const headers = {
      ['Access-Control-Allow-Origin']: event.headers.origin
    };
    
    return { statusCode, body: JSON.stringify(body, null, 2), headers };
  };

  // Verify all requests.
  const payload = verifyAndDecode(event.headers.Authorization);

  // Return error if verification failed.
  if (payload.err) return response(401, JSON.stringify(payload));

  // Get channel data from database, if no entry is found create one.
  const channelData = await getChannelData(payload.channel_id);
  if (!channelData) return response(500, 'Internal Server Error');

  return response(200, color(channelData.colour).hex());
};