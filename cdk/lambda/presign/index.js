import { S3Client, AbortMultipartUploadCommand , PutObjectCommand } from "@aws-sdk/client-s3";
import {
  getSignedUrl,
  S3RequestPresigner,
 } from "@aws-sdk/s3-request-presigner";
import { extension as getExtension } from 'es-mime-types';

const client = new S3Client({region:'us-east-1'});

export const handler = async (event)  => {
  // console.log(event);

  const uploadURL = await getUploadURL(event);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Authorization, *',
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'OPTIONS,GET',
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(uploadURL),
  };
};

const getUploadURL = async function(event) {
  console.log(event);
  const apiRequestId = event.requestContext.requestId;
  const contentType = event.queryStringParameters.contentType
  const filename = event.queryStringParameters.name;
  const email = event.queryStringParameters.email;
  const title = event.queryStringParameters.title;
  const extension = getExtension(contentType);
  const s3Key = `data/`+ decodeURIComponent(filename)  //${apiRequestId}.${extension};

  // Get signed URL from S3
  const putObjectParams = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key: s3Key,
    ContentType: contentType,
    Metadata:{'email': decodeURIComponent(email),'title':decodeURIComponent(title)}


  };


  const command = new PutObjectCommand(putObjectParams);
  const signedUrl = await getSignedUrl( client,command, { expiresIn: 3600 } );

  return {
    uploadURL: signedUrl,
    key: s3Key,
  };
};