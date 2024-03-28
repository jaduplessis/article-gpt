import { Entity, EntityItem } from 'dynamodb-toolbox';
import { OpenAiInvocationsTable } from './Table';

export const InvocationEntity = new Entity({
  name: 'InvocationItem',
  attributes: {
    PK: { partitionKey: true, hidden: true, prefix: 'INVOCATION#' },
    SK: { sortKey: true, hidden: true, default: 'ROOT' },
    genId: ['PK', 0,{ type: 'string', required: true }],
    status: { type: 'string', required: true },
    sourceFunction: { type: 'string', required: true },
    inputLocation: { type: 'string' },
    outputLocation: { type: 'string' },
  },
  table: OpenAiInvocationsTable,
} as const);


export type IInvocation = EntityItem<typeof InvocationEntity>;