import { buildResourceName, getStage } from "@article-gpt/helpers";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ArticleGPTApiGateway, DynamoDBConstruct } from "@article-gpt/cdk-constructs";
import { Invoke, Stitch, UploadMarkdown, WillV2 } from "./resources/functions";

export class ArticleStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const openAiInvocations = new DynamoDBConstruct(this, "OpenAi-Invocations", {
      tableName: buildResourceName("OpenAi-Invocations"),
    });

    const invoke = new Invoke(this, "Invoke");

    const willV2 = new WillV2(this, "WillV2");

    const stitch = new Stitch(this, "Stitch", {
      table: openAiInvocations.table,
      invoke: invoke.function,
    });

    const uploadMarkdown = new UploadMarkdown(this, "UploadMarkdown");

    new ArticleGPTApiGateway(this, "api-gateway", {
      stage,
      willV2,
      stitch,
      uploadMarkdown,
    });
  }
}
