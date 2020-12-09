import TinyReact from "./TinyReact" 

const root = document.querySelector('#root');

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
  </div>
)

console.log(virtualDOM);

TinyReact.render(virtualDOM, root);

class Alert extends TinyReact.Component {
  // 我们这里简易版的需要在这里调用 super(props) 来对 Component 进行 props 的传值
  // 然后在继承 Component 的类中就可以拿到 props 属性了
  // 但是真正的 react 是不用这么写的，我还没找到 react 是怎么传递的
  constructor(props) {
    super(props);
  }
  render() {
    return <div>{ this.props.name }</div>
  }
}
