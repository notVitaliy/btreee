import { SelectorNode } from '../'
import { STATUS } from '../status'

export const selectorNode: SelectorNode = (nodes) => () => {
  for (let node of nodes()) {
    const status = node()
    if (status !== STATUS.FAILURE) return status
  }

  return STATUS.SUCCESS
}
