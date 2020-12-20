import { Action, RootNode } from './index'

export class Tree {
  private root: Action

  setRoot(root: RootNode) {
    this.root = root()
  }

  tick = () => {
    this.root()
  }
}
