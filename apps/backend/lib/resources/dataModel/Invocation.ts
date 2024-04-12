import { Entity, EntityItem } from 'dynamodb-toolbox';
import { OpenAiInvocationsTable } from './Table';

export const InvocationEntity = new Entity({
  name: 'InvocationItem',
  attributes: {
    PK: { partitionKey: true, hidden: true, prefix: 'INVOCATION#' },
    SK: { sortKey: true, hidden: true, default: 'ROOT' },
    connectionId: ['PK', 0,{ type: 'string', required: true }],
    status: { type: 'string', required: true },
    sourceFunction: { type: 'string', required: true },
    inputLocation: { type: 'string' },
    outputLocation: { type: 'map' },
    data: { type: 'string' },
  },
  table: OpenAiInvocationsTable,
} as const);


type DDBInvocation = EntityItem<typeof InvocationEntity>;
export type IInvocation = Omit<DDBInvocation, 'outputLocation'> & { 
  outputLocation?: { key: string, bucket: string } };