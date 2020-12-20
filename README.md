# Btreee

> The extra `e` is for... `error`

## Install

```
yarn add btreee
```

## How to use

Start off by creating the root of your tree with a node. The root node must be one of `leafNode`, `sequenceNode`, `selectorNode`, `inverterNode`, or `parallelNode`.

Each "branch" of the tree must terminate with a leaf node that returns a `STATUS`.

`Tree`

- The main constructor/entry point for `btreee`
- Takes in a funciton that returns a single node.

`sequenceNode`

- Takes in a function that returns an array of nodes.
- Will keep running nodes until an explicit `STATUS.FAILURE`.
- Will return `STATUS.SUCCESS` is all nodes succeeded.
- Will return `STATUS.FAILURE` if any node failed.

`selectorNode`

- Takes in a function that returns an array of nodes.
- Will keep running nodes until an explicit `STATUS.SUCCESS`.
- Will return `STATUS.SUCCESS` is any node succeeded.
- Will return `STATUS.FAILURE` if all nodes failed.

`leafNode`

- Takes in a function that returns a `STATUS`.

`inverterNode`

- Takes in a node and inverts that nodes `STATUS`.

`parallelNode`

- Takes in a function that returns an array of nodes.
- Param 2 is the minimum amount of successes required to return `STATUS.SUCCESS`
- Param 3 is the minimum amount of failures required to return `STATUS.FAILURE`
- This will run _all_ of the nodes given to it and evaluate once those are done

---

## Basic Example

```typescript
import { Tree, sequenceNode, selectorNode, leafNode, STATUS } from 'btreee'

const tree = new Tree()

// Set the root of the tree
tree.setRoot(
  // Run everything in array until fail
  () =>
    sequenceNode(() => [
      // If not hungry, fail and stop sequence
      leafNode(() => (amIHungry() ? STATUS.SUCCESS : STATUS.FAILURE)),

      // Run everything in array until fail
      sequenceNode(() => [
        // Run until a success
        selectorNode(() => [
          leafNode(() =>
            isThereSomethingIReallyWant() ? STATUS.SUCCESS : STATUS.FAILURE,
          ),
          leafNode(() => (isThereAnyFood() ? STATUS.SUCCESS : STATUS.FAILURE)),
          leafNode(() => (areThereDrinks() ? STATUS.SUCCESS : STATUS.FAILURE)),
        ]),

        // Only executes is previous node returned a success
        leafNode(() => eatOrDrink() && STATUS.SUCCESS),
      ]),
    ]),
)

// Executes the tree
tree.tick()
```

---

## Complex Example

Let's assume we have an `EvilNPC` we want to give some behivors to. Here is the interface:

```typescript
type Direction = 'forward' | 'backward'

interface EvilNPC {
  // Senses
  getHealth: () => number // 0-100
  feel: (
    direction: Direction,
  ) => {
    isEmpty: () => boolean
    isWall: () => boolean
    isUnit: () => boolean
    getUnit: () => {
      isEnemy: () => boolean
    }
  }

  // Actions
  walk: (direction: Direction) => void
  attack: (direction: Direction) => void
  pivot: () => void
  heal: () => void
}
```

Our goal is to have this npc seek out and kill the player. The game world is very rudimentary, there's only forward and backward.

Here's what our basic tree would look like. Start reading from the bottom up to get a better understanding. Below is flowchart.

```typescript
import { Tree, sequenceNode, selectorNode, leafNode, STATUS } from 'btreee'

const evilNpc: EvilNPC = new EvilNPC()

// NPC State
const state: {
  health: number
  direction: Direction
} = {
  health: 100,
  direction: 'forward',
}

// Simple Helper Functions
const isSomethingThere = (direction: Direction) =>
  evilNpc.feel(direction).isEmpty() ? STATUS.FAILURE : STATUS.SUCCESS

const isSomethingInFrontOfMe = () => leafNode(() => isSomethingThere('forward'))
const isSomethingBehindMe = () => leafNode(() => isSomethingThere('backward'))

const isWallInFrontOfMe = () =>
  sequenceNode(() => [
    isSomethingInFrontOfMe(),
    leafNode(() =>
      evilNpc.feel('forward').isWall() ? STATUS.SUCCESS : STATUS.FAILURE,
    ),
  ])

const isUnitInFrontOfMe = () =>
  sequenceNode(() => [
    isSomethingInFrontOfMe(),
    leafNode(() =>
      evilNpc.feel('forward').isUnit() ? STATUS.SUCCESS : STATUS.FAILURE,
    ),
  ])

const isEnemyInFrontOfMe = () =>
  sequenceNode(() => [
    isUnitInFrontOfMe(),
    leafNode(() =>
      evilNpc.feel('forward').getUnit().isEnemy()
        ? STATUS.SUCCESS
        : STATUS.FAILURE,
    ),
  ])

const isWallBehindMe = () =>
  sequenceNode(() => [
    isSomethingBehindMe(),
    leafNode(() =>
      evilNpc.feel('backward').isWall() ? STATUS.SUCCESS : STATUS.FAILURE,
    ),
  ])

const isUnitBehindMe = () =>
  sequenceNode(() => [
    isSomethingBehindMe(),
    leafNode(() =>
      evilNpc.feel('backward').isUnit() ? STATUS.SUCCESS : STATUS.FAILURE,
    ),
  ])

const isEnemyBehindMe = () =>
  sequenceNode(() => [
    isUnitBehindMe(),
    leafNode(() =>
      evilNpc.feel('backward').getUnit().isEnemy()
        ? STATUS.SUCCESS
        : STATUS.FAILURE,
    ),
  ])

const shouldIHeal = () =>
  leafNode(() => (state.health <= 25 ? STATUS.SUCCESS : STATUS.FAILURE))

// Leaf Nodes / Actions
const walk = (direction: Direction) =>
  leafNode(() => (evilNpc.walk(direction), STATUS.SUCCESS))
const attack = (direction: Direction) =>
  leafNode(() => (evilNpc.attack(direction), STATUS.SUCCESS))
const pivot = () => {
  state.direction = state.direction === 'forward' ? 'backward' : 'forward'
  return leafNode(() => (evilNpc.pivot(), STATUS.SUCCESS))
}
const heal = () => leafNode(() => (evilNpc.heal(), STATUS.SUCCESS))

// Sequences
const hunter = () =>
  selectorNode(() => [
    selectorNode(() => [isEnemyBehindMe(), attack('backward')]),
    selectorNode(() => [isEnemyInFrontOfMe(), attack('forward')]),
  ])

const pivoter = () =>
  selectorNode(() => [
    sequenceNode(() => [isWallInFrontOfMe(), pivot()]),
    sequenceNode(() => [isWallBehindMe(), pivot()]),
  ])

const walker = () => sequenceNode(() => [pivoter(), walk(state.direction)])
const healer = () => sequenceNode(() => [shouldIHeal(), heal()])

const actions = () => selectorNode(() => [hunter(), walker(), healer()])
const preActions = () =>
  leafNode(() => ((state.health = evilNpc.getHealth()), STATUS.SUCCESS))

const root = () => sequenceNode(() => [preActions(), actions()])

const tree = new Tree()
tree.setRoot(root)

const tick = () =>
  process.nextTick(() => {
    tree.tick()
    tick()
  })
```

![flowchart](https://raw.githubusercontent.com/notVitaliy/btreee/master/assets/flowchart.svg)
