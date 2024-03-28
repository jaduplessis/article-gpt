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
  console.log("Event:", JSON.stringify(event));

  const connectionId = event.requestContext.connectionId;
  const response = WsConnectionEntity.put({
    connectionId,
  });

  console.log(`putCommand resp => ${JSON.stringify(response)}`);
  return { statusCode: 200 };
};
