import { buildResourceName, getCdkHandlerPath, getRegion } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { ArticleGPTCustomResource } from "../../../custom-resource-lambda/config";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";


interface WsDemoProps {
  connectionTable: Table;
  webSocketApi: WebSocketApi;
  webSocketStage: WebSocketStage;
}

export class WsDemo extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, props: WsDemoProps) {
    super(scope, id);

    const { connectionTable, webSocketApi, webSocketStage } = props;

    const region = getRegion();

    const WS_API_ENDPOINT = `https://${webSocketApi.apiId}.execute-api.${region}.amazonaws.com/${webSocketStage.stageName}`

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("ws-demo"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
        environment: {
          WS_API_ENDPOINT,
          CONN_TABLE_NAME: connectionTable.tableName,
          NODE_OPTIONS: "--enable-source-maps",
        },
      }
    );

    connectionTable.grantReadWriteData(this.function);
    webSocketApi.grantManageConnections(this.function);
  }
}
