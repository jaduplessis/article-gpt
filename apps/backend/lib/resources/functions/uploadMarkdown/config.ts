import { ArticleGPTCustomResource } from "@article-gpt/cdk-constructs";
import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class UploadMarkdown extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName(this, "uploadMarkdown"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
      }
    );
  }
}
