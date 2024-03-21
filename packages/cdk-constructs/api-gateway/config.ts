import { ApiDefinition, SpecRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { readFileSync } from "fs";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";

export interface GenAiPocGatewayProps {
  invokeFunction: IFunction;
  generateUrlFunction: IFunction;
}

export class GenAiPocGateway extends SpecRestApi {
  constructor(scope: Construct, id: string, props: GenAiPocGatewayProps) {
    const { invokeFunction, generateUrlFunction } = props;

    let openApiSpec = readFileSync(__dirname + "/open_api.json", "utf8");

    // Replace placeholders separately
    openApiSpec = openApiSpec.replace(
      "${invoke_model}",
      invokeFunction.functionArn,
    );
    openApiSpec = openApiSpec.replace(
      "${generate_presigned_url}",
      generateUrlFunction.functionArn,
    );

    // Parse the modified JSON string
    openApiSpec = JSON.parse(openApiSpec);

    super(scope, `${id}`, {
      apiDefinition: ApiDefinition.fromInline(openApiSpec),
    });

    // Grant the API Gateway service principal permissions to invoke the lambda
    invokeFunction.grantInvoke(
      new ServicePrincipal("apigateway.amazonaws.com"),
    );
    generateUrlFunction.grantInvoke(
      new ServicePrincipal("apigateway.amazonaws.com"),
    );

    // Add a dependency to ensure the lambda function is deployed before the API Gateway
    this.node.addDependency(invokeFunction);
    this.node.addDependency(generateUrlFunction);
  }
}
