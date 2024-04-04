import { buildResourceName, getRegion, getStage } from "@article-gpt/helpers";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { DynamoDBConstruct } from "../dynamodb/config";
import { WsConnect } from "./functions/connect/config";
import { WsDisconnect } from "./functions/disconnect/config";
import { WsGetConnectionId } from "./functions/getConnectionId/config";

export class WebSocket extends Construct {
  public webSocketApi: WebSocketApi;
  public connectionTable: Table;
  public webSocketStage: WebSocketStage;
  public wsApiEndpoint: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();
    const region = getRegion();

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

    this.wsApiEndpoint = `https://${this.webSocketApi.apiId}.execute-api.${region}.amazonaws.com/${stage}`;
    
    const getConnectionIdHandler = new WsGetConnectionId(
      this,
      "ws-get-connection-id",
      {
        connectionTable: this.connectionTable,
        websocketApi: this.webSocketApi,
        wsApiEndpoint: this.wsApiEndpoint,
      }
    );
    
    this.webSocketApi.addRoute("getConnectionId", {
      integration: new WebSocketLambdaIntegration(
        "ws-get-connection-id-integration",
        getConnectionIdHandler.function
      ),
    });
  }
}
