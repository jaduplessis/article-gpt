import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Role } from "aws-cdk-lib/aws-iam";
import {
  ISecurityGroup,
  ISubnet,
  IVpc,
  SubnetSelection,
} from "aws-cdk-lib/aws-ec2";
import { Duration } from "aws-cdk-lib";

export interface GenAiPocLambdaProps {
  lambdaEntry: string;
  environment?: Record<string, string>;
  role?: Role;
  memorySize?: number;
  runtime?: Runtime;
}

export class GenAiPocCustomResource extends NodejsFunction {
  constructor(scope: Construct, id: string, props: GenAiPocLambdaProps) {
    const { lambdaEntry, environment, memorySize, role, runtime } = props;

    const functionName = `${id}-lambda`;

    super(scope, `${id}-lambda`, {
      functionName,
      runtime: runtime ?? Runtime.NODEJS_20_X,
      entry: lambdaEntry,
      memorySize,
      environment,
      role,
      timeout: Duration.seconds(30),
    });
  }
}
