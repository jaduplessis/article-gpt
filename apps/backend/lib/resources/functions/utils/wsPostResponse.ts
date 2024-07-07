import { getEnvVariable, getRegion } from "@article-gpt/helpers";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { TextEncoder } from "util";


export class WsPostResponse {
  connectionId: string;
  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  apiGwManApiClient = new ApiGatewayManagementApiClient({
    region: getRegion(),
    endpoint: getEnvVariable("WS_API_ENDPOINT"),
  });

  async sendMessage(message: string) {
    const textEncoder = new TextEncoder();

    await this.apiGwManApiClient.send(
      new PostToConnectionCommand({
        ConnectionId: this.connectionId,
        Data: textEncoder.encode(
          JSON.stringify({
            type: "InvokeResponse",
            message,
          })
        ),
      })
    );
  }
}
