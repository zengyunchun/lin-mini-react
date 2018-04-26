
/**
 * 元素对象 => 组件对象 的方法
 */
const DOMComponent = require('./DOMComponent')

function instantiateComponent(element) {
  let componentInstance

  if (typeof element.type === 'function') {   // 实例化组件
    // 这里element.type实际上就是new了一个class,
    // type相当于调用构造函数constructor
    componentInstance = new element.type(element.props)
    componentInstance._construct(element)
  } else if (typeof element.type === 'string') {  // div, h1 等DOM元素
    componentInstance = new DOMComponent(element)
  } else if (typeof element === 'string' || typeof element === 'number') {  // 单纯的文字包裹在span里面
    componentInstance = new DOMComponent({
      type: 'span',
      props: { children: element }
    })
  }

  return componentInstance
}

module.exports = instantiateComponent
