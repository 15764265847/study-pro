### react 基本语法 jsx 回顾
	1、jsx专中使用表达式
		const user = {
			firstName: 'yu',
			lastName: 'deshui
		}
		function format (user) {
			return user.firstName + user.lastName;
		}

		const element = <h1>Hello, {format(user)}!</h1>

	2、属性
		如果属性值为字符串，则需要加引号，属性名称推荐使用驼峰式命名
			const element = <div greeting='hello'></div>
		如果是js表达式，则需要加大括号
			const element = <img src={user.avartorUrl} />

	3、标签必须闭合
		const element = <img src={user.avartorUrl} />
		const element = <input type='text' />

	4、给元素添加类型时使用className，而不是class
		const element = <img src={user.avartorUrl} className='avartor' />

	5、jsx自动展开数组
		const arr = [<p>哈哈</p>, <p>嘿嘿</p>, <p>哼哼</p>]
		const eleemnt = (<div>{arr}</div>);
		解析后为
			<div><p>哈哈</p><p>嘿嘿</p><p>哼哼</p></div>
	
	6、三元运算，在 {} 内使用 boolean值 和 null 是不会展示任何内容的
		{ boolean ? <div>Hello React</div> : null }
		{ boolean && <div>Hello React</div> }

	7、循环
		const person = [
			{
				id: 1,
				name: 'A',
				age: 20
			},
			{
				id: 1,
				name: 'A',
				age: 20
			},
			{
				id: 1,
				name: 'A',
				age: 20
			}
		]

		const element = <ul>{ person.map(per => <li key={ per.id }>{ per.name } { per.age }</li>) }</ul>

	8、事件
		不需要传值
			<button onClick={this.handler}>按钮</button>
		需要传值
			<button onClick={e => this.handler(e, 'args')}>按钮</button>
		最后一个参数是事件对象，不需要传递
			<button onClick={this.handler.bind(null, 'args')}>按钮</button>

	9、样式
		1、行内样式
			class App extends Component {
				render() {
					const style = { width: 100, height: 100, backgroundColor: 'red' };
					const element = <div style={ style }></div>
				}
			}
		2、外链样式，以button组件为例
			PS：这里如果使用 .module.css 命名的话说明该css只在当前组件使用，不加module则是全局的样式
			import styles from 'Button.module.css';

			class Button extends Component {
				render() {
					return <button className={ styles.error }>Error Button</button>
				}
			}
		3、全局样式
			import './style.css';
	
	10、ref属性，和 Vue 的 ref 属性类似，是用来获取元素或者组件实例的，只是使用上可能有一些不同
		1、createRef， this.inputRef.current中存储的就是当前的dom对象
			PS：通过 React.createRef() 绑定的 ref 只能通过 this.inputRef.current 来获取
			class Input extends Compoennt {
				constructor () {
					super();
					this.inputRef = React.createRef();
				}
				render() {
					return (<div>
						<input type='text' ref={ this.inputRef } />
						<button onClick={ () => console.log(this.inputRef.current) }>button</button>
					</div>)
				}
			}
		2、函数参数
			class Input extends Compoennt {
				render() {
					return (<div>
						<input type='text' ref={ input => this.input = input } />
						<button onClick={ () => console.log(this.input) }>button</button>
					</div>)
				}
			}
		3、ref字符串 不推荐使用，严格模式下会报错 
			class Input extends Compoennt {
				render() {
					return (<div>
						<input type='text' ref='myInput' />
						<button onClick={ () => console.log(this.refs.myInput) }>button</button>
					</div>)
				}
			}
		4、获取组件实例
			案例：此处有一个Input组件还有一个App组件，通过点击App组件中的按钮调用Input组件的方法，使Input组件中的input获取焦点
				Input.js
					class Input extends Component {
						constructor() {
							super();
							this.inputRef = React.createRef();
							// 绑定处理函数的this为当前组件
							this.focusInput = this.focusInput.bind(this);
						}
						focusInput() {
							this.inputRef.current.focus();
						}
						render() {
							return (
								<div>
									<input type='text' ref={ this.inputRef } />
								</div>
							)
						}
					}
				App.js
					class App extends Component {
						constructor() {
							super()
							this.InputComponentRef = React.createRef();
						}
						render() {
							return (
								<div className='App'>
									<Input ref={ this.InputComponentRef } />
									<button onClick={ () => this.InputComponentRef.current.focusInput() }>button</button>
								</div>
							)
						}
					}

### 组件
	1、啥是组件，对某一段html的封装
	2、类组件 
		这里没有使用到 React ，为啥要引入？
		因为render函数会被解析成 React.createElement(); 会在当前作用域寻找 React ，所以在顶部需要引入一下
		如果不引入会找不到 React ，就会报错 
		import React, { Component } from 'react';
		class App extends Component {
			render() {
				return <div> Hello, 我是类组件 </div>
			}
		}
	3、函数组件
		const Person = () => {
			return <div> Hello, 我是函数组件 </div>
		}
	PS：组件名称首字母要大写，用来区分组件和普通元素
	    jsx语法外层必须有一个根元素，和 Vue2.x 的 template 模板类似，必须要有一个根节点

### props 向组件内部传递数据
	PS：props是只读的，不能修改
	<Person name='玛丽' age='20'>
	<Person name='乔治' age='20'>

	类方式
		import React, { Component } from 'react';
		class Person extends Component {
			render() {
				return (
					<div>
						<h3>姓名: { this.props.name }</h3>
						<h3>年龄: { this.props.age }</h3>
					</div>
				)
			}
		}
	函数组件
		const Person = props => {
			return (
					<div>
						<h3>姓名: { props.name }</h3>
						<h3>年龄: { props.age }</h3>
					</div>
				)
		}

	props默认值
		1、在类组件添加静态属性 static defaultProps = {name: '123'}  
			class Person extends Component {
				static defaultProps = {}
			}
		2、在函数组件的函数上添加 defaultProps 属性
			function Person() {}
			Person.defaultProps = {}; 
	
	props.children 属性，可以获取到填充到填充到组件标签内的内容
		<Person>组件内部的内容</Person>

		const Person = props => {
			return (
				<div>{ props.children }</div>
			)
		}

	单项数据流
		1、自上而下，从父组件到子组件，数据不能从子组件往父组件传递
		2、共享数据放到上层组件中
		3、子组件调用父组件传递的方法来修改数据
		4、数据发生变化时，react会重新渲染组件树
		5、数据流动可预测，方便定位错误
	
	类组件状态 state  类组件除了可以通过 props 接受外部传递的数据，还可以定义自己的数据，自己的数据要定义在 this.state下
		class App extends Component {
			constructor() {
				super()
				this.state = {
					person: {
						name: '张华',
						age: 30
					}
				}
			};
			render() {
				return (
					<div>
						<p>姓名：{ this.state.person.name }</p>
						<p>年龄：{ this.state.person.age }</p>
					</div>
				)
			}
		}
	修改类组件自己的数据需要使用 setState 直接修改 state 下的数据的属性不会触发 DOM 更新
		class App extends Component {
			constructor() {
				super()
				this.state = {
					person: {
						name: '张华',
						age: 30
					}
				}
				this.changePerson = this.changePerson.bind(this);
			};
			changePerson() {
				this.setState({
					person: {
						name: '王丽',
						age: 20
					}
				})
			}
			render() {
				return (
					<div>
						<p>姓名：{ this.state.person.name }</p>
						<p>年龄：{ this.state.person.age }</p>
						<button onClick={ this.changePerson }>button</button>
					</div>
				)
			}
		}

	双向数据绑定
		class App extends Component {
			constructor() {
				super()
				this.state = {
					name: '张华'
				}
				this.changeName = this.changeName.bind(this);
			};
			changeName(event) {
				this.setState({
					name: event.target.value
				})
			}
			render() {
				return (
					<div>
						<p>姓名：{ this.state.name }</p>
						<Person name={ this.state.name } changeName={ this.changeName }>
					</div>
				)
			}
		}

		const Person = props => {
			return (
				<div>
					<input type="text" value={ props.name } onChange={ props.changeName }>
				</div>
			)
		}
	
	类组件生命周期，分为三个阶段
		1、 Mounting 阶段，即dom挂载阶段
			1、首先执行 constructor 函数
				1、初始化状态
				2、改变内部this指向
			2、然后执行 getDerivedStateFromProps 生命周期函数，如果当前数据取决于父组件的数据，那么我们就可以使用这个函数
				1、getDerivedStateFromProps(props, currentState)接受两个参数
					第一个是父组件传递过来的数据，第二个是当前组件的数据
					如果不需要更新当前组件的数据，该函数需要返回一个 null 
					如果更新则需要返回一个全新的state对象
					一定要返回一个东西，不能不反悔
			3、然后执行render方法，挂载dom对象
			4、然后执行componentDidMount生命周期函数，组件挂在完成的函数
				请求接口的操作我们可以放在该函数中执行
		2、 Updating 阶段，数据更新的阶段
			1、首先执行 getDerivedStateFromProps 函数，看数据是否有必要更新
			2、然后调用 shouldComponentUpdate 生命周期函数
				这里要返回一个true或者false
				返回true，表示继续往下执行 render 函数，重新渲染组件
				返回false，表示停止更行组件
			3、然后执行render方法，重新渲染组件
			4、然后执行 getSnapshotBeforeUpdate 生命周期函数
				getSnapshotBeforeUpdate(preProps, preState)
				该函数有两个传参 
				使用相对较少
				该方法用于组件更新完成之后做的某种逻辑或者运算
				返回值可以在 componentDidUpdate 生命周期函数中拿到
			5、然后执行 componentDidUpdate 生命周期函数
				componentDidUpdate(preProps, preState, snapshot)
				该函数有三个参数
					3、第三个参数即 getSnapshotBeforeUpdate 的返回值

				getSnapshotBeforeUpdate 和 componentDidUpdate 需要配合使用
				如果只定义了 getSnapshotBeforeUpdate 没有定义 componentDidUpdate 函数，会报错

		3、 Unmounting 阶段，组件卸载阶段
			卸载之前会调用 componentWillUnmount 生命周期函数，表示组件即将卸载
			做一些清理操作
				1、清除在dom元素上绑定的事件
				2、清理绑定的ref属性 
				等等
	
	Context 跨级传递数据
		示例
			App.js
				import React from 'react';
				import Son from './son'

				export { Provider, Consumer } = React.createContext('默认值');

				export default class App extends React.Component {
					render() {
						const name = '于得水';
						return (
							<Provider value={ name }>
								<div>
									父组件定义的name：{ name }	
									<Son />
								</div>
							</Provider>
						)
					}
				}
			Son.js
				import React from 'react';
				import Grandson from './grandson'
				import { Consumer } from './app.js';

				const Son = props => {
					return (
						<Consumer>
							{
								name => {
									return (
										<div>
											子组件
											获取父组件的name：{ name }
										</div>
									)
								}
							}
						</Consumer>
					)
				}
			Grandson.js
				import React from 'react';
				import { Consumer } from './app.js';

				const Son = props => {
					return (
						<Consumer>
							{
								name => {
									return (
										<div>
											孙子组件
											获取祖父组件的name：{ name }
										</div>
									)
								}
							}
						</Consumer>
					)
				}

### 表单
	1、受控表单
	2、非受控表单

### react的router 
	基本使用
		import React from 'react';
		import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

		const Index = () => {
			return <div>首页</div>
		}

		const News = () => {
			return <div>新闻</div>
		}

		const App = () => {
			return (
				<Router>
					<div>
						<Link to="/index">首页</Link>
						<Link to="/news">新闻</Link>
					</div>
					<div>
						<Route path="/index" component={ Index } />
						<Route path="/news" component={ News } />
					</div>
				</Router>
			)
		}
	路由嵌套
		const CompanyNews = () => {
			return <div>公司新闻</div>
		}
		const IndustryNews = () => {
			return <div>行业新闻</div>
		}
		const News = props => {
			return (
				<div>
					<div>
						<Link to={ `${ props.match.url }/company` }>公司新闻</Link>
						<Link to={ `${ props.match.url }/industry` }>行业新闻</Link>
					</div>
					<div>
						<Route path={ `${ props.match.path }/company` } component={ CompanyNews } />
						<Route path={ `${ props.match.path }/industry` } component={ IndustryNews } />
					</div>
				</div>
			)
		}
	路由传参
		<Link to="/index?xxx=xxx">首页</Link>
		获取使用url第三方包获取
			const { query } = url.parse(this.path.location.search, true) 
	路由重定向
		import { Redirect } from 'react-router-dom';
		import React from 'react';
		class Login extends React.Component {
			render () {
				if (this.state.isLogin) {
					return <Redirect to="/" />
				}
			}
		}