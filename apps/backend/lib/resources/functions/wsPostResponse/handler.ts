import { getEnvVariable } from "@article-gpt/helpers";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyResultV2, DynamoDBStreamEvent } from "aws-lambda";
import { TextEncoder } from "util";
import { getInvocationFromId } from "../utils";

const apiGwManApiClient = new ApiGatewayManagementApiClient({
  region: getEnvVariable("AWS_REGION"),
  endpoint: getEnvVariable("WS_API_ENDPOINT"),
});

const s3 = new S3Client({
  region: getEnvVariable("AWS_REGION"),
});

export const handler = async (
  event: DynamoDBStreamEvent
): Promise<APIGatewayProxyResultV2> => {
  console.log(`Received event: ${JSON.stringify(event)}`);
  try {
    const connectionId = event.Records[0]?.dynamodb?.NewImage?.connectionId.S;
    if (!connectionId) {
      console.error("ConnectionId not found in event");
      return { statusCode: 400 };
    }

    const invocation = await getInvocationFromId(connectionId);
    if (!invocation.outputLocation) {
      console.error("Output location not found in invocation");
      return { statusCode: 400 };
    }

    const { key, bucket } = invocation.outputLocation;

    const s3Data = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    const body = await s3Data.Body?.transformToString();
    if (!body) {
      console.error("No body found in S3 object");
      return { statusCode: 400 };
    }

    const textEncoder = new TextEncoder();

    await apiGwManApiClient.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: textEncoder.encode(
          JSON.stringify({ type: "InvokeResponse", message: body })
        ),
      })
    );

    return { statusCode: 200 };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
};
