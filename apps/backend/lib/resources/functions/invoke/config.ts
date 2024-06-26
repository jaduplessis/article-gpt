import {
  ArticleGPTCustomResource,
  ResultsBucket,
} from "@article-gpt/cdk-constructs";
import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface FunctionProps {
  openAiInvocationsTable: Table;
  resultsBucket: ResultsBucket;
}

export class Invoke extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { openAiInvocationsTable, resultsBucket }: FunctionProps
  ) {
    super(scope, id);

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("invoke"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.minutes(5),
        environment: {
          RESULTS_BUCKET_NAME: resultsBucket.bucketName,
        },
      }
    );

    openAiInvocationsTable.grantReadWriteData(this.function);
    resultsBucket.grantWrite(this.function);
  }
}
