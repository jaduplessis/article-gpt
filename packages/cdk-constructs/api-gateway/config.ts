import { buildResourceName } from "@article-gpt/helpers";
import { CfnOutput } from "aws-cdk-lib";
import {
  ApiKey,
  ApiKeySourceType,
  LambdaIntegration,
  RestApi,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface RestApiFunctions {
  function: NodejsFunction;
}

interface ArticleGPTApiGatewayProps {
  stage: string;
  willV2: RestApiFunctions;
}

export class ArticleGPTApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: ArticleGPTApiGatewayProps) {
    super(scope, id);

    const { stage, willV2 } = props;

    const api = new RestApi(this, "api-gateway", {
      restApiName: buildResourceName(this, "api-gateway"),
      deployOptions: {
        stageName: stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["*"],
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    const apiKey = new ApiKey(this, buildResourceName(this, "api-key"));

    const usagePlan = new UsagePlan(this, "usage-plan", {
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
        },
      ],
    });

    usagePlan.addApiKey(apiKey);

    const willV2Generation = api.root.addResource("will-v2-generation");
    const willV2Integration = new LambdaIntegration(willV2.function);
    willV2Generation.addMethod("POST", willV2Integration, {
      apiKeyRequired: true,
    });

    new CfnOutput(this, "apiKey", {
      description: "API Key",
      value: apiKey.keyId
    });
  }
}