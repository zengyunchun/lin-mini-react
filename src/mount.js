/**
 * 向外暴露mount接口
 */

const instantiateComponent = require('./instantiateComponent')
const Reconciler = require('./Reconciler')
const DOM = require('./DOM')

/**
 * 
 * @param {Object} element  与DOM对应的js组件对象
 * @param {Node} node  DOM元素
 */
function render(element, node) {
  // todo: add update
  mount(element, node)
}

/**
 * 
 * @param {Object} element 与DOM对应的js组件对象
 * @param {*} node DOM元素
 */
function mount(element, node) {
  let component = instantiateComponent(element)
  let renderedNode = Reconciler.mountComponent(component)
  
  DOM.empty(node)
  DOM.appendChildren(node, renderedNode)
}

module.exports = {
  render,
}
