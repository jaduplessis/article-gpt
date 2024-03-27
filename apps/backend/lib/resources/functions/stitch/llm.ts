import { getEnvVariable } from "@article-gpt/helpers";
import { ModelProps } from "../utils";
import { systemPrompt } from "./prompt";

export const llmConfiguration = (humanMessage: string): ModelProps => {
  const modelProps: ModelProps = {
    openAIApiKey: getEnvVariable("OPENAI_API_KEY"),
    modelName: "gpt-4",
    temperature: 0.9,
    maxTokens: 4500,
    frequencyPenalty: 0.5,
    systemPrompt,
    humanPrompt: humanMessage,
  };

  return modelProps;
};
