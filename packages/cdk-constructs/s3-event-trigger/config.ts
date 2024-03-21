import { Construct } from "constructs";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { Function, Runtime, Code, IFunction } from "aws-cdk-lib/aws-lambda";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export interface S3EventTriggerProps {
  lambdafunction: IFunction;
  bucket_name: Bucket;
}

export class S3EventTrigger extends Construct {
  constructor(scope: Construct, id: string, props: S3EventTriggerProps) {
    const { lambdafunction, bucket_name } = props;

    super(scope, id);

    const s3EventSource = new S3EventSource(bucket_name, {
      events: [EventType.OBJECT_CREATED],
    });

    lambdafunction.addEventSource(s3EventSource);
    this.node.addDependency(lambdafunction);
  }
}
