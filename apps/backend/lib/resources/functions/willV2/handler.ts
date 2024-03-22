import { getEnvVariable } from "@article-gpt/helpers";
import { APIGatewayEvent } from "aws-lambda";
import { ChatOpenAI } from "langchain/chat_models/openai";
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

  const model = new ChatOpenAI({
    openAIApiKey: getEnvVariable("OPENAI_API_KEY"),
    modelName: "ft:gpt-3.5-turbo-0125:aleios:willv2:94uyrpGH",
    temperature: 0.75,
    maxTokens: 1500,
  });

  const response = await invoke(message, model);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
