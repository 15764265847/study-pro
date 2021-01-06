### redux
  介绍：js状态容器，提供可预测化的状态管理  
  用法：  
    1. 推荐，工作中常用的写法
      ```
        const initialState = {
          count: 0
        };
        // 传入 createStore 的 reducer 方法可以接受两个参数，第二个参数就是 dispatch 函数中传入的 action ，传入哪个 action ，reducer的第二个参数就是哪一个 action ，所以才可以根据 action 的 type 属性来判断做不同的操作
        function reducer(state = initialState, action) {
          switch(actions.type) : 
            case 'increment': 
              return { count: state.count + 1 };
            case 'decrement': 
              return { count: state.count - 1 };
            default:
              return state;
        }
        const store = createStore(reducer);
        // 创建 actions ， action 对象中必有 type 属性
        const increment = { type: 'increment' };
        const decrement = { type: 'decrement' };
        // 触发 actions
        element.onclick = function () {
          store.dispatch(increment);
        }
        element2.onclick = function () {
          store.dispatch(decrement);
        }
        // 更新， 此处写的是更新dom
        store.subscribe(() => {
          element3.innerHTML = store.getState().count;
        })
      ```
    3. reducer 方法的返回值就是 state 的值
      ```
        function reducer() {
          return {
            count: 0
          };
        }
        const store = createStore(reducer);
      ```
    3. createStore 方法可以传入第二个参数，表示 state 的值， reducer 方法的第一个参数就是 createStore 传入的第二个参数
      ```
        function reducer(state) {
          return state;
        }
        const store = createStore(reducer, { count: 0 });
      ```
  在react中使用redux 需要先安装 redux 和 react-redux , react-redux可以让react 更好的使用 redux 
    react-redux 中包含两部分 Provider 组件和 connect 方法
      Provider 组件可以将 store 放到一个全局的位置，让所有的组件可以取用，所以该组件是包裹在最外层的
      这里要把我们创建的store仓库传入到该组件中
        ```
          React.render(
            (
              <Provider store={ store }>
                <Counter />
              </Provider>,
            ),
            document.getElementById('root')
          )
        ```
      connect 方法
        1. 内部会调用 store.subscribe 方法帮助我们订阅 store ，在 store 数据更新时，帮我们更新组建
        2. 可以帮我们获取 store 中存储的数据并帮我们映射到 props 中以供组件数会用
        3. 将 dispatch 方法挂载到 props 上
        PS: 这里用到了 bindActionCreators 方法，它是 redux 的一个方法，两个参数 分别是 actions 和 dispatch ，他会返回一个对象，这个对象包含 actions 对应的函数，该函数是对应的 actions 与 dispatch 方法的封装，然后通过 connect 方法挂载到 props 上，简化我们自己的操作
          ```
            import React from 'react';
            import { connect } from 'react-redux';
            import { bindActionCreators } from 'redux';
            import * as counterActions from './store/actions/creator.actions';

            const Counter = function (props) {
              return (
                <div>
                  <button onClick={props.increment}>+</button>
                  <span>{ props.count }</span>
                  <button onClick={props.decrement}>-</button>
                </div>
              )
            }

            const myStateToProps = function (state) {
              return {
                count: state.count
              }
            }

            const mapDispatchToProps = function (dispatch) {
              return bindActionCreators(counterActions, dispatch) 
            }

            export default connect(myStateToProps, mapDispatchToProps)(Counter);
          ```

### 插件 redux-saga 

### 插件 redux-actions
  import { createAction } from 'redux-ations';
  const increment = createAction('increment')

  import { handleAction as createReducer } from 'redux-ations';
  const initState = { count: 0 }
  export default  createReducer({
    [increment]: (state, actions) => ({ count: state.count + 1  })
  }, initState)
