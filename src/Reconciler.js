/** 
 * component => node
*/

function mountComponent(component) {
    return component.mountComponent()
  }
  
  function unmountComponent(component) {
    component.unmountComponent()
  }
  
  function receiveComponent(component, nextElement) {
    const prevElement = component._currentElement
    if (prevElement === nextElement)  return
  
    component.updateComponent(component._currentElement, nextElement)
  }
  
  module.exports = {
    mountComponent,
    unmountComponent,
    receiveComponent
  }
  