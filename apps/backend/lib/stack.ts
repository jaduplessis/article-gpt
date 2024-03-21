import { getStage } from "@article-gpt/helpers";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
export class ArticleStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();
  }
}
