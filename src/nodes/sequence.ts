import { STATUS } from '../status'
import { SequenceNode } from '../'

export const sequenceNode: SequenceNode = (nodes) => async () => {
  for (let node of nodes()) {
    const status = await node()
    if (status !== STATUS.SUCCESS) return status
  }

  return STATUS.SUCCESS
}
