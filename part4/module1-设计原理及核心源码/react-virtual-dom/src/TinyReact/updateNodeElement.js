export default function updateNodeElement(newElement, virtualDOM, oldVirtualDOM) {
  const newProps = virtualDOM.props || {};
  const oldprops = oldVirtualDOM && oldVirtualDOM.props || {};
  Object.keys(newProps).forEach(attr =>{
    const value = newProps[attr];
    const oldValue = oldprops[attr];
    if (value !== oldValue) {
      if (attr.startsWith('on')) {
        const eventType = attr.slice(2).toLowerCase();
        newElement.addEventListener(eventType, value);
        if (oldValue) {
          newElement.removeEventListener(eventType, oldValue);
        }
      } else if (['value', 'checked'].includes(attr)) {
        newElement[attr] = value;
      } else if (attr !== 'children') {
        if (attr === 'className') {
          newElement.setAttribute('class', value);
        } else {
          newElement.setAttribute(attr, value);
        }
      }
    }
  });
  Object.keys(oldprops).forEach(attr => {
    if (!newProps[attr]) {
      if (attr.startsWith('on')) {
        const eventType = attr.slice(2).toLocaleLowerCase();
        newElement.removeEventListener(eventType, oldprops[attr]);
      } else if (attr !== 'children') {
        newElement.removeAttribute(attr);
      }
    }
  })
}