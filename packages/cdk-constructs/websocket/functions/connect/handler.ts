import { getRegion } from "@article-gpt/helpers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyWebsocketHandlerV2,
} from "aws-lambda";
import "source-map-support/register";

const dynamoDBClient = new DynamoDBClient({
  region: getRegion(),
});
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log("Event:", JSON.stringify(event));

  const putCommand = new PutCommand({
    TableName: process.env.CONN_TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId,
      'SK': 'WS_CONNECTION',
    },
  });
  const resp = await dynamoDBDocClient.send(putCommand);
  console.log(`putCommand resp => ${JSON.stringify(resp)}`);

  return { statusCode: 200 };
};
