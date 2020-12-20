import { STATUS } from '../status'
import { inverterNode } from './inverter'

describe('inverterNode', () => {
  it('should invert a STATUS.SUCCESS', () => {
    const status = inverterNode(() => STATUS.SUCCESS)()

    expect(status).toEqual(STATUS.FAILURE)
  })

  it('should invert a STATUS.FAILURE', () => {
    const status = inverterNode(() => STATUS.FAILURE)()

    expect(status).toEqual(STATUS.SUCCESS)
  })

  it('should keep a STATUS.RUNNING', () => {
    const status = inverterNode(() => STATUS.RUNNING)()

    expect(status).toEqual(STATUS.RUNNING)
  })
})
