import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({
  region: 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(ddbClient)

export const handler = async (event) => {
  console.log (event)
  const { username} = JSON.parse(event.body)
  const KeyConditionExpression = "username = :v1"
  const ExpressionAttributeValues = {
    ":v1": username
  }
  const input = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: KeyConditionExpression,
    ExpressionAttributeValues: ExpressionAttributeValues,
    ProjectionExpression: 'username, eTag, jobStatus, createdAt, objectKey, title'
  }
  const command = new QueryCommand(input);
  const data = await docClient.send(command);
  console.log('data: ', JSON.stringify(data));

  console.log(JSON.stringify(event));
  const response = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': "*" },
    body: JSON.stringify(data.Items),
  }
  return response 
}