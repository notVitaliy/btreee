import { STATUS } from '../status'
import { InverterNode } from '../'

export const inverterNode: InverterNode = (node) => async () => {
  const status = await node()
  if (status === STATUS.SUCCESS) return STATUS.FAILURE
  else if (status === STATUS.FAILURE) return STATUS.SUCCESS
  else return STATUS.RUNNING
}
