import { WsConnectionEntity } from "@article-gpt/cdk-constructs/websocket";
import { getEnvVariable } from "@article-gpt/helpers";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { TextEncoder } from "util";

const apiGwManApiClient = new ApiGatewayManagementApiClient({
  region: getEnvVariable("AWS_REGION"),
  endpoint: getEnvVariable("WS_API_ENDPOINT"),
});

export const handler = async function (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log(`Received event: ${JSON.stringify(event)}`);

  const entityScan = await WsConnectionEntity.scan();
  const connectionItems = entityScan.Items || [];

  const textEncoder = new TextEncoder();
  for (let ind = 0; ind < connectionItems.length; ind++) {
    await apiGwManApiClient.send(
      new PostToConnectionCommand({
        ConnectionId: connectionItems[ind].connectionId,
        Data: textEncoder.encode(`Hello, ${connectionItems[ind].connectionId}`),
      })
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Data sent to all connections.",
    }),
  };
};
