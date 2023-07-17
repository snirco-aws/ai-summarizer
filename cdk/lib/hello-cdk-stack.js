const { Stack, RemovalPolicy, Duration } = require('aws-cdk-lib');
const { Bucket } = require('aws-cdk-lib/aws-s3')
const { Function, Code, Runtime } = require('aws-cdk-lib/aws-lambda')
const { Table, AttributeType } = require('aws-cdk-lib/aws-dynamodb');
const { S3EventSource } = require('aws-cdk-lib/aws-lambda-event-sources');
const { ServicePrincipal, Role, ManagedPolicy } = require('aws-cdk-lib/aws-iam');

class HelloCdkStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create role for lambda to access dynamodb
    const lambdaFullDdbAccessRole = new Role(this, 'LambdaDynamoDbFullAccessRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    })
    
    // add dynamodb fullaccess and lambda basic policies to the role
    lambdaFullDdbAccessRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'))    
    lambdaFullDdbAccessRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'))

    // Create S3 bucket
    const bucket = new Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })

    // Craete DynamoDB table for summary jobs
    const table = new Table(this, 'SummaryJobsTable', {
      partitionKey: { name: 'username', type: AttributeType.STRING },
      sortKey: { name: 'eTag', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY
    });

    // Create Lambda function for creating a DynamoDB item
    const createDynamoItemLambda = new Function(this, 'CreateDynamoItem', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(__dirname + '/../lambda/CreateDynamoItem/'),
      handler: 'index.handler',
      role: lambdaFullDdbAccessRole,
      environment: {
        TABLE_NAME: table.tableName
      },
      timeout: Duration.minutes(1),
      removalPolicy: RemovalPolicy.DESTROY
    })
    createDynamoItemLambda.addEventSource(new S3EventSource(bucket, {
      events: [ 's3:ObjectCreated:*']
    }))

    // Create Lambda function for getting all Summary Jobs
    new Function(this, 'GetSummaryJobs', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(__dirname + '/../lambda/GetSummaryJobs/'),
      handler: 'index.handler',
      role: lambdaFullDdbAccessRole,
      environment: {
        TABLE_NAME: table.tableName
      },
      timeout: Duration.minutes(1),
      removalPolicy: RemovalPolicy.DESTROY
    })

    // Create Lambda function for deleting a DynamoDB item
    new Function(this, 'DeleteSummaryJob', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(__dirname + '/../lambda/DeleteSummaryJob/'),
      handler: 'index.handler',
      role: lambdaFullDdbAccessRole,
      environment: {
        TABLE_NAME: table.tableName
      },
      timeout: Duration.minutes(1),
      removalPolicy: RemovalPolicy.DESTROY
    })

    // Create Lambda function for downloading a summary from a job
    new Function(this, 'GetJobSummary', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(__dirname + '/../lambda/GetJobSummary/'),
      handler: 'index.handler',
      role: lambdaFullDdbAccessRole,
      environment: {
        TABLE_NAME: table.tableName
      },
      timeout: Duration.minutes(1),
      removalPolicy: RemovalPolicy.DESTROY
    })
  } 
}

module.exports = { HelloCdkStack }
