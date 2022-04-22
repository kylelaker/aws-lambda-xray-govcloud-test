# Sample Lambda with X-Ray Tracing

This CDK application is meant to be an example stack to reproduce issues with
using X-Ray in the AWS GovCloud (US) partition.

The primary CDK logic is in `lib/lambda-xray-stack.ts`, which creates a Lambda
Function with tracing enabled. It also happens to create an S3 bucket that we
write to in the function.

The code for the Lambda function is in `lambda/handler.ts`. It leverages the
AWS Lambda PowerTools for TypeScript; however, the same issue can be reproduced
with any X-Ray SDK in any language within the GovCloud (US) regions. The function
writes the function event object to a file in the given S3 bucket. This gives a
well-known, well-defined API call to try and capture via X-Ray. The function logs
pretty verbosely.

The `@aws-cdk/core:target-partitions` context key has been set to
`["aws", "aws-us-gov"]`, as by default, the `aws-us-gov` partition is not included.