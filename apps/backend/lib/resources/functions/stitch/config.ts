import { Construct } from "constructs";
import {
  ArticleGPTCustomResource,
} from "@article-gpt/cdk-constructs";
import { getCdkHandlerPath, buildResourceName, getEnvVariable } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface FunctionProps {
  invoke: NodejsFunction;
}


export class Stitch extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, { invoke }: FunctionProps) {
    super(scope, id);

    const OPENAI_API_KEY = getEnvVariable("OPENAI_API_KEY");

    this.function = new ArticleGPTCustomResource(this, buildResourceName(this, "stitch"), {
      lambdaEntry: getCdkHandlerPath(__dirname),
      environment: {
        OPENAI_API_KEY,
        INVOKE_FUNCTION: invoke.functionName,
        SOURCE_FUNCTION: "Stitch",
      },
      timeout: Duration.minutes(5)
    });

    invoke.grantInvoke(this.function);
  }
}