import * as AWS from 'aws-sdk';

const credentials = new AWS.Credentials(
  process.env.AWS_ACCESS_KEY_ID || '',
  process.env.AWS_SECRET_ACCESS_KEY || ''
);

export const comprehend = new AWS.Comprehend({
  region: 'eu-west-1',
  credentials,
});

export const dynamoDb = new AWS.DynamoDB({
  region: 'eu-west-2',
  credentials,
  apiVersion: '2012-08-10'
});

export const translate = new AWS.Translate({
  region: 'eu-west-1',
  credentials,
});
