import { getStage } from "@article-gpt/helpers";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ArticleGPTApiGateway } from "@article-gpt/cdk-constructs";
import { WillV2 } from "./resources/functions";

export class ArticleStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const willV2 = new WillV2(this, "WillV2");

    new ArticleGPTApiGateway(this, "api-gateway", {
      stage,
      willV2,
    });
  }
}
