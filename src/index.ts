import { STATUS } from './status'
export { STATUS }

export type Action = () => Promise<STATUS>

export type InverterNode = (node: Action) => Action
export type SequenceNode = (nodes: () => Action[]) => Action
export type SelectorNode = (nodes: () => Action[]) => Action
export type ParallelNode = (
  nodes: () => Action[],
  successReq: number,
  failureReq: number,
) => Action

export type LeafNode = (action: Action) => Action

export type RootNode = () => Action

export * from './tree'
export * from './nodes/leaf'
export * from './nodes/inverter'
export * from './nodes/parallel'
export * from './nodes/selector'
export * from './nodes/sequence'
