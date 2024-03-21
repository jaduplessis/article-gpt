import { getStage } from "@gen-ai-poc/helpers";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
export class starterStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

 
 
  }
}
