
export interface ModelProps {
  openAIApiKey: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  frequencyPenalty: number;
  systemPrompt: string;
  humanPrompt: string;
}


export interface InvokePayload {
  connectionId: string;
  sourceFunction: string;
  modelProps: ModelProps;
}