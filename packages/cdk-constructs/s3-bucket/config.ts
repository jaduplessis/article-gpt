import { Bucket, BucketEncryption, StorageClass } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";

export interface KnowledgeBaseBucketProps {
  autoDeleteObjects?: boolean;
}

export class KnowledgeBaseBucket extends Bucket {
  constructor(scope: Construct, id: string, props?: KnowledgeBaseBucketProps) {
    const { autoDeleteObjects } = props ?? {};

    super(scope, `${id}-bucket`, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: autoDeleteObjects,
    });
  }
}
