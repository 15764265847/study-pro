export default function updateTextNode(virtualDOM, oldVirtualDOM, oldDom) {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    oldDom.textContent = virtualDOM.props.textContent;
    oldDom._virtualDOM = virtualDOM;
  }
}