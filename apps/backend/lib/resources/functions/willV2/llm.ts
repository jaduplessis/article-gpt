import {
  ChatOpenAI,
  ChatOpenAICallOptions,
} from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { systemPrompt } from "./prompt";

export const invoke = async (
  message: string,
  model: ChatOpenAI<ChatOpenAICallOptions>
): Promise<string> => {
  const messages: (HumanMessage | SystemMessage)[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(message),
  ];

  const response = await model.invoke(messages);

  const content = response.content;

  return content as string;
};
