import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class LambdaXrayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'StoreData', {
      // Delete the bucket and all objects by default
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // Configure the bucket securely
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });
    const fn = new nodejs.NodejsFunction(this, 'TestFunction', {
      entry: 'lambda/handler.ts',
      environment: {
        BUCKET_NAME: bucket.bucketName
      },
      // Ensure active tracing is enabled to allow writing to X-Ray automatically.
      // Per https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html,
      // this is necessary to ensure that the X-Ray daemon is running within our Lambda
      // execution environment.
      tracing: lambda.Tracing.ACTIVE,
    });
    bucket.grantWrite(fn);

    new cdk.CfnOutput(this, "FunctionName", { value: fn.functionName });
  }
}
