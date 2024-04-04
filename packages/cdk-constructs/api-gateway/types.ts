import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface RestApiFunctions {
  function: NodejsFunction;
}

export interface ArticleGPTApiGatewayProps {
  stage: string;
  willV2: RestApiFunctions;
  stitch: RestApiFunctions;
  uploadMarkdown: RestApiFunctions;
}
