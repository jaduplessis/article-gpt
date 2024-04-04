import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface ResultsBucketProps {
  autoDeleteObjects?: boolean;
}

export class ResultsBucket extends Bucket {
  constructor(scope: Construct, id: string, props?: ResultsBucketProps) {
    const { autoDeleteObjects } = props ?? {};

    super(scope, `${id}-bucket`, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: autoDeleteObjects,
    });
  }
}
