import { ScheduledEvent, Context } from "aws-lambda";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { Logger } from "@aws-lambda-powertools/logger";
import { S3 } from "@aws-sdk/client-s3";

const logger = new Logger();
const tracer = new Tracer();
tracer.provider.setLogger(logger);

const s3 = tracer.captureAWSv3Client(new S3({}));

/**
 * A very verbose function that writes an object to S3, purely so that we have a
 * sample API call to capture in X-Ray.
 */
export async function handler(event: ScheduledEvent, context: Context) {
    logger.addContext(context);
    logger.info("Starting handler");
    // Trace ID can be pulled from the environment
    // https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-runtime
    logger.info("X-Ray tracing ID", { id: process.env._X_AMZN_TRACE_ID });
    await s3.putObject({ 
        Bucket: process.env.BUCKET_NAME,
        Key: `${Date.now().toString()}.json`,
        Body: JSON.stringify(event)
    });
    logger.info("Ending handler");
}