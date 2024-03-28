import { buildResourceName, getStage } from "@article-gpt/helpers";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { DynamoDBConstruct } from "../dynamodb/config";
import { WsConnect } from "./functions/connect/config";
import { WsDemo } from "./functions/demo/config";
import { WsDisconnect } from "./functions/disconnect/config";
import { CfnOutput } from "aws-cdk-lib";

interface WebSocketProps {
  restApi: RestApi;
}

export class WebSocket extends Construct {
  public webSocketApi: WebSocketApi;

  constructor(scope: Construct, id: string, props: WebSocketProps) {
    super(scope, id);

    const { restApi } = props;

    const stage = getStage();

    const connectionTable = new DynamoDBConstruct(this, "ws-connection-table", {
      tableName: buildResourceName("WsConnectionTable"),
      partitionKey: {
        name: "connectionId",
        type: AttributeType.STRING,
      },
    }).table;

    const connectHandler = new WsConnect(this, "ws-connect", {
      connectionTable,
    });

    const disconnectHandler = new WsDisconnect(this, "ws-disconnect", {
      connectionTable,
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

    const webSocketStage = new WebSocketStage(this, "websocket-stage", {
      webSocketApi: this.webSocketApi,
      stageName: stage,
      autoDeploy: true,
    });

    const demoHandler = new WsDemo(this, "ws-demo", {
      connectionTable,
      webSocketApi: this.webSocketApi,
      webSocketStage,
    });

    restApi.root.addMethod(
      HttpMethod.POST,
      new LambdaIntegration(demoHandler.function)
    );

    new CfnOutput(this, "WebSocketURL", {
      description: "WebSocket URL",
      value: webSocketStage.url,
    });
  }
}
