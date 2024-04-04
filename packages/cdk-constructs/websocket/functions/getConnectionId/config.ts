import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { ArticleGPTCustomResource } from "../../../custom-resource-lambda/config";
import { WebSocketApi } from "@aws-cdk/aws-apigatewayv2-alpha";


interface WsGetConnectionIdProps {
  connectionTable: Table;
  websocketApi: WebSocketApi;
  wsApiEndpoint: string;
}

export class WsGetConnectionId extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, props: WsGetConnectionIdProps) {
    super(scope, id);

    const { connectionTable, websocketApi, wsApiEndpoint } = props;

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("ws-get-connection-id"),
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
    websocketApi.grantManageConnections(this.function);
  }
}
