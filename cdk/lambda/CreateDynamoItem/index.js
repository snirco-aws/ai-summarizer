import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const ddbClient = new DynamoDBClient({ region: 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(ddbClient)

export const handler = async (event) => {
  console.log('event: ', JSON.stringify(event));
  const { s3 } = event.Records[0]
  const input = {
    TableName: process.env.TABLE_NAME,
    Item: {
      username: 'snir',
      objectKey: s3.object.key,
      eTag: s3.object.eTag,
      size: s3.object.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobStatus: 'in_progress',
      summary: 'This is an example summary'
    }
  }
  const command = new PutCommand(input)
  const res = await docClient.send(command)
  console.log('res: ', res);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!'
    })
  }
}