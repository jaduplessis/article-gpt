import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

export const getStackName = (scope: Construct): string => {
  const stack = Stack.of(scope);

  return stack.stackName;
};
