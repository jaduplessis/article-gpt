import { getStage } from "@article-gpt/helpers";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ArticleGPTApiGateway } from "@article-gpt/cdk-constructs";
import { Stitch, UploadMarkdown, WillV2 } from "./resources/functions";

export class ArticleStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const willV2 = new WillV2(this, "WillV2");

    const stitch = new Stitch(this, "Stitch");

    const uploadMarkdown = new UploadMarkdown(this, "UploadMarkdown");

    new ArticleGPTApiGateway(this, "api-gateway", {
      stage,
      willV2,
      stitch,
      uploadMarkdown,
    });
  }
}
