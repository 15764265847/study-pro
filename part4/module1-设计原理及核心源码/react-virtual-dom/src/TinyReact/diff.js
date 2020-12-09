import createDOMElement from './createDOMElement';
import mountElement from './mountElement';
import updateNodeElement from './updateNodeElement';
import updateTextNode from './updateTextNode';
import unmountNode from './unmountNode';

export default function diff(virtualDOM, container, oldDom) {
  const oldVirtualDOM = oldDom && oldDom._virtualDOM;
  if (!oldDom) {
    // 虚拟dom转换真实dom
    mountElement(virtualDOM, container);
  } else if (virtualDOM.type !== oldVirtualDOM.type && typeof virtualDOM.type !== 'function') {
    const newElement = createDOMElement(virtualDOM);
    oldDom.parentNode.replaceChild(newElement, oldDom);
  } else if (oldVirtualDOM && oldVirtualDOM.type === virtualDOM.type) {
    if (virtualDOM.type === 'text') {
      updateTextNode(virtualDOM, oldVirtualDOM, oldDom);
    } else {
      updateNodeElement(oldDom, virtualDOM, oldVirtualDOM);
    }
    virtualDOM.children.forEach((child, index) => {
      diff(child, oldDom, oldDom.childNodes[index]);
    });
    let oldChildNodes = oldDom.childNodes;
    if (oldChildNodes.length > virtualDOM.children.length) {
      for(let i = oldChildNodes.length - 1; i > virtualDOM.children.length - 1; i--) {
        unmountNode(oldChildNodes[i]);
      }
    }
  }
}