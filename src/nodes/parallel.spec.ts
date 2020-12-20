import { STATUS } from '..'
import { parallelNode } from './parallel'

describe(`parallelNode`, () => {
  const m1 = jest.fn()
  const m2 = jest.fn()
  const m3 = jest.fn()
  const m4 = jest.fn()

  beforeEach(() => {
    m1.mockReset().mockReturnValue(STATUS.SUCCESS)
    m2.mockReset().mockReturnValue(STATUS.SUCCESS)
    m3.mockReset().mockReturnValue(STATUS.SUCCESS)
    m4.mockReset().mockReturnValue(STATUS.SUCCESS)
  })

  it('should run all the nodes (all success)', () => {
    parallelNode(() => [m1, m2, m3, m4], Infinity, Infinity)()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).toHaveBeenCalled()
    expect(m4).toHaveBeenCalled()
  })

  it('should run all the nodes (some failures)', () => {
    m2.mockReturnValueOnce(STATUS.FAILURE)
    m4.mockReturnValueOnce(STATUS.FAILURE)

    parallelNode(() => [m1, m2, m3, m4], Infinity, Infinity)()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).toHaveBeenCalled()
    expect(m4).toHaveBeenCalled()
  })

  it('should run all the nodes (all failures)', () => {
    m1.mockReturnValueOnce(STATUS.FAILURE)
    m2.mockReturnValueOnce(STATUS.FAILURE)
    m3.mockReturnValueOnce(STATUS.FAILURE)
    m4.mockReturnValueOnce(STATUS.FAILURE)

    parallelNode(() => [m1, m2, m3, m4], Infinity, Infinity)()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).toHaveBeenCalled()
    expect(m4).toHaveBeenCalled()
  })

  it('should return success when success requirement met', () => {
    m2.mockReturnValueOnce(STATUS.FAILURE)
    m4.mockReturnValueOnce(STATUS.FAILURE)

    const status = parallelNode(() => [m1, m2, m3, m4], 2, Infinity)()

    expect(status).toEqual(STATUS.SUCCESS)
  })

  it('should return failure when failure requirement met', () => {
    m2.mockReturnValueOnce(STATUS.FAILURE)
    m4.mockReturnValueOnce(STATUS.FAILURE)

    const status = parallelNode(() => [m1, m2, m3, m4], Infinity, 2)()

    expect(status).toEqual(STATUS.FAILURE)
  })

  it('should return failure when no requirements met', () => {
    m2.mockReturnValueOnce(STATUS.FAILURE)
    m4.mockReturnValueOnce(STATUS.FAILURE)

    const status = parallelNode(() => [m1, m2, m3, m4], Infinity, Infinity)()

    expect(status).toEqual(STATUS.FAILURE)
  })
})
