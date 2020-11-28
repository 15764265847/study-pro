### jsx是啥
	<div class="container">
		<h1>Hello React </h1>
		<p>React is great</p>
	</div>
	解析后为
	React.createElement(
		'div',
		{
			className: 'container'
		},
		React.createElement('h1', null, 'Hello React')
		React.createElement('p', null, 'React is great')
	)
	将jsx语法中的html转换成虚拟dom

### 简易版 react 
	1、视频里命名为 TinyReact ，所以转换后的 React.createElement 要改成 TinyReact.createElement
		修改方式：
			1、可以在每个 jsx 文件中加注释  /** @jsx TinyReact.createElement */
			2、修改 babel 配置， .babelrc 文件内容如下
				{
					"presets": [
						"@babel/preset-env",
						[
							"@babel/preset-react",
							{
								"pragma": "TinyReact.createElement"
							}
						]
					]
				}

	2、实现流程
		1、首先实现 createElement 方法，该方法即编译后的 React.createElement 方法，用于生成虚拟dom，代码入下
			export default function createElement(type, props, ...children) {
				// type 表示标签名 props 是传入的属性 children 即当前元素的子元素
				const childElement = children.reduce((result, child) => {
					if (child !== false && child !== true && child !== null) {
						if (child instanceof Object) {
							result.push(child);
						} else {
							// 文本元素的虚拟dom的形式为 { type: 'text', props: { textContent: '文本' } };
							// 其文本的内容放在 props 下的 textContent 属性中
							result.push(createElement(text, { textContent: child }));
						}
					}
					return result;
				}, []);
				return {
					type, 
					props: {
						...props,
						// react 组件可以通过 props.children 获取到子元素
						children: childElement
					},
					children: childElement
				}
			}

		2、然后在 index.js 中导出第一部中实现的 createElement 方法
			import createElement from './createElement';

			export default {
				createElement
			}
		
		3、实现 render 函数， render 函数是用来渲染真实 dom 的，里面会走 diff 算法，创建 render.js 代码入下
			import diff from './diff';
			export default function render(virtualDOM, container, oldDom) {
				// 三个参数，虚拟dom  html的根元素  旧的dom结构
				diff(virtualDOM, container, oldDom);
			}
			PS：由于 render 函数可以直接由 react.render 调用，所以需要在 index.js 导入并导出，代码入下
				import createElement from './createElement';
				import render from './render';
				export default {
					createElement,
					render
				}
		
		4、实现 diff 算法，这里要判断有没有传入 oldDom ，以此来判断是首次渲染还是更新操作，如果是首次渲染直接进行挂载 dom，调用 mountElement 方法   新建diff.js，代码入下
			import mountElement from './mountElement';
			export default function diff(virtualDOM, container, oldDom) {
				if (!oldDom) {
					mountElement(virtualDOM, container);
				}
			}

		5、实现 mountElement 方法，在这里要挂载真实dom，所以这里要判断一下传入的 virtualDOM 是普通的虚拟dom元素还是组件，如果是组件调用 mountComponent 方法，如果是普通虚拟dom调用 mountNativeElement 方法
			1、这里可以通过 virtualDOM.type 来判断，在经过编译后组件的 virtualDOM.type 是一个 function 
			2、新建一个 isFunction.js 存在用来判断是否是函数的方法 代码入下
				export default function isFunction(virtualDOM) {
					return virtualDOM.type && typeof virtualDOM.type === 'function';
				}
			3、新建 mountElement.js 代码入下
				import isFunction from './isFunction';
				import mountNativeElement from './mountNativeElement';
				import mountComponent from './mountComponent'

				export default function mountElement(virtualDOM, container) {
					if (isFunction(virtualDOM)) {
						mountComponent(virtualDOM, container);
					} else {
						mountNativeElement(virtualDOM, container);
					}
				}
		
		6、我们先处理一下普通虚拟dom的挂载，这个相对简单 新建 mountNativeElement 函数，根据传入的 virtualDOM 来将其转换成真实dom并挂载，新建 mountNativeElement.js ，代码入下
			import createDOMElement from './createDOMElement';
			export default function mountNativeElement (virtualDOM, container) {
				const newElement = createDOMElement(virtualDOM);
				container.appendChild(newElement);
			}
			PS：这里考虑到创建dom操作多个地方会用到，所以这里单独抽取了一个方法 createDOMElement ，创建 createDOMElement.js 代码入下
				import mountElement from './mountElement';
				import updateNodeElement from './updateNodeElement';

				export default function createDOMElement (virtualDOM) {
					let newElement = null;
					if (virtualDOM.type === 'text) {
						newElement = document.createTextNode(virtualDOM.props.textContent);
					} else {
						newElement = document.createElement(virtualDOM.type);
						updateNodeElement(newElement, virtualDOM);
					}
					if (virtualDOM.children) {
						virtualDOM.children.forEach(child => {
							// 考虑到子元素也有可能是组件，所以这里调用 mountElement 进行中心判断子元素是什么类型
							mountElement(child, newElement);
						});
					}
					return newElement;
				}
			PS：在 createDOMElement 方法中，我们还需要为元素添加属性，前面我们使用了一个 updateNodeElement 方法，这里我们单独定义一下，创建 updateNodeElement.js 代码如下
				export default function updateNodeElement(newElement, virtualDOM) {
					const props = virtualDOM.props;
					Object.keys(porps).forEach(attr => {
						const value = props[attr];
						if (attr.startWith('on')) {
							// 判断是否是以 on 开头，如果是则该属性是事件
							const eventType = attr.slice(2).toLowercase();
							newElement.addEventListener(eventType, value);
						} else if (['value', 'checked'].includes(attr)) {
							// 'value', 'checked' 使用 setAttribute 无法设置
							newElement[attr] = value;
						} else if (attr !== 'children') {
							if (attr === 'className') {
								// 其实 className 可使用 element.className 设置，但不知道为啥这里要单独拿出来使用 newElement.setAttribute 设置
								newElement.setAttribute('class', value);
							} else {
								newElement.setAttribute(attr, value);
							}
						}
					});
				}
		
		7、处理完普通虚拟dom之后，我们在处理组件，组件这里要分为 函数组件 和 类组件，这里通过 virtualDOM.type 上是否有 render 函数来判断
			PS：我们把判断是类组件还是函数组件的方法单独提取出来 新建 isFunctionComponent.js , 代码如下
				import isFunction from './isFunction';
				export default function isFunctionComponent(virtualDOM) {
					// 判断是否是函数组件
					const type = virtualDOM.type;
					return type && isFunction(type) && !(type.prototype && type.prototype.render);
				}
			创建 mountComponent.js 代码如下
				import isFunctionComponent from './isFunctionComponent';
				import isFunction from './isFunction';
				export default function mountComponent(virtualDOM, container) {
					let nextVirtualDOM = null;
					if (isFunctionComponent(virtualDOM)) {
						nextVirtualDOM = buildFunctionComponent(virtualDOM);
					} else {
						nextVirtualDOM = buildClassComponent(virtualDOM);
					}

					// 这里还需要判断一下当前的虚拟dom是否是组件，来处理一下情况
					// function Foo() {
					//   retirn (<div>Hello React</div>);
					// }
					// function Bar() {
					//   return <Foo />
					// }
					// TinyReact.render(<Bar />, root);

					if (isFunction(virtualDOM)) {
						mountComponent(virtualDOM, container);
					} else {
						mountNativeElement(virtualDOM, container);
					}
				}

				// 因为函数组件可以接收一个参数 props ， 通过 props 可以拿到父组件传递的值
				// 所以这里需要将 props 传入函数组件的方法中， props 保存在 virtualDOM.props 中
				function buildFunctionComponent(virtualDOM) {
					return virtualDOM.type(virtualDOM.props);
				}

				// 类组件的虚拟dom需要在实例化之后调用其 render 方法才可以拿到
				function buildClassComponent(virtualDOM) {
					// class Alert extends TinyReact.Component {
					//   // 我们这里简易版的需要在这里调用 super(props) 来对 Component 进行 props 的传值
					//   // 然后在继承 Component 的类中就可以拿到 props 属性了
					//   // 但是真正的 react 是不用这么写的，我还没找到 react 是怎么传递的
					//   constructor(props) {
					//     super(props);
					//   }
					//   render() {
					//     return <div>{ this.props.name }</div>
					//   }
					// }
					// 因为 类组件 中是使用 this.props 来获取父组件的传值，但是这里我们并没有传递
					// 所以这里在这里我们会创建 Component.js ，并在 Component 类中对 props 进行赋值，这样在继承时类组件就会拿到props
					// 但是实际上真正 react 是怎么在类组件中传递 props 的，我还没发现，视频里也没说
					const component = new virtualDOM.type(virtualDOM.props);
					consy nextVirtualDOM = nextVirtualDOM.render();
					return nextVirtualDOM;
				}
			
			创建 Component.js 代码如下
				export default class Component {
					constructor(props) {
						this.props = props;
					}
				}
				并在 index.js 中导出，以供使用，代码入下
					import createElement from './createElement';
					import render from './render';
					import Component from './Component';
					export default {
						createElement,
						render,
						Component
					}

		8、更新dom节点，及节点对比
			1、保存真实dom对应的虚拟dom
				在 createDOMElement.js 下的 createDOMElement 方法中添加代码入下
					newElement._virtualDOM = virtualDOM;
				将虚拟dom挂载到对应的真实dom节点上
			2、获取 oldDom 
				由于我们实现的简易版 react 根节点下只有一个根组件，即我们是把根组件直接插入到根节点下，而不是替换根节点，所以代码如下
					在 render.js 中 为 oldDom 形参添加默认值
						import diff from './diff';
						export default function render(virtualDOM, container, oldDom = container.firstChild) {
							// 三个参数，虚拟dom  html的根元素  旧的dom结构
							diff(virtualDOM, container, oldDom);
						}
			3、虚拟dom对比，在 diff.js 中
				1、优先实现 type 相等的情况 diff.js ，判断是否是文本节点，文本节点和元素节点分别做不同处理，然后递归处理其子元素，代码入下
					import mountElement from './mountElement';
					import updateTextNode from './updateTextNode';
					import updateNodeElement from './updateNodeElement';
					export default function diff(virtualDOM, container, oldDom) {
						const oldVirtualDom = oldDom._virtualDOM;
						if (!oldDom) {
							mountElement(virtualDOM, container);
						} else if (virtualDOM.type === oldVirtualDom.type) {
							if (virtualDOM.type === 'text') {
								// 更新文本节点
								updateTextNode(virtualDOM, oldVirtualDom, oldDom);
							} else {
								// 更新属性
								updateNodeElement(virtualDOM, oldVirtualDom, oldDom)
							}
							virtualDOM.children.forEach((child, i) => {
								diff(child, oldDom, oldDom.childNodes[i]);
							});
						}
					}
			4、实现 updateTextNode.js
				export default function updateTextNode(virtualDOM, oldVirtualDom, oldDom) {
					if (virtualDOM.props.textContent !== oldVirtualDom.props.textContent) {
						oldDom.textContent = virtualDOM.props.textContent;
						oldDom._virtualDOM = virtualDOM;
					}
				}
			5、修改 updateNodeElement.js，代码入下
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
			6、判断 type 不同的情况 diff.js 代码中添加 else if，如果不同则直接调用 createDOMElement 方法创建真是dom并替换原dom
				else if (virtualDOM.type !== oldVirtualDom.type) {
					const newElement = createDOMElement(virtualDOM);
					oldDom.parent.replaceChild(newElement, oldDom);
				}
			7、删除oldDom中多余的子元素，在 diff.js 中递归处理子元素之后添加如下代码
				const oldChildNodes = oldDom.childNodes;
				if (oldChildNodes.length ? virtualDOM.children.length) {
					for (let i = oldChildNodes.length - 1; i > virtualDOM.children.length; i--) {
						unmountNode(oldChildNodes[i]);
					}
				}
			8、创建 unmountNode.js ，代码入下
				export default function unmountNode(node) {
					node.remove();
				}

		9、setState 实现类组件更新
			在 component.js 中添加 setState 方法，在该方法中我们要实现设置state属性，还要更新dom，代码入下
				setState(state) {
					this.state = Object.assign({}, this.state, state);
					// 获取当前的虚拟dom
					const virtualDom = this.render();
					// 获取旧dom
					const oldDom = this.getDom();
					diff(virtualDom, oldDom.parentNode, oldDom);
				}
				getDom() {
					return this._dom;
				}
				setDom(dom) {
					this._dom = dom;
				}
			我们需要获取到旧dom，需要在某个位置中调用 setDom 方法，调用 setDom 我们需要获取 Component 的实例，但是我们没有使用 Component 的实例，我们使用了集成的方式，所以我们可以通过拿到类组件的实例就可以调用到 setDom 方法
			在 mountComponent.js 下的 buildClassComponent 方法中添加如下代码
				nextVirtualDOM.component = component;
			将类组件实例挂载到对应的虚拟dom上

			然后需要获取到真实dom，真实dom是在 mountNativeElement.js 中生成的，所以在 mountNativeElement.js 的 mountNativeElement 方法中添加如下代码
				let component = virtualDOM.component; 
				if (component) {
					// 非类组件的实例是没有 component 属性
					component.setDom(newElement);
				}

		10、组件更新 
		


