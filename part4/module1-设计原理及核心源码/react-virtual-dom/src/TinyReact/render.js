import diff from './diff';

export default function render(virtualDOM, container, oldDom = container.firstChild) {
  // diff算法
  diff(virtualDOM, container, oldDom);
}