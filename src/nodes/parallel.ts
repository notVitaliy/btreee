import { STATUS } from '../status'
import { ParallelNode } from '../'

export const parallelNode: ParallelNode = (
  nodes,
  successReq,
  failureReq,
) => () => {
  const statuses = nodes().map((leaf) => leaf())

  const successes = statuses.filter((status) => status === STATUS.SUCCESS)
  if (successes.length === successReq) return STATUS.SUCCESS

  const failures = statuses.filter((status) => status === STATUS.FAILURE)
  if (failures.length === failureReq) return STATUS.FAILURE

  return STATUS.FAILURE
}
