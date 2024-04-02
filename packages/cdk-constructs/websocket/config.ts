import { buildResourceName, getStage } from "@article-gpt/helpers";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { DynamoDBConstruct } from "../dynamodb/config";
import { WsConnect } from "./functions/connect/config";
import { WsDisconnect } from "./functions/disconnect/config";

interface WebSocketProps {
  restApi: RestApi;
}

export class WebSocket extends Construct {
  public webSocketApi: WebSocketApi;
  public connectionTable: Table;
  public webSocketStage: WebSocketStage;

  constructor(scope: Construct, id: string, props: WebSocketProps) {
    super(scope, id);

    const { restApi } = props;

    const stage = getStage();

    this.connectionTable = new DynamoDBConstruct(this, "ws-connection-table", {
      tableName: buildResourceName("WsConnectionTable"),
    }).table;

    const connectHandler = new WsConnect(this, "ws-connect", {
      connectionTable: this.connectionTable,
    });

    const disconnectHandler = new WsDisconnect(this, "ws-disconnect", {
      connectionTable: this.connectionTable,
    });

    this.webSocketApi = new WebSocketApi(this, "websocket-api", {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ws-connect-integration",
          connectHandler.function
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ws-disconnect-integration",
          disconnectHandler.function
        ),
      },
    });

    this.webSocketStage = new WebSocketStage(this, "websocket-stage", {
      webSocketApi: this.webSocketApi,
      stageName: stage,
      autoDeploy: true,
    });
  }
}
