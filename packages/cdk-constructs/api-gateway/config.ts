import { buildResourceName } from "@article-gpt/helpers";
import { CfnOutput } from "aws-cdk-lib";
import {
  ApiKey,
  ApiKeySourceType,
  RestApi,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { createIntegrations } from "./integrations";
import { ArticleGPTApiGatewayProps } from "./types";

export class ArticleGPTApiGateway extends Construct {
  public restApi: RestApi;

  constructor(scope: Construct, id: string, props: ArticleGPTApiGatewayProps) {
    super(scope, id);

    const { stage } = props;

    this.restApi = new RestApi(this, "api-gateway", {
      restApiName: buildResourceName("api-gateway"),
      deployOptions: {
        stageName: stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["*"],
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    const apiKey = new ApiKey(this, buildResourceName("api-key"));

    const usagePlan = new UsagePlan(this, "usage-plan", {
      apiStages: [
        {
          api: this.restApi,
          stage: this.restApi.deploymentStage,
        },
      ],
    });

    usagePlan.addApiKey(apiKey);

    createIntegrations({ ...props, api: this.restApi});

    new CfnOutput(this, "apiKey", {
      description: "API Key",
      value: apiKey.keyId,
    });
  }
}
