import { getEnvVariable, getRegion } from "@article-gpt/helpers";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyWebsocketHandlerV2,
} from "aws-lambda";
import "source-map-support/register";
import { TextEncoder } from "util";

const apiGwManApiClient = new ApiGatewayManagementApiClient({
  region: getRegion(),
  endpoint: getEnvVariable("WS_API_ENDPOINT"),
});

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> => {
  const connectionId = event.requestContext.connectionId;

  const textEncoder = new TextEncoder();

  await apiGwManApiClient.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: textEncoder.encode(
        JSON.stringify({ type: "connectionId", connectionId })
      ),
    })
  );

  return { statusCode: 200 };
};
