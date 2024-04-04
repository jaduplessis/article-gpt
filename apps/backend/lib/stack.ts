import { buildResourceName, getStage } from "@article-gpt/helpers";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  ArticleGPTApiGateway,
  DynamoDBConstruct,
  ResultsBucket,
  WebSocket,
} from "@article-gpt/cdk-constructs";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import {
  Invoke,
  S3UploadTrigger,
  Stitch,
  UploadMarkdown,
  WillV2,
  WsPostResponse,
} from "./resources/functions";

export class ArticleStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const openAiInvocations = new DynamoDBConstruct(
      this,
      "OpenAi-Invocations",
      {
        tableName: buildResourceName("OpenAi-Invocations"),
      }
    );

    const websocket = new WebSocket(this, "websocket");

    const resultsBucket = new ResultsBucket(this, "ResultsBucket");

    const uploadMarkdown = new UploadMarkdown(this, "UploadMarkdown");

    const willV2 = new WillV2(this, "WillV2");

    const invoke = new Invoke(this, "Invoke", {
      openAiInvocationsTable: openAiInvocations.table,
      resultsBucket,
    });

    const stitch = new Stitch(this, "Stitch", {
      table: openAiInvocations.table,
      invoke: invoke.function,
    });

    new S3UploadTrigger(this, "s3-upload-trigger", {
      openAiInvocationsTable: openAiInvocations.table,
      resultsBucket,
    });

    const wsPostResponse = new WsPostResponse(this, "ws-demo", {
      connectionTable: websocket.connectionTable,
      resultsBucket,
      openAiInvocationsTable: openAiInvocations.table,
      webSocketApi: websocket.webSocketApi,
      wsApiEndpoint: websocket.wsApiEndpoint,
    });

    const apiGateway = new ArticleGPTApiGateway(this, "api-gateway", {
      stage,
      willV2,
      stitch,
      uploadMarkdown,
    });

    apiGateway.restApi.root.addMethod(
      HttpMethod.POST,
      new LambdaIntegration(wsPostResponse.function)
    );

    new CfnOutput(this, "WebSocketURL", {
      description: "WebSocket URL",
      value: websocket.webSocketStage.url,
    });
  }
}
