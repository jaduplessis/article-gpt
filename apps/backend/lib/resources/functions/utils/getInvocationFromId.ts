import { IInvocation, InvocationEntity } from "../../dataModel/Invocation";

export const getInvocationFromId = async (
  connectionId: string
): Promise<IInvocation> => {
  const invocation = await InvocationEntity.get({
    connectionId,
  });

  const invocationItem = invocation?.Item;

  if (!invocationItem) {
    throw new Error(`No invocation found with connectionId: ${connectionId}`);
  }

  return invocationItem;
};
