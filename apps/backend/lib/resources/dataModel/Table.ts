import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Table } from "dynamodb-toolbox";

import { buildResourceName, getRegion } from "@article-gpt/helpers";

const documentClient = new DynamoDB({
  region: getRegion(),
});

export const OpenAiInvocationsTable = new Table({
  name: buildResourceName("OpenAi-Invocations"),
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
