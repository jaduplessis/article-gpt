import { getEnvVariable, getRegion } from "@article-gpt/helpers";
import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";
import { APIGatewayEvent } from "aws-lambda";
import { InvocationEntity } from "../../dataModel/Invocation";
import { FileSections, SectionTypes } from "../utils";
import { llmConfiguration } from "./llm";

interface RequestBody {
  connectionId: string;
  payload: FileSections[];
}

interface ModelInvokeInput {
  type: SectionTypes;
  content: string;
}

const lambda = new LambdaClient({
  region: getRegion(),
});

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

  const invokeInput: ModelInvokeInput[] = requestBody.payload.map((section) => {
    const content = section.styledText ?? section.content;
    return {
      type: section.type,
      content,
    };
  });

  const invokeString = JSON.stringify(invokeInput, null, 2);

  const invokeFunction: string = getEnvVariable("INVOKE_FUNCTION");
  const sourceFunction: string = getEnvVariable("SOURCE_FUNCTION");

  const modelParams = llmConfiguration(invokeString);

  const payload = {
    connectionId: requestBody.connectionId,
    sourceFunction,
    modelProps: modelParams,
  };

  // Save invocation to DynamoDB
  await InvocationEntity.put({
    connectionId: requestBody.connectionId,
    status: "PENDING",
    sourceFunction,
  });

  // Invoke the lambda function
  const response = await lambda.send(
    new InvokeCommand({
      FunctionName: invokeFunction,
      Payload: JSON.stringify(payload),
      InvocationType: InvocationType.Event,
    })
  );
  console.log("Response from model invocation", response);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Model invocation successful",
      connectionId: requestBody.connectionId,
    }),
  };
};
