import { buildResourceName, getCdkHandlerPath } from "@article-gpt/helpers";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { ArticleGPTCustomResource } from "../../../custom-resource-lambda/config";

interface WsConnectProps {
  connectionTable: Table;
}

export class WsConnect extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, props: WsConnectProps) {
    super(scope, id);

    const { connectionTable } = props;

    this.function = new ArticleGPTCustomResource(
      this,
      buildResourceName("ws-connect"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
        environment: {
          CONN_TABLE_NAME: connectionTable.tableName,
          NODE_OPTIONS: "--enable-source-maps",
        },
      }
    );

    connectionTable.grantReadWriteData(this.function);
  }
}
