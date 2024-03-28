import { getEnvVariable } from "@article-gpt/helpers";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { TextEncoder } from "util";
import { WsConnectionEntity } from "../../dataModel/Connection";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

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
        Data: textEncoder.encode("A new review published for book with id 123"),
      })
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: 123,
      review: "awesome book",
    }),
  };
};
