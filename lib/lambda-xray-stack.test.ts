import { Template } from "aws-cdk-lib/assertions";

import * as cdk from "aws-cdk-lib";
import { LambdaXrayStack } from "./lambda-xray-stack";

test("Validate created X-Ray stack", () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new LambdaXrayStack(app, 'TestStack');
    const template = Template.fromStack(stack);

    // THEN
    template.hasResourceProperties('AWS::Lambda::Function', {
        TracingConfig: {
            Mode: "Active"
        }
    });
});