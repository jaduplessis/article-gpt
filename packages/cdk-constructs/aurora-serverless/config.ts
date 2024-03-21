import { Construct } from "constructs";
import { SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import {
  DatabaseSecret,
  CfnDBCluster,
  DatabaseCluster,
  DatabaseClusterEngine,
  AuroraPostgresEngineVersion,
  ParameterGroup,
  Credentials,
  ClusterInstance,
  ISubnetGroup,
} from "aws-cdk-lib/aws-rds";
import { RemovalPolicy } from "aws-cdk-lib";
import { getStage } from "@gen-ai-poc/helpers";

export interface GenAiPocAuroraProps {
  vpc: Vpc;
  securityGroup: SecurityGroup;
  dbSecret: DatabaseSecret;
  dbName: string;
  subnet: ISubnetGroup;
}

enum ServerlessInstanceType {
  SERVERLESS = "serverless",
}

const stage = getStage();

export class GenAiPocAurora extends Construct {
  public readonly cluster: DatabaseCluster;
  public readonly clusterArn: string;

  constructor(scope: Construct, id: string, props: GenAiPocAuroraProps) {
    super(scope, id);

    const { dbSecret, dbName, vpc, securityGroup, subnet } = props;
    const pmGroup = ParameterGroup.fromParameterGroupName(
      this,
      "ParameterGroup",
      "default.aurora-postgresql15",
    );
    this.cluster = new DatabaseCluster(this, `${stage}-vector-db`, {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_15_4,
      }),

      serverlessV2MaxCapacity: 8,
      serverlessV2MinCapacity: 2,
      vpc: vpc,
      securityGroups: [securityGroup],
      subnetGroup: subnet,
      parameterGroup: pmGroup,
      credentials: Credentials.fromSecret(dbSecret),
      clusterIdentifier: `${stage}-vector-cluster`,
      defaultDatabaseName: dbName,
      removalPolicy: RemovalPolicy.DESTROY,
      writer: ClusterInstance.serverlessV2(`${stage}-write-instance`, {
        parameterGroup: pmGroup,
        publiclyAccessible: false,
        autoMinorVersionUpgrade: true,
        allowMajorVersionUpgrade: false,
      }),
      readers: [
        ClusterInstance.serverlessV2(`${stage}-reader-instance`, {
          parameterGroup: pmGroup,
          publiclyAccessible: false,
          autoMinorVersionUpgrade: true,
          allowMajorVersionUpgrade: false,
        }),
      ],
    });
    const cfnDatabase = this.cluster.node.defaultChild as CfnDBCluster;
    const cluster_node = this.cluster.node.defaultChild as CfnDBCluster;
    cluster_node.addPropertyOverride("DeletionProtection", false);
    cluster_node.addPropertyOverride("EnableHttpEndpoint", true);
    this.clusterArn = cfnDatabase.attrDbClusterArn;
  }
}
