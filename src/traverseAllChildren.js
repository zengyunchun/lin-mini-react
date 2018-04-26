const SEPARATOR = '.'
const SUBSEPARATOR = ':'


function getComponentKey(component, index) {
    // 这里应该用属性中的key来生成唯一id用来识别元素的唯一性，
    // 只是简单的用index来当作key
    return index.toString(36)
}

function traverseAllChildren(children, callback, traverseContext) {
    return traverseAllChildrenImpl(children, '', callback, traverseContext)
}

function traverseAllChildrenImpl(children,nameSoFar,callback,traverseContext) {
    // 如果是原生元素如'div', 就实例元素并加入子节点的上下文，callback就是instantiateChild
    if ( typeof children === 'string' || typeof children === 'number' || !Array.isArray(children)) {
        callback(traverseContext,children, nameSoFar + SEPARATOR + getComponentKey(children, 0))
        return 1
    }
    // 否则继续递归遍历， 实例化所有节点
    let subtreeCount = 0
    const namePrefix = !nameSoFar ? SEPARATOR : nameSoFar + SUBSEPARATOR
    children.forEach((child, i) => {
        subtreeCount += traverseAllChildrenImpl(
            child,
            namePrefix + getComponentKey(child, i),
            callback,
            traverseContext
        )
    })

    return subtreeCount
}

module.exports = traverseAllChildren
