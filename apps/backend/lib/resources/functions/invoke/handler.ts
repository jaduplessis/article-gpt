import { InvocationEntity } from "../../dataModel/Invocation";
import { InvokePayload } from "../utils";

export const handler = async (event: InvokePayload) => {
  const { connectionId, sourceFunction, modelProps } = event;

  const resp =`
  Received event with id: ${connectionId} from function: ${sourceFunction} 
  
  with modelProps: ${JSON.stringify(modelProps)}`;

  // const response = await invoke(modelProps);

  await InvocationEntity.update({
    connectionId,
    status: "COMPLETE",
    data: resp,
  });
};
