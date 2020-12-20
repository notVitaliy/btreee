import { STATUS } from '../status'
import { ParallelNode } from '../'

export const parallelNode: ParallelNode = (nodes, successReq, failureReq) => () => {
  const map = new Map()

  for (let leaf of nodes()) {
    map.set(leaf, null)
  }

  const recurse = (): STATUS => {
    const statuses = Array.from(map.values())
    const successes = statuses.filter((status) => status === STATUS.SUCCESS)
    if (successes.length === successReq) return STATUS.SUCCESS

    const failures = statuses.filter((status) => status === STATUS.FAILURE)
    if (failures.length === failureReq) return STATUS.FAILURE

    return recurse()
  }

  Array.from(map.keys()).forEach((leaf) => leaf())

  return recurse()
}
