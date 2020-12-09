import isFunction from './isFunction';
import mountComponent from './mountComponent';
import mountNativeElement from './mountNativeElement';

export default function mountElement(virtualDOM, container) {
  // 分别处理 Component 和 NativeElement
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container);
  } else {
    mountNativeElement(virtualDOM, container);
  }
}