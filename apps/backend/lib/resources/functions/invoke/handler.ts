import { getRegion } from "@article-gpt/helpers";
import { S3Client } from "@aws-sdk/client-s3";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { InvokePayload } from "../utils";

const s3 = new S3Client({
  region: getRegion(),
});

export const handler = async (event: InvokePayload) => {
  const {
    openAIApiKey,
    modelName,
    temperature,
    maxTokens,
    frequencyPenalty,
    systemPrompt,
    humanPrompt,
    streaming,
  } = event.modelProps;

  const model = new ChatOpenAI({
    openAIApiKey,
    modelName,
    temperature,
    maxTokens,
    frequencyPenalty,
    streaming: true,
  });

  const messages: (HumanMessage | SystemMessage)[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  let content = "";
  switch (streaming) {
    case true:
      if (!event.wsPostResponse) {
        throw new Error("wsPostResponse is required for streaming");
      }

      const stream = await model.stream(messages);
      let streamResponse = "";

      for await (const chunk of stream) {
        streamResponse += chunk.content;

        event.wsPostResponse.sendMessage(streamResponse);
      }

      content = streamResponse;

      break;

    case false:
      const response = await model.invoke(messages);

      content = response.content as string;
      break;
  }

  return content;
};
