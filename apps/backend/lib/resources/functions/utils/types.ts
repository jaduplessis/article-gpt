
export interface InvokeS3Body {
  connectionId: string;
  sourceFunction: string;
  systemPrompt: string;
  humanPrompt: string;
  invokeResponse: string;
}


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