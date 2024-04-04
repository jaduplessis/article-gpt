import { ArticleGPTCustomResource } from "@article-gpt/cdk-constructs";
import {
  buildResourceName,
  getCdkHandlerPath,
  getRegion,
} from "@article-gpt/helpers";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface WsDemoProps {
  connectionTable: Table;
  webSocketApi: WebSocketApi;
  wsApiEndpoint: string;
}

export class WsDemo extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, props: WsDemoProps) {
    super(scope, id);

    const { connectionTable, webSocketApi, wsApiEndpoint } = props;

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("ws-demo-function"),
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

    connectionTable.grantReadWriteData(this.function);
    webSocketApi.grantManageConnections(this.function);
  }
}
