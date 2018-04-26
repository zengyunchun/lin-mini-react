const ChildReconciler = require('./ChildReconciler')
const Reconciler = require('./Reconciler')
const { UPDATE_TYPES, OPERATIONS } = require('./operations')
const traverseAllChildren = require('./traverseAllChildren')
const DOM = require('./DOM')

function flattenChildren(children) {
  const flattenedChildren = {}
  traverseAllChildren(
    children,
    (context, child, name) => context[name] = child,
    flattenedChildren
  )
  return flattenedChildren
}

// this is responsible for the real updates of the diffing tree
function processQueue(parentNode, updates) {
  updates.forEach(update => {
    switch (update.type) {
      case UPDATE_TYPES.INSERT:
        DOM.insertAfter(parentNode, update.content, update.afterNode)
        break

      case UPDATE_TYPES.MOVE:
        // this automatically removes and inserts the new child
        DOM.insertAfter(
          parentNode,
          update.content,
          update.afterNode
        )
        break

      case UPDATE_TYPES.REMOVE:
        DOM.removeChild(parentNode, update.fromNode)
        break

      default:
        assert(false)
    }
  })
}

class MultiChild {
  constructor() {
    this._renderedChildren = null
  }

  mountChildren(children) {
    // element => Components的过程
    const childrenComponents = ChildReconciler.instantiateChildren(children)
    this._renderedChildren = childrenComponents

    /*
    {
      '.0.0': {_currentElement, ...}
      '.0.1': {_currentElement, ...}
    }
    */
    // 遍历数组components调用自身的mount来实例化组件并返回节点
    // component => node节点实例化的过程
    const childrenNodes = Object.keys(childrenComponents).map((childKey, i) => {
      const childComponent = childrenComponents[childKey]

      childComponent._mountIndex = i

      return Reconciler.mountComponent(childComponent)
    })

    return childrenNodes
  }

  unmountChildren() {
    ChildReconciler.unmountChildren(this._renderedChildren)
  }

  updateChildren(nextChildren) {
    // component tree
    let prevRenderedChildren = this._renderedChildren
    // element tree
    let nextRenderedChildren = flattenChildren(nextChildren)
    
    let mountNodes = []
    let removedNodes = {}
    
    ChildReconciler.updateChildren(
      prevRenderedChildren,
      nextRenderedChildren,
      mountNodes,
      removedNodes
    )
    // We'll compare the current set of children to the next set.
    // We need to determine what nodes are being moved around, which are being
    // inserted, and which are getting removed. Luckily, the removal list was
    // already determined by the ChildReconciler.

    // We'll generate a series of update operations here based on the 
    // bookmarks that we've made just now
    let updates = []

    let lastIndex = 0
    let nextMountIndex = 0
    let lastPlacedNode = null

    Object.keys(nextRenderedChildren).forEach((childKey, nextIndex) => {
      let prevChild = prevRenderedChildren[childKey]
      let nextChild = nextRenderedChildren[childKey]

      // mark this as an update if they are identical
      if (prevChild === nextChild) {
        // We don't actually need to move if moving to a lower index. 
        // Other operations will ensure the end result is correct.
        if (prevChild._mountIndex < lastIndex) {
          updates.push(OPERATIONS.move(nextChild, lastPlacedNode))
        }

        lastIndex = Math.max(prevChild._mountIndex, lastIndex)
        prevChild._mountIndex = nextIndex
      } else {
        // Otherwise we need to record an insertion.
        // First, if we have a prevChild then we know it's a removal.
        // We want to update lastIndex based on that.
        if (prevChild) {
          lastIndex = Math.max(prevChild._mountIndex, lastIndex)
        }

        nextChild._mountIndex = nextIndex
        updates.push(
          OPERATIONS.insert(
            mountNodes[nextMountIndex],
            lastPlacedNode
          )
        )
        nextMountIndex ++
      }

      // keep track of lastPlacedNode
      lastPlacedNode = nextChild._domNode
    })

    // enque the removal the non-exsiting nodes
    Object.keys(removedNodes).forEach((childKey) =>  {
      updates.push(
        OPERATIONS.remove(removedNodes[childKey])
      )
    })

    // do the actual updates
    processQueue(this._domNode, updates)

    // at this point, nextRenderedChildren has already become a component tree
    // rather than the original element tree
    this._renderedChildren = nextRenderedChildren
  }
}

module.exports = MultiChild
