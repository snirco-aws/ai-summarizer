import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand ,GetCommand,UpdateCommand} from '@aws-sdk/lib-dynamodb'

const ddbClient = new DynamoDBClient({ region: 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(ddbClient)


export const handler = async (event) => {

  
    console.log('event: ', JSON.stringify(event));
    const { s3 } = event.Records[0];
    const objectKey = s3.object.key;
    const etag= s3.object.eTag

    //these 3 fields were added manualy to the s3 event object by the caller
    const email = s3.object.email;  
    const summary = s3.object.summary;
    const status = s3.object.status;
 

  
    const getItemInput = {
      TableName: process.env.TABLE_NAME,
      Key: {
        username: email,
        eTag: etag
      }
    };
  
    try {
      console.log('get object ',getItemInput);
      const getItemResponse = await docClient.send(new GetCommand(getItemInput));
      console.log('tried to get object ',getItemResponse);
      const item = getItemResponse.Item;

  
      if (item ) {
        // Entry with the same email and objectKey exists, update it
        const updateItemInput = {
          TableName: process.env.TABLE_NAME,
          Key: {
            username: email,
            eTag: etag
          },
          UpdateExpression: 'SET #updatedAt = :updatedAt, #summary = :summary, #jobStatus = :jobStatus',
          ExpressionAttributeNames: {
            '#updatedAt': 'updatedAt',
            '#summary': 'summary',
            '#jobStatus': 'jobStatus'
          },
          ExpressionAttributeValues: {
            ':updatedAt': new Date().toISOString(),
            ':summary': summary,
            ':jobStatus': status
          }
        };
        console.log('item exists, updating: ',updateItemInput);
        let res=await docClient.send(new UpdateCommand(updateItemInput));
      } else {
        // Entry does not exist, create a new one
        const createItemInput = {
          TableName: process.env.TABLE_NAME,
          Item: {
            username: email,
            objectKey: objectKey,
            eTag: etag,
            size: s3.object.size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            jobStatus: status,
            summary: summary
          }
        };
        console.log('creating new item ',createItemInput);
        let res= await docClient.send(new PutCommand(createItemInput));
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' })
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error' })
      };
    }
  };
  
  
  /*
  example payload
  
  {
    "Records": [
      {
        "s3": {
          "object": {
            "key": "example-key",
            "eTag": "example-etag",
            "size": 123,
             "email": "example@email.com",
        "summary": "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industrstrsstandarddummytexteversincethe1500s",
        "status": "in_progress"
          }
        }
       
      }
    ]
  }
  */