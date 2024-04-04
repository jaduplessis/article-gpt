import { ArticleGPTCustomResource } from "@article-gpt/cdk-constructs";
import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface FunctionProps {
  openAiInvocationsTable: Table;
}

export class Invoke extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { openAiInvocationsTable }: FunctionProps
  ) {
    super(scope, id);

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("invoke"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.minutes(5),
      }
    );

    openAiInvocationsTable.grantReadWriteData(this.function);
  }
}
