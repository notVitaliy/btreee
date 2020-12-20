import { STATUS } from '..'
import { selectorNode } from './selector'

describe(`selectorNode`, () => {
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

  it('should run until success (first)', () => {
    selectorNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).not.toHaveBeenCalled()
    expect(m3).not.toHaveBeenCalled()
    expect(m4).not.toHaveBeenCalled()
  })

  it('should run until success (second)', () => {
    m1.mockReturnValueOnce(STATUS.FAILURE)

    selectorNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).not.toHaveBeenCalled()
    expect(m4).not.toHaveBeenCalled()
  })

  it('should run until success (third)', () => {
    m1.mockReturnValueOnce(STATUS.FAILURE)
    m2.mockReturnValueOnce(STATUS.FAILURE)

    selectorNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).toHaveBeenCalled()
    expect(m4).not.toHaveBeenCalled()
  })

  it('should run all the nodes', () => {
    m1.mockReturnValueOnce(STATUS.FAILURE)
    m2.mockReturnValueOnce(STATUS.FAILURE)
    m3.mockReturnValueOnce(STATUS.FAILURE)

    selectorNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).toHaveBeenCalled()
    expect(m4).toHaveBeenCalled()
  })

  it('should return STATUS.SUCCESS if any nodes succeeded', () => {
    m3.mockReturnValueOnce(STATUS.SUCCESS)

    const status = selectorNode(() => [m1, m2, m3, m4])()

    expect(status).toEqual(STATUS.SUCCESS)
  })

  it('should return STATUS.FAILURE if all nodes failed', () => {
    m1.mockReturnValueOnce(STATUS.FAILURE)
    m2.mockReturnValueOnce(STATUS.FAILURE)
    m3.mockReturnValueOnce(STATUS.FAILURE)
    m4.mockReturnValueOnce(STATUS.FAILURE)

    const status = selectorNode(() => [m1, m2, m3, m4])()

    expect(status).toEqual(STATUS.FAILURE)
  })
})
