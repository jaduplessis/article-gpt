import {
  ArticleGPTCustomResource,
  ResultsBucket,
} from "@article-gpt/cdk-constructs";
import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { WebSocketApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface FunctionProps {
  openAiInvocationsTable: Table;
  resultsBucket: ResultsBucket;
  wsApiEndpoint: string;
  webSocketApi: WebSocketApi;
}

export class Invoke extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    {
      openAiInvocationsTable,
      resultsBucket,
      wsApiEndpoint,
      webSocketApi,
    }: FunctionProps
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
          WS_API_ENDPOINT: wsApiEndpoint,
        },
      }
    );

    openAiInvocationsTable.grantReadWriteData(this.function);
    resultsBucket.grantWrite(this.function);
    webSocketApi.grantManageConnections(this.function);
  }
}
