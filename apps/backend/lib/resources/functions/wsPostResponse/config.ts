import { ArticleGPTCustomResource } from "@article-gpt/cdk-constructs";
import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { WebSocketApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import {
  FilterCriteria,
  FilterRule,
  StartingPosition,
} from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface WsPostResponseProps {
  connectionTable: Table;
  openAiInvocationsTable: Table;
  webSocketApi: WebSocketApi;
  wsApiEndpoint: string;
}

export class WsPostResponse extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, props: WsPostResponseProps) {
    super(scope, id);

    const {
      connectionTable,
      webSocketApi,
      wsApiEndpoint,
      openAiInvocationsTable,
    } = props;

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("ws-post-response-function"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
        environment: {
          WS_API_ENDPOINT: wsApiEndpoint,
          CONN_TABLE_NAME: connectionTable.tableName,
          NODE_OPTIONS: "--enable-source-maps",
        },
      }
    );

    this.function.addEventSource(
      new DynamoEventSource(openAiInvocationsTable, {
        startingPosition: StartingPosition.LATEST,
        filters: [
          FilterCriteria.filter({
            dynamodb: {
              NewImage: {
                status: {
                  S: FilterRule.isEqual("COMPLETE") as string,
                },
              },
            },
          }),
        ],
      })
    );

    connectionTable.grantReadWriteData(this.function);
    openAiInvocationsTable.grantReadWriteData(this.function);
    webSocketApi.grantManageConnections(this.function);
  }
}
