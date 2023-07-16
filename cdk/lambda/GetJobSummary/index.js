import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({
  region: 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(ddbClient)

export const handler = async (event) => {

  const { username, eTag } = JSON.parse(event.body)
  const input = {
    TableName: process.env.TABLE_NAME,
    Key: {
      username: username,
      eTag: eTag
    },
    AttributesToGet: ['summary']
  }

  const command = new GetCommand(input);
  const res = await docClient.send(command);
  console.log('res: ', JSON.stringify(res.data));

  const response = {
    statusCode: res.$metadata.httpStatusCode,
    headers: { 'Access-Control-Allow-Origin': "*" },
    body: JSON.stringify(res.Item),
  }
  return response 
}