/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/** 
 * component => node
*/

function mountComponent(component) {
  return component.mountComponent();
}

function unmountComponent(component) {
  component.unmountComponent();
}

function receiveComponent(component, nextElement) {
  const prevElement = component._currentElement;
  if (prevElement === nextElement) return;

  component.updateComponent(component._currentElement, nextElement);
}

module.exports = {
  mountComponent,
  unmountComponent,
  receiveComponent
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * 元素对象 => 组件对象 的方法
 */
const DOMComponent = __webpack_require__(10);

function instantiateComponent(element) {
  let componentInstance;

  if (typeof element.type === 'function') {
    // 实例化组件
    // 这里element.type实际上就是new了一个class,
    // type相当于调用构造函数constructor
    componentInstance = new element.type(element.props);
    componentInstance._construct(element);
  } else if (typeof element.type === 'string') {
    // div, h1 等DOM元素
    componentInstance = new DOMComponent(element);
  } else if (typeof element === 'string' || typeof element === 'number') {
    // 单纯的文字包裹在span里面
    componentInstance = new DOMComponent({
      type: 'span',
      props: { children: element }
    });
  }

  return componentInstance;
}

module.exports = instantiateComponent;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * 操作DOM的方法集合
 */

function empty(node) {
  [].slice.call(node, node.childNodes).forEach(node.removeChild, node);
}

function updateStyles(node, styleObj) {
  Object.keys(styleObj).forEach(styleName => {
    node.style[styleName] = styleObj[styleName];
  });
}

function setProperty(node, attr, value) {
  if (attr === 'children') return;
  node.setAttribute(attr, value);
}

function removeProperty(node, attr) {
  node.removeAttribute(attr);
}

function appendChildren(node, children) {
  if (Array.isArray(children)) {
    children.forEach(child => node.appendChild(child));
  } else {
    node.appendChild(children);
  }
}

function removeChild(node, child) {
  node.removeChild(child);
}

function insertAfter(node, child, afterChild) {
  node.insertBefore(child, afterChild ? afterChild.nextSibling : node.firstChild);
}

function replaceNode(prevNode, newNode) {
  const parentNode = prevNode.parentNode;
  empty(parentNode);
  parentNode.appendChild(newNode);
}

module.exports = {
  empty,
  setProperty,
  removeProperty,
  appendChildren,
  removeChild,
  insertAfter,
  updateStyles,
  replaceNode
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

const SEPARATOR = '.';
const SUBSEPARATOR = ':';

function getComponentKey(component, index) {
    // 这里应该用属性中的key来生成唯一id用来识别元素的唯一性，
    // 只是简单的用index来当作key
    return index.toString(36);
}

function traverseAllChildren(children, callback, traverseContext) {
    return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    // 如果是原生元素如'div', 就实例元素并加入子节点的上下文，callback就是instantiateChild
    if (typeof children === 'string' || typeof children === 'number' || !Array.isArray(children)) {
        callback(traverseContext, children, nameSoFar + SEPARATOR + getComponentKey(children, 0));
        return 1;
    }
    // 否则继续递归遍历， 实例化所有节点
    let subtreeCount = 0;
    const namePrefix = !nameSoFar ? SEPARATOR : nameSoFar + SUBSEPARATOR;
    children.forEach((child, i) => {
        subtreeCount += traverseAllChildrenImpl(child, namePrefix + getComponentKey(child, i), callback, traverseContext);
    });

    return subtreeCount;
}

module.exports = traverseAllChildren;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 *  是否应该更新判断
 */

function shouldUpdateComponent(prevElement, nextElement) {
  // if it's still the same type, we update the component
  // instead of unmount and mount from scratch
  return prevElement.type === nextElement.type;
}

module.exports = shouldUpdateComponent;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * 
 * 断言错误
 */

function assert(val) {
  if (!Boolean(val)) {
    throw new Error('assertion failure');
  }
}

module.exports = assert;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 向外暴露mount方法接口
 */

const instantiateComponent = __webpack_require__(1);
const Reconciler = __webpack_require__(0);
const DOM = __webpack_require__(2);

/**
 * 
 * @param {Object} element  与DOM对应的js组件对象
 * @param {Node} node  DOM元素
 */
function render(element, node) {
  // todo: add update
  mount(element, node);
}

/**
 * 
 * @param {Object} element 与DOM对应的js组件对象
 * @param {*} node DOM元素
 */
function mount(element, node) {
  let component = instantiateComponent(element);
  let renderedNode = Reconciler.mountComponent(component);

  DOM.empty(node);
  DOM.appendChildren(node, renderedNode);
}

module.exports = {
  render
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * 更新DOM的类型
 */

const UPDATE_TYPES = {
  INSERT: 1,
  MOVE: 2,
  REMOVE: 3
};

const OPERATIONS = {
  insert(node, afterNode) {
    return {
      type: UPDATE_TYPES.INSERT,
      content: node,
      afterNode: afterNode
    };
  },

  move(component, afterNode) {
    return {
      type: UPDATE_TYPES.MOVE,
      fromIndex: component._mountIndex,
      afterNode: afterNode
    };
  },

  remove(node) {
    return {
      type: UPDATE_TYPES.REMOVE,
      fromNode: node
    };
  }
};

module.exports = {
  UPDATE_TYPES,
  OPERATIONS
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 子元素操作的解释器， 也就是多态的实现
 */

const traverseAllChildren = __webpack_require__(3);
const shouldUpdateComponent = __webpack_require__(4);
const Reconciler = __webpack_require__(0);

/**
 * 
 * @param {Array} childInstances 子节点实例上下文数组
 * @param {object} child 单个子元素对象
 * @param {String} name 子元素名字 
 */
function instantiateChild(childInstances, child, name) {
    // don't know wtf happened here, cannot resolve it at top level
    // hack it in
    const instantiateComponent = __webpack_require__(1);

    if (!childInstances[name]) {
        childInstances[name] = instantiateComponent(child);
    }
}

/**
 * 
 * @param {Object} children 子元素对象
 */
function instantiateChildren(children) {
    //子节点的实例上下文
    let childInstances = {};
    // 递归遍历子元素，并且实例化增加到上下文中
    traverseAllChildren(children, instantiateChild, childInstances);

    return childInstances;
}

function unmountChildren(renderedChildren) {
    if (!renderedChildren) return;

    Object.keys(renderedChildren).forEach(childKey => {
        Reconciler.unmountComponent(renderedChildren[childKey]);
    });
}

function updateChildren(prevChildren, // instance tree
nextChildren, // element tree
mountNodes, removedNodes) {
    // hack in the import function
    const instantiateComponent = __webpack_require__(1);

    // we use the index of the tree to track the updates of the component, like `0.0`
    Object.keys(nextChildren).forEach(childKey => {
        const prevChildComponent = prevChildren[childKey];
        const prevElement = prevChildComponent && prevChildComponent._currentElement;
        const nextElement = nextChildren[childKey];

        // three scenarios:
        // 1: the prev element exists and is of the same type as the next element
        // 2: the prev element exists but not of the same type
        // 3: the prev element doesn't exist

        if (prevElement && shouldUpdateComponent(prevElement, nextElement)) {
            // this will do the recursive update of the sub tree
            // and this line is basically the actual update
            Reconciler.receiveComponent(prevChildComponent, nextElement);
            // and we do not need the new element
            // note that we are converting the `nextChildren` object from an
            // element tree to a component instance tree during all this process
            nextChildren[childKey] = prevChildComponent;
        } else {
            // otherwise, we need to do the unmount and re-mount stuff
            if (prevChildComponent) {
                // only supports DOM node for now, should add composite component
                removedNodes[childKey] = prevChildComponent._domNode;
                Reconciler.unmountComponent(prevChildComponent);
            }

            // instantiate the new child. (insert)
            const nextComponent = instantiateComponent(nextElement);
            nextChildren[childKey] = nextComponent;

            mountNodes.push(Reconciler.mountComponent(nextComponent));
        }
    });

    // last but not least, remove the old children which no longer exist
    Object.keys(prevChildren).forEach(childKey => {
        if (!nextChildren.hasOwnProperty(childKey)) {
            const prevChildComponent = prevChildren[childKey];
            removedNodes[childKey] = prevChildComponent;
            Reconciler.unmountComponent(prevChildComponent);
        }
    });
}

module.exports = {
    instantiateChildren,
    unmountChildren,
    updateChildren
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const ChildReconciler = __webpack_require__(8);
const Reconciler = __webpack_require__(0);
const { UPDATE_TYPES, OPERATIONS } = __webpack_require__(7);
const traverseAllChildren = __webpack_require__(3);
const DOM = __webpack_require__(2);

function flattenChildren(children) {
  const flattenedChildren = {};
  traverseAllChildren(children, (context, child, name) => context[name] = child, flattenedChildren);
  return flattenedChildren;
}

// this is responsible for the real updates of the diffing tree
function processQueue(parentNode, updates) {
  updates.forEach(update => {
    switch (update.type) {
      case UPDATE_TYPES.INSERT:
        DOM.insertAfter(parentNode, update.content, update.afterNode);
        break;

      case UPDATE_TYPES.MOVE:
        // this automatically removes and inserts the new child
        DOM.insertAfter(parentNode, update.content, update.afterNode);
        break;

      case UPDATE_TYPES.REMOVE:
        DOM.removeChild(parentNode, update.fromNode);
        break;

      default:
        assert(false);
    }
  });
}

class MultiChild {
  constructor() {
    this._renderedChildren = null;
  }

  mountChildren(children) {
    // element => Components的过程
    const childrenComponents = ChildReconciler.instantiateChildren(children);
    this._renderedChildren = childrenComponents;

    /*
    {
      '.0.0': {_currentElement, ...}
      '.0.1': {_currentElement, ...}
    }
    */
    // 遍历数组components调用自身的mount来实例化组件并返回节点
    // component => node节点实例化的过程
    const childrenNodes = Object.keys(childrenComponents).map((childKey, i) => {
      const childComponent = childrenComponents[childKey];

      childComponent._mountIndex = i;

      return Reconciler.mountComponent(childComponent);
    });

    return childrenNodes;
  }

  unmountChildren() {
    ChildReconciler.unmountChildren(this._renderedChildren);
  }

  updateChildren(nextChildren) {
    // component tree
    let prevRenderedChildren = this._renderedChildren;
    // element tree
    let nextRenderedChildren = flattenChildren(nextChildren);

    let mountNodes = [];
    let removedNodes = {};

    ChildReconciler.updateChildren(prevRenderedChildren, nextRenderedChildren, mountNodes, removedNodes);
    // We'll compare the current set of children to the next set.
    // We need to determine what nodes are being moved around, which are being
    // inserted, and which are getting removed. Luckily, the removal list was
    // already determined by the ChildReconciler.

    // We'll generate a series of update operations here based on the 
    // bookmarks that we've made just now
    let updates = [];

    let lastIndex = 0;
    let nextMountIndex = 0;
    let lastPlacedNode = null;

    Object.keys(nextRenderedChildren).forEach((childKey, nextIndex) => {
      let prevChild = prevRenderedChildren[childKey];
      let nextChild = nextRenderedChildren[childKey];

      // mark this as an update if they are identical
      if (prevChild === nextChild) {
        // We don't actually need to move if moving to a lower index. 
        // Other operations will ensure the end result is correct.
        if (prevChild._mountIndex < lastIndex) {
          updates.push(OPERATIONS.move(nextChild, lastPlacedNode));
        }

        lastIndex = Math.max(prevChild._mountIndex, lastIndex);
        prevChild._mountIndex = nextIndex;
      } else {
        // Otherwise we need to record an insertion.
        // First, if we have a prevChild then we know it's a removal.
        // We want to update lastIndex based on that.
        if (prevChild) {
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
        }

        nextChild._mountIndex = nextIndex;
        updates.push(OPERATIONS.insert(mountNodes[nextMountIndex], lastPlacedNode));
        nextMountIndex++;
      }

      // keep track of lastPlacedNode
      lastPlacedNode = nextChild._domNode;
    });

    // enque the removal the non-exsiting nodes
    Object.keys(removedNodes).forEach(childKey => {
      updates.push(OPERATIONS.remove(removedNodes[childKey]));
    });

    // do the actual updates
    processQueue(this._domNode, updates);

    // at this point, nextRenderedChildren has already become a component tree
    // rather than the original element tree
    this._renderedChildren = nextRenderedChildren;
  }
}

module.exports = MultiChild;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * DOM原生元素的基类， 真正创建， 增加， 删除元素的地方
 * 无论多么复杂的组件最后递归底都是这个类对象
 */

const MultiChild = __webpack_require__(9);
const DOM = __webpack_require__(2);
const assert = __webpack_require__(5);

class DOMComponent extends MultiChild {
  constructor(element) {
    super();
    this._currentElement = element;
    this._domNode = null;
  }

  mountComponent() {
    // 创建真实DOM节点
    const node = document.createElement(this._currentElement.type);
    // 缓存DOM节点到组件内部
    this._domNode = node;
    // 首次更新属性
    this._updateNodeProperties({}, this._currentElement.props);
    // 遍历创建children组件实例
    this._createInitialDOMChildren(this._currentElement.props);

    return node;
  }

  unmountComponent() {
    this.unmountChildren();
  }

  updateComponent(prevElement, nextElement) {
    this._currentElement = nextElement;
    this._updateNodeProperties(prevElement.props, nextElement.props);
    this._updateDOMChildren(prevElement.props, nextElement.props);
  }

  _updateNodeProperties(prevProps, nextProps) {
    let styleUpdates = {};

    // 遍历上一次的props, 移除DOM节点上的所有style和attribute
    // 因为到这步时已经能确定要更新当前div, 所以全部重置
    Object.keys(prevProps).forEach(propName => {
      if (propName === 'style') {
        Object.keys(prevProps['style']).forEach(styleName => {
          styleUpdates[styleName] = '';
        });
      } else {
        DOM.removeProperty(this._domNode, propName);
      }
    });

    // update / add new attributes
    Object.keys(nextProps).forEach(propName => {
      let prevValue = prevProps[propName];
      let nextValue = nextProps[propName];

      if (prevValue === nextValue) return;

      if (propName === 'style') {
        // 记录变化的样式style
        Object.keys(nextProps['style']).forEach(styleName => {
          // overwrite the existing styles
          styleUpdates[styleName] = nextProps.style[styleName];
        });
      } else {
        // 更新真实的属性attribute
        DOM.setProperty(this._domNode, propName, nextProps[propName]);
      }
    });
    // 更新真实的样式styles
    DOM.updateStyles(this._domNode, styleUpdates);
  }

  _createInitialDOMChildren(props) {
    // 如果是原生控件'div'类似的就创建dom节点
    if (typeof props.children === 'string' || typeof props.children === 'number') {
      const textNode = document.createTextNode(props.children);
      this._domNode.appendChild(textNode);
    } else if (props.children) {
      // 否则递归遍历子组件， 创建实例增加到父节点上
      // element => component => node的过程
      const childrenNodes = this.mountChildren(props.children);
      DOM.appendChildren(this._domNode, childrenNodes);
    }
  }

  _updateDOMChildren(prevProps, nextProps) {
    const prevType = typeof prevProps.children;
    const nextType = typeof nextProps.children;
    assert(prevType === nextType);

    // Childless node, skip
    if (nextType === 'undefined') return;

    // Much like the initial step in mounting, handle text differently than elements.
    if (nextType === 'string' || nextType === 'number') {
      this._domNode.textContent = nextProps.children;
    } else {
      this.updateChildren(nextProps.children);
    }
  }
}

module.exports = DOMComponent;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 组件基类, 提供组件的装配，卸载， 更新等基本方法
 */

const assert = __webpack_require__(5);
const shouldUpdateComponent = __webpack_require__(4);
const instantiateComponent = __webpack_require__(1);
const Reconciler = __webpack_require__(0);

class Component {
  constructor(props) {
    this.props = props;
    this._renderedComponent = null;
    this._renderedNode = null;
    this._currentElement = null;
    this._pendingState = null;
    assert(this.render);
  }

  setState(partialState) {
    this._pendingState = Object.assign({}, this.state, partialState);
    this.performUpdateIfNecessary();
  }

  _construct(element) {
    this._currentElement = element;
  }

  mountComponent() {
    // we simply assume the render method returns a single element
    let renderedElement = this.render();

    let renderedComponent = instantiateComponent(renderedElement);
    this._renderedComponent = renderedComponent;

    let renderedNode = Reconciler.mountComponent(renderedComponent);
    this._renderedNode = renderedNode;

    return renderedNode;
  }

  unmountComponent() {
    if (!this._renderedComponent) return;

    // call componentWillUnmount()

    // delegate the unmounting process to the rendered component
    Reconciler.unmountComponent(this._renderedComponent);
  }

  updateComponent(prevElement, nextElement) {
    if (prevElement !== nextElement) {}
    // should get re-render because of the changes of props passed down from parents
    // react calls componentWillReceiveProps here


    // re-bookmarking
    this._currentElement = nextElement;

    this.props = nextElement.props;
    this.state = this._pendingState;
    this._pendingState = null;

    let prevRenderedElement = this._renderedComponent._currentElement;
    let nextRenderedElement = this.render();

    if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
      Reconciler.receiveComponent(this._renderedComponent, nextRenderedElement);
    } else {
      // re-mount everything from this point
      Reconciler.unmountComponent(this._renderedComponent);

      const nextRenderedComponent = instantiateComponent(nextElement);
      this._renderedNode = Reconciler.mountComponent(nextRenderedComponent);
      DOM.replaceNode(this._renderedComponent._domNode, this._renderedNode);
    }
  }

  performUpdateIfNecessary() {
    // react uses a batch here, we are just gonna call it directly without delay
    this.updateComponent(this._currentElement, this._currentElement);
  }
}

module.exports = Component;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

function createElement(type, config, children) {
  const props = Object.assign({}, config);
  const childrenLength = [].slice.call(arguments).length - 2;

  if (childrenLength > 1) {
    props.children = [].slice.call(arguments, 2);
  } else if (childrenLength === 1) {
    props.children = children;
  }

  return {
    type,
    props
  };
}

module.exports = {
  createElement
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 组件接口
 */

const Element = __webpack_require__(12);
const Component = __webpack_require__(11);
const Mount = __webpack_require__(6);

module.exports = {
  createElement: Element.createElement,
  Component,
  render: Mount.render
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const Lin = __webpack_require__(13);

class MyApp extends Lin.Component {
    render() {
        return Lin.createElement(
            'div',
            null,
            Lin.createElement(
                'h2',
                null,
                'Lin Mini React Demo'
            ),
            Lin.createElement(Info, null)
        );
    }
}

class Info extends Lin.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 0
        };
        setInterval(() => {
            this.setState({
                num: this.state.num + 1
            });
        }, 1000);
        // this.buttonClick = this.buttonClick.bind(this);
    }

    // buttonClick() {
    //     this.setState({
    //         num: this.state.num + 1
    //     })
    // }


    render() {
        return Lin.createElement(
            'div',
            null,
            Lin.createElement(
                'h3',
                { style: {
                        fontSize: '20px',
                        color: 'red'
                    } },
                '\u6BCF\u9694\u4E00\u79D2\u66F4\u65B0\u4E00\u6B21: ',
                this.state.num,
                ' '
            )
        );
    }
}

Lin.render(Lin.createElement(MyApp, null), document.getElementById("root"));

/***/ })
/******/ ]);