import { STATUS } from '..'
import { sequenceNode } from './sequence'

describe(`sequenceNode`, () => {
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

  it('should run until failure (first)', () => {
    m1.mockReturnValueOnce(STATUS.FAILURE)

    sequenceNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).not.toHaveBeenCalled()
    expect(m3).not.toHaveBeenCalled()
    expect(m4).not.toHaveBeenCalled()
  })

  it('should run until failure (second)', () => {
    m2.mockReturnValueOnce(STATUS.FAILURE)

    sequenceNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).not.toHaveBeenCalled()
    expect(m4).not.toHaveBeenCalled()
  })

  it('should run until failure (third)', () => {
    m3.mockReturnValueOnce(STATUS.FAILURE)

    sequenceNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).toHaveBeenCalled()
    expect(m4).not.toHaveBeenCalled()
  })

  it('should run all the nodes', () => {
    sequenceNode(() => [m1, m2, m3, m4])()

    expect(m1).toHaveBeenCalled()
    expect(m2).toHaveBeenCalled()
    expect(m3).toHaveBeenCalled()
    expect(m4).toHaveBeenCalled()
  })

  it('should return STATUS.SUCCESS if all nodes succeeded', () => {
    const status = sequenceNode(() => [m1, m2, m3, m4])()

    expect(status).toEqual(STATUS.SUCCESS)
  })

  it('should return STATUS.FAILURE if any nodes failed', () => {
    m3.mockReturnValueOnce(STATUS.FAILURE)

    const status = sequenceNode(() => [m1, m2, m3, m4])()

    expect(status).toEqual(STATUS.FAILURE)
  })
})
