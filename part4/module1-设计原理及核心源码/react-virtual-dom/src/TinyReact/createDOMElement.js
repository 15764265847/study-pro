import mountElement from "./mountElement";
import updateNodeElement from "./updateNodeElement";

export default function createDOMElement(virtualDOM) {
  let newElement = null;
  if (virtualDOM.type === 'text') {
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    newElement = document.createElement(virtualDOM.type);
    updateNodeElement(newElement, virtualDOM);
  }

  newElement._virtualDOM = virtualDOM;

  if (virtualDOM.children) {
    virtualDOM.children.forEach(child => {
      mountElement(child, newElement);
    });
  }
  return newElement;
}