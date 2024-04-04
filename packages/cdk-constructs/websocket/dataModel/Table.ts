import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Table } from "dynamodb-toolbox";

import { buildResourceName, getRegion } from "@article-gpt/helpers";

const documentClient = new DynamoDB({
  region: getRegion(),
});

export const WsConnectionTable = new Table({
  name: buildResourceName("WsConnectionTable"),
  partitionKey: "PK",
  sortKey: "SK",
  indexes: {
    GSI1: {
      partitionKey: "GSI1PK",
      sortKey: "GSI1SK",
    },
  },
  DocumentClient: documentClient,
} as const);
