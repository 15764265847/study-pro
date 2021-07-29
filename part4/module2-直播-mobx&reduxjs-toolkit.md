## 何时使用mobx 何时使用redux
  1. 如果项目是多人或者多个团队协作开发，这个时候更倾向于使用redux，因为redux有样板代码，很容易约束，这样风格是统一的
  2. 如果是自己负责，可是使用mobx，因为mobx更易开发，更简约，不需要写很多的样板代码

## mobx光速入门
  1. mobx核心库
  2. 绑定库 mobx-react-lite 仅支持函数组件，如果只是用含数字键，那么使用这个组件
  3. 如果函数组件和类组件都有，那么使用mobx-react，这个两者都支持

## 核心概念
  1. observable state 被Mobx跟踪的状态
  2. action： 允许修改状态的方法，严格模式下只有action被允许修改状态
  3. computed 根据应用程序状态派生的心智，计算值

## @reduxjs/toolkit
  1. 对redux进行二次封装，简化redux样板代码及流程代码的编写，使redux的使用变得简单
  2. 下载
    - 现有应用 npm i @reduxjs/toolkit react-redux
    - 新建应用 create-react-app react-redux-toolkit --template redux
  3. 示例代码
    - 创建reducers actions
      // src/store.todos.js
      import { createSlice } from '@reduxjs/toolkit'

      export const TODOS_SOMETHING = 'todos'

      const { reducer: TodoReducer, actions } = createSlice({
        name: TODOS_SOMETHING, // 名字表示是哪一个store
        initialState: [], // 初始数据
        reducers: { // reducers函数
          addTodo: (state, action) = >{ // 函数的名字则表示dispatch可触发的action
            state.push(action.payload)
          }
        }
      })
      export const { addTodo } = actions
      export default TodoReducer
    - 创建store
      // src/store/index.js
      import { configureStore } from '@reduxjs/toolkit'
      import TodosReducer, { TODOS_SOMETHING } from './todos

      export default configureStore({
        reducer: { // 该属性类似于 combineReducer 方法，穿进去即代表回族合成一个打的 store 对象
          [TODOS_SOMETHING]: TodosReducer,
        },
        devTools: process.env.NODE_ENC !== 'production'
      })
    - 配置Provider
      // src/index.js
      import ReactDOM from 'react-dom'
      import App from './App'
      import { Provider } from 'react-redux'
      import store from './store'
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        document.getElementById('root')
      )
    - 使用
      const todos = useSelector(state => state[TODOS_SOMETHING])
      const dispatch = useDispatch()
      dispatch(addTodo({title: '111111'}))

  4. 异步任务，内置了 redux-thunk，并进行了封装，调用 createAsyncThunk 方法
    1. 方式一
      - 创建
        import { createSlice, createAsyncThunk } from ''@reduxjs/toolkit'
        import axios from 'axios'
        export const loadTodos = createAsyncThunk(
          // 参数的意思是在 todos 下添加一个叫做 loadTodos 的action，这样后面就可以使用 dispatch 触发这个action来获取数据
          'todos/loadTodos',
          // 基本思路是请求到数据以后通过触发另外的action来添加数据，和其余一步的思路是差不多的
          (payload, thunkAPI) => { 
            axios.get(payload)
              .then(response => thunkAPI.dispatch(setTodos(response.data)))
          }
        )
        const { reducer: TodoReduccer, actions } = createSlice({
          reducers: {
            setTodos: (state, action) => {
              action.payload.forEach(todo => state.push(todo))
            }
          }
        })
        export const { setTodos } = actions
        export default TodoReducer
      - 组件内
        const dispatch = useDispatch()
        dispatch(loadTodos('url或者其他请求参数'))
    2. 方式二，据说更好
      - 创建
        import { createSlice, createAsyncThunk } from ''@reduxjs/toolkit'
        import axios from 'axios'
        export const loadTodos = createAsyncThunk(
          'todos/loadTodos',
          payload => { 
            return axios.get(payload)
              .then(response => response.data)
          }
        )
        const { reducer: TodoReduccer, actions } = createSlice({
          // 接收执行异步操作的action
          extraReducers: {
            // pending
            // rejected
            // fulfilled
            // 这里可以监听到promise的状态，可以根据状态来做修改
            [loadTodos.fulfilled]: (state, action) => {
              action.payload.forEach(todo => state.push(todo))
            }
          }
        })
        export const { setTodos } = actions
        export default TodoReducer
        
      - 组件内
        const dispatch = useDispatch()
        dispatch(loadTodos('url或者其他请求参数'))

  5. 中间件 
    - configureStore 方法的参数中可以传入 middleware 属性，表示使用的中间件，但是如果直接使用会覆盖掉内置中间件
    - @reduxjs/toolkit 提供了 getDefaultMiddleware 方法，可以让我们获取到所有的内置中间件，然后再放入我们自己的中间件即可
    - 代码示例
      import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
      import logger from 'redux-logger'

      export default configureStore({
        middleware: [...getDefaultMiddleware(), logger],
        reducer: { // 该属性类似于 combineReducer 方法，穿进去即代表回族合成一个打的 store 对象
          [TODOS_SOMETHING]: TodosReducer,
        },
        devTools: process.env.NODE_ENC !== 'production'
      })
  
  6. 实体适配器 
    - 释义：相当于给数据提供了一个容器，将数据放到该容器中，容器会给我们提供一系列操作数据的方法
    - 代码示例
      // src/store.todos.js
      import { createSlice， createEntityAdapter } from '@reduxjs/toolkit'

      export const TODOS_SOMETHING = 'todos'

      const todoAdapter = createEntityAdapter()

      const { reducer: TodoReducer, actions } = createSlice({
        name: TODOS_SOMETHING, // 名字表示是哪一个store
        initialState: todoAdapter.getInitialState(), // 初始数据
        reducers: { // reducers函数
          addTodo: (state, action) = >{ // 函数的名字则表示dispatch可触发的action
            todoAdapter.addOne(state, action.payload)
          },
        },
        extraReducers: {
          [loadTodos.fulfilled]: (state, action) => {
            todoAdapter.addMany(state, action.payload)
          }
        }
      })

      export const { addTodo } = actions
      export default TodoReducer
    - 通过 实体适配器 存储数据格式最终为一个对象，有ids和entities 两个属性
      {
        ids: [1, 2, 3, 4],
        entities: {
          1: {},
          2: {},
          3: {},
          4: {}
        }
      }
      1. ids 保存的是每条数据的 id
      2. entities 以id为key保存每条数据

  7. 状态选择器
    - 简化组件中获取状态的代码
    - 创建
      import { createSlice, createSelector } from ''@reduxjs/toolkit'
      
      // todosAdapter.getSelector() 返回一个对象，该对象下的一系列方法用来简化我们获取数据
      // selectIds 返回 adapter 中的 ids 属性
      // selectEntities 返回 adapter 中的 entities 属性
      // selectAll 返回数据的数组
      // selectTotal 返回数据的条数
      // selectAById 根据id获取数据
      const { selectAll } = todosAdapter.getSelector()
      export const selectTodoList = createSelector(state => state[TODOS_SOMETHING]， selectAll)
    - 使用
      const todos = useSelector(selectTodoList)

  8. 不可变数据
    1. 数据突变与不可变
      - 数据突变 即引用数据类型同时拥有多个引用，修改一处，其他地方使用时都是以修改后的
    
    2. 数据不可变
      - 操作引用类型的值的时候，返回一个新的修改之后的值，例如slice操作

