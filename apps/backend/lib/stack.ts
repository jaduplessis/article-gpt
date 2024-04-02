import { buildResourceName, getStage } from "@article-gpt/helpers";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ArticleGPTApiGateway, DynamoDBConstruct, WebSocket } from "@article-gpt/cdk-constructs";
import { Invoke, Stitch, UploadMarkdown, WillV2, WsDemo } from "./resources/functions";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export class ArticleStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const openAiInvocations = new DynamoDBConstruct(this, "OpenAi-Invocations", {
      tableName: buildResourceName("OpenAi-Invocations"),
    });

    const invoke = new Invoke(this, "Invoke");

    const willV2 = new WillV2(this, "WillV2");

    const stitch = new Stitch(this, "Stitch", {
      table: openAiInvocations.table,
      invoke: invoke.function,
    });

    const uploadMarkdown = new UploadMarkdown(this, "UploadMarkdown");

    const apiGateway = new ArticleGPTApiGateway(this, "api-gateway", {
      stage,
      willV2,
      stitch,
      uploadMarkdown,
    });

    const websocket = new WebSocket(this, "websocket", {
      restApi: apiGateway.restApi,
    });

    const demoHandler = new WsDemo(this, "ws-demo", {
      connectionTable: websocket.connectionTable,
      webSocketApi: websocket.webSocketApi,
      webSocketStage: websocket.webSocketStage,
    });

    apiGateway.restApi.root.addMethod(
      HttpMethod.POST,
      new LambdaIntegration(demoHandler.function)
    );

    new CfnOutput(this, "WebSocketURL", {
      description: "WebSocket URL",
      value: websocket.webSocketStage.url,
    });
  }
}
