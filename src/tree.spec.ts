import { Tree } from './tree'

describe('Tree', () => {
  const m1 = jest.fn()

  beforeEach(() => {
    m1.mockReset()
  })

  it('should set a root', () => {
    const tree = new Tree()

    tree.setRoot(() => m1)

    expect(tree['root']).toBeTruthy()
  })

  it('should not run node when setting a root', () => {
    const tree = new Tree()

    tree.setRoot(() => m1)

    expect(m1).not.toHaveBeenCalled()
  })

  it('should not tick when setting a root', () => {
    const tree = new Tree()
    const spy = jest.spyOn(tree, 'tick')

    tree.setRoot(() => m1)

    expect(spy).not.toHaveBeenCalled()
  })

  it('should run node when tick', () => {
    const tree = new Tree()

    tree.setRoot(() => m1)
    tree.tick()

    expect(m1).toHaveBeenCalled()
  })
})
