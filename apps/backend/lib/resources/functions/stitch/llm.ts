import { getEnvVariable } from "@article-gpt/helpers";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { systemPrompt } from "./prompt";

export const invoke = async (message: string): Promise<string> => {
  const model = new ChatOpenAI({
    openAIApiKey: getEnvVariable("OPENAI_API_KEY"),
    modelName: "gpt-4",
    temperature: 0.9,
    maxTokens: 4500,
    frequencyPenalty: 0.5,
  });

  const messages: (HumanMessage | SystemMessage)[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(message),
  ];

  const response = await model.invoke(messages);

  const content = response.content;

  return content as string;
};
