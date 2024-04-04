import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyWebsocketHandlerV2,
} from "aws-lambda";
import "source-map-support/register";
import { WsConnectionEntity } from "../../dataModel/Connection";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> => {
  const connectionId = event.requestContext.connectionId;

  await WsConnectionEntity.put({
    connectionId,
  });

  return { statusCode: 200 };
};
