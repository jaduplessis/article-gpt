import { Construct } from "constructs";
import {
  ArticleGPTCustomResource,
} from "@article-gpt/cdk-constructs";
import { getCdkHandlerPath, buildResourceName, getEnvVariable } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";


export class WillV2 extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const OPENAI_API_KEY = getEnvVariable("OPENAI_API_KEY");

    this.function = new ArticleGPTCustomResource(this, buildResourceName("willV2"), {
      lambdaEntry: getCdkHandlerPath(__dirname),
      environment: {
        OPENAI_API_KEY,
      },
      timeout: Duration.minutes(1),
    });
  }
}