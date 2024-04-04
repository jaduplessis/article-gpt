import { getEnvVariable } from "@article-gpt/helpers";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, DynamoDBStreamEvent } from "aws-lambda";
import { TextEncoder } from "util";

const apiGwManApiClient = new ApiGatewayManagementApiClient({
  region: getEnvVariable("AWS_REGION"),
  endpoint: getEnvVariable("WS_API_ENDPOINT"),
});

export const handler = async (
  event: DynamoDBStreamEvent 
): Promise<APIGatewayProxyResultV2> => {
  console.log(`Received event: ${JSON.stringify(event)}`);
  try {
    const connectionId = event.Records[0]?.dynamodb?.NewImage?.connectionId.S;
    const data = event.Records[0]?.dynamodb?.NewImage?.data.S;

    if (!connectionId) {
      console.error("ConnectionId not found in event");
      return { statusCode: 400 };
    }

    const textEncoder = new TextEncoder();

    await apiGwManApiClient.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: textEncoder.encode(
          JSON.stringify({ type: "InvokeResponse", message: data })
        ),
      })
    );

    return { statusCode: 200 };
  }
  catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
};
