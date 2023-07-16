import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({
  region: 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(ddbClient)

export const handler = async (event) => {
  console.log('event: ', event);
  const eventBody = JSON.parse(event.body)
  
  const input = {
    TableName: process.env.TABLE_NAME,
    Key: {
      username: eventBody.username,
      eTag: eventBody.eTag
    }
  }
  const command = new DeleteCommand(input);
  const commandResponse = await docClient.send(command);
  console.log('commandResponse: ', JSON.stringify(commandResponse));

  const response = {
    statusCode: commandResponse.$metadata.httpStatusCode,
    headers: { 'Access-Control-Allow-Origin': "*" },
    body: 'Item Deleted',
  }
  return response 
}