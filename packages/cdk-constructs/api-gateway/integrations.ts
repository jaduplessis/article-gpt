import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ArticleGPTApiGatewayProps } from "./types";

interface CreateIntegrationsProps extends ArticleGPTApiGatewayProps {
  api: RestApi;
}

export const createIntegrations = (props: CreateIntegrationsProps) => {
  const { api } = props;

  const willV2endPoint = api.root.addResource("will-v2-generation");
  const willV2Integration = new LambdaIntegration(props.willV2.function);
  willV2endPoint.addMethod("POST", willV2Integration, {
    apiKeyRequired: true,
  });

  const stitchEndPoint = api.root.addResource("stitch");
  const stitchIntegration = new LambdaIntegration(props.stitch.function);
  stitchEndPoint.addMethod("POST", stitchIntegration, {
    apiKeyRequired: true,
  });

  const uploadMarkdownEndPoint = api.root.addResource("upload-markdown");
  const uploadMarkdownIntegration = new LambdaIntegration(
    props.uploadMarkdown.function
  );
  uploadMarkdownEndPoint.addMethod("POST", uploadMarkdownIntegration, {
    apiKeyRequired: true,
  });
};
