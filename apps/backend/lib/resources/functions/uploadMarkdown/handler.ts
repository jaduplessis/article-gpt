import { APIGatewayEvent } from "aws-lambda";
import { processLineByLine } from "./processFIle";

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

  // Message is Base64 encoded
  const decodedMessage = Buffer.from(message, "base64").toString("utf-8");

  const fileInformation = processLineByLine(decodedMessage);

  const response = {
    message: fileInformation.sections,
    metaData: {
      numSections: fileInformation.numTextSections,
    },
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
