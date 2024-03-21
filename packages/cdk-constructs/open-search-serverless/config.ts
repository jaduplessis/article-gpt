import { Construct } from "constructs";
import { getStage } from "@gen-ai-poc/helpers";
import {
  CfnAccessPolicy,
  CfnCollection,
  CfnSecurityPolicy,
} from "aws-cdk-lib/aws-opensearchserverless";

export interface OpenSearchServerlessCollectionProps {
  collectionName: string;
  description?: string;
  bedrockAccessRole: string;
  lambdaAcessRole: string;
}

export class OpenSearchServerlessCollection extends Construct {
  public readonly collectionEndpoint: string;
  public readonly collectionArn: string;

  constructor(
    scope: Construct,
    id: string,
    props: OpenSearchServerlessCollectionProps,
  ) {
    super(scope, id);

    const {
      collectionName,
      description = "OpenSearch Serverless Collection",
      bedrockAccessRole,
      lambdaAcessRole,
    } = props;

    const stage = getStage();
    // Define security policies
    const networkSecurityPolicy =
      this.createNetworkSecurityPolicy(collectionName);
    const encryptionSecurityPolicy =
      this.createEncryptionSecurityPolicy(collectionName);

    // Create the collection
    const collection = new CfnCollection(this, `${stage}-bedrock-collection `, {
      name: collectionName,
      description,
      type: "VECTORSEARCH",
    });

    // Ensure collection creation waits for security policies
    collection.addDependency(networkSecurityPolicy);
    collection.addDependency(encryptionSecurityPolicy);

    // Create the data access policy using the provided IAM role
    this.createDataAccessPolicy(
      collectionName,
      bedrockAccessRole,
      lambdaAcessRole,
    );

    this.collectionEndpoint = collection.attrCollectionEndpoint;
    this.collectionArn = collection.attrArn;
  }

  private createNetworkSecurityPolicy(
    collectionName: string,
  ): CfnSecurityPolicy {
    const networkSecurityPolicy = JSON.stringify(
      [
        {
          Rules: [
            {
              Resource: [`collection/${collectionName}`],
              ResourceType: "dashboard",
            },
            {
              Resource: [`collection/${collectionName}`],
              ResourceType: "collection",
            },
          ],
          AllowFromPublic: true,
        },
      ],
      null,
      2,
    );

    return new CfnSecurityPolicy(this, "NetworkSecurityPolicy", {
      policy: networkSecurityPolicy,
      name: `${collectionName}-sec-policy`,
      type: "network",
    });
  }

  private createEncryptionSecurityPolicy(
    collectionName: string,
  ): CfnSecurityPolicy {
    const encryptionSecurityPolicy = JSON.stringify({
      Rules: [
        {
          Resource: [`collection/${collectionName}`],
          ResourceType: "collection",
        },
      ],
      AWSOwnedKey: true,
    });

    return new CfnSecurityPolicy(this, "EncryptionSecurityPolicy", {
      policy: encryptionSecurityPolicy,
      name: `${collectionName}-enc-policy`,
      type: "encryption",
    });
  }

  private createDataAccessPolicy(
    collectionName: string,
    bedrockAccessRole: string,
    lambdaAcessRole: string,
  ): CfnAccessPolicy {
    const policy = JSON.stringify(
      [
        {
          Rules: [
            {
              Resource: [`collection/${collectionName}`],
              Permission: [
                "aoss:CreateCollectionItems",
                "aoss:DeleteCollectionItems",
                "aoss:UpdateCollectionItems",
                "aoss:DescribeCollectionItems",
              ],
              ResourceType: "collection",
            },
            {
              Resource: [`index/${collectionName}/*`],
              Permission: [
                "aoss:CreateIndex",
                "aoss:DeleteIndex",
                "aoss:UpdateIndex",
                "aoss:DescribeIndex",
                "aoss:ReadDocument",
                "aoss:WriteDocument",
              ],
              ResourceType: "index",
            },
          ],
          Principal: [bedrockAccessRole, lambdaAcessRole],
          Description: "data-access-rule",
        },
      ],
      null,
      2,
    );

    return new CfnAccessPolicy(this, "DataAccessPolicy", {
      policy: policy,
      name: `${collectionName}-access`,
      type: "data",
    });
  }
}
