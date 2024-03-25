import { APIGatewayEvent } from "aws-lambda";
import { invoke } from "./llm";

interface RequestBody {
  message: string;
}

export const handler = async (event: APIGatewayEvent) => {
  let requestBody: RequestBody;

  try {
    requestBody = JSON.parse(event.body || "{}") as RequestBody;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }

  const { message } = requestBody;

  const response = await invoke(message);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
