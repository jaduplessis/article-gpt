import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { ModelProps } from "../utils/types";

export const invoke = async (parameters: ModelProps): Promise<string> => {
  const {
    openAIApiKey,
    modelName,
    temperature,
    maxTokens,
    frequencyPenalty,
    systemPrompt,
    humanPrompt,
  } = parameters;

  const model = new ChatOpenAI({
    openAIApiKey,
    modelName,
    temperature,
    maxTokens,
    frequencyPenalty,
  });

  const messages: (HumanMessage | SystemMessage)[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  const response = await model.invoke(messages);

  const content = response.content;

  return content as string;
};
