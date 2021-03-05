import { SelectorNode } from '../'
import { STATUS } from '../status'

export const selectorNode: SelectorNode = (nodes) => async () => {
  for (let node of nodes()) {
    const status = await node()
    if (status !== STATUS.FAILURE) return status
  }

  return STATUS.FAILURE
}
