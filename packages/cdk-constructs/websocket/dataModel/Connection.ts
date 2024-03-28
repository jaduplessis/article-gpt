import { Entity, EntityItem } from "dynamodb-toolbox";
import { WsConnectionTable } from "./Table";

export const WsConnectionEntity = new Entity({
  name: "WsConnectionItem",
  attributes: {
    PK: { partitionKey: true, hidden: true, prefix: "CONNECTION_ID#" },
    SK: { sortKey: true, hidden: true, default: "WS_CONNECTION" },
    connectionId: ["PK", 0, { type: "string", required: true }],
  },
  table: WsConnectionTable,
} as const);

export type IWsConnection = EntityItem<typeof WsConnectionEntity>;
