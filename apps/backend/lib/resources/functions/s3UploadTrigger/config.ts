import {
  ArticleGPTCustomResource,
  ResultsBucket,
} from "@article-gpt/cdk-constructs";
import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { EventType } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface FunctionProps {
  openAiInvocationsTable: Table;
  resultsBucket: ResultsBucket;
}

export class S3UploadTrigger extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { openAiInvocationsTable, resultsBucket }: FunctionProps
  ) {
    super(scope, id);

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("s3-upload-trigger"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
      }
    );

    this.function.addEventSource(
      new S3EventSource(resultsBucket, {
        events: [EventType.OBJECT_CREATED],
      })
    );

    openAiInvocationsTable.grantReadWriteData(this.function);
    resultsBucket.grantWrite(this.function);
  }
}