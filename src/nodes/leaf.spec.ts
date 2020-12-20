import { leafNode } from './leaf'

enum mockSTATUS {
  MOCK = 'MOCK',
}

describe('leafNode', () => {
  it('should execute the action', () => {
    const mockAction = jest.fn()

    leafNode(mockAction)()

    expect(mockAction).toHaveBeenCalled()
  })

  it('should return a status', () => {
    const mockAction = jest.fn().mockImplementation(() => mockSTATUS.MOCK)

    const result = leafNode(mockAction)()

    expect(result).toBe(mockSTATUS.MOCK)
  })
})
