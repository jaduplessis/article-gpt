import { InvokePayload } from "../utils";

export const handler = async (event: InvokePayload) => {
  const { genId, sourceFunction, modelProps } = event;

  console.log(`
  Received event with id: ${genId} from function: ${sourceFunction} 
  
  with modelProps: ${JSON.stringify(modelProps)}`);

  // const response = await invoke(modelProps);
};
