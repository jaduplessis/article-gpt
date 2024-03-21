import { Construct } from "constructs";
import { getStackName } from "./get-stack-name";

export const buildResourceName = (
  scope: Construct,
  resourceName: string,
): string => `${getStackName(scope)}-${resourceName}`;
