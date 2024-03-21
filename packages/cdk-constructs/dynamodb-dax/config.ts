import { Construct } from "constructs";
import { Table, AttributeType, BillingMode, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { CfnCluster, CfnSubnetGroup } from 'aws-cdk-lib/aws-dax';
import { Effect, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { IVpc,  SubnetType } from 'aws-cdk-lib/aws-ec2';
import { CfnResource } from "aws-cdk-lib";

export interface DynamoDBDaxConstructProps {
    nodeType: string;
    vpc: IVpc; // Add VPC to the properties
}

export class DynamoDBDaxConstruct extends Construct {
  public readonly table: Table;
  public readonly daxCluster: CfnCluster;
  public readonly daxEndpoint : string;

  constructor(scope: Construct, id: string, props: DynamoDBDaxConstructProps) {
    super(scope, id);
    const { nodeType, vpc } = props;

    // Define the DynamoDB table
    const table = new Table(this, `${id}-ddb-token-table`, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,
    });

    // Create an IAM role for DAX
    const daxRole = new Role(this, `${id}-dax-role`, {
        assumedBy: new ServicePrincipal('dax.amazonaws.com'),
        description: "Role for DAX cluster access",
    });

    daxRole.addToPolicy(new PolicyStatement({
      resources: ["*"],
      actions: [
        "dax:*",
        "dynamodb:*",
        "cloudwatch:GetMetricData",
        "cloudwatch:ListMetrics",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "iam:PassRole"
      ],
      effect: Effect.ALLOW,
    }));

    // Define the subnet group for the DAX cluster
    const daxSubnetGroup = new CfnSubnetGroup(this, `${id}-dax-subnet-group`, {
        subnetGroupName: `${id}-dax-subnet-group`,
        subnetIds: vpc.selectSubnets({ subnetType: SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
        description: "Subnet group for the DAX cluster",
    });

    // Define the DAX cluster
    const daxCluster = new CfnCluster(this, `${id}-dax-cluster`, {
        iamRoleArn: daxRole.roleArn,
        nodeType: nodeType,
        replicationFactor: 1, // Adjust for production as needed
        subnetGroupName: daxSubnetGroup.toString(),
    });

    this.daxCluster = daxCluster;
  
    this.daxEndpoint = daxCluster.attrClusterDiscoveryEndpoint;

    this.daxCluster.addDependency(table as unknown as CfnResource);
    }
}