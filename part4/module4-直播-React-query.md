# React Query
  ## 概述
    - 使React应用 获取、缓存、同步或者更新 服务端状态变得轻而易举
      1. 请求管理
        - 会在适当时机会自动向服务器发送请求
        - 适当时机指请求出错时、网络重连时、浏览器窗口重新获取焦点时
        - 基于请求库上层的封装，实现了和请求相关的逻辑，比如无线加载，失败重试，轮训，请求状态查询等
      2. 状态管理
        - 会将获取到数据缓存到内存中，任何组件都可以从缓存中获取状态，从而实现全局共享
      3. 下载 yarn add react-query
      4. 项目较小时可用 React Query 替代 Redux ，但是在多人协作的大型项目中建议还是使用 Redux
  
  ## 全局配置
    1. 组件可以通过 queryClient 对象来操作内存中的缓存
    2. 开发者需要在应用的入口文件中通过 QueryClient 类来创建 queryClient 对象
    3. 开发者需要通过 QueryClientProvider 组件将 queryClient 传递到下层组件
    4. 组件通过 useQueryClient 钩子函数来获取到 queryClient 对象

  ## useQuery 同步服务端状态
    1. 组件挂在完之后发送请求获取并缓存状态
    2. 内部使用 react 的 useEffect 实现
    3. const { isLoading, isError, error, data } = useQuery(todos, fetchTodos)
      - 第一个参数是保存在内存中使用的key，不能重复
      - 第二个参数是获取数据的方法
    4. 配置项
      - 该钩子函数第三个参数即为配置项
        - retry 配置重试次数 默认为 3 次，false 则不重试
        - refetchOnWindowFocus 当浏览器重新获取到焦点时重新获取数据 true 开启    false 关闭
        - enabled 组件挂在完成后获取服务端数据  true 开启   false 关闭
        - staleTime 数据缓存的时间，如果未过期，走缓存，如果过期了，重新获取数据
        - placeholderData 在请求数据时，数据未返回时，该数据可以作为默认数据填充客户端提升用户体验
        - refetchInterval 指定时间间隔，即轮训，每隔多少毫秒发送一次请求   false 关闭该功能，默认值

    5. queryKey    useQuery 的第一个参数
      - 该参数还可以使用 数组 ，实现查询时传递参数
      - 代码示例，useQuery 会给他的回调函数传入一个对象参数，这个参数中可以解构出 queryKey
        function getSomthing({ queryKey }){
          console.log(queryKey[1])
        }
        useQuery([todos, 2], getSomthing)
  
  ## useMutation 修改状态
    1. 修改服务器端数据，增删改查
      - 第一个参数是发送请求的函数
      - 第二个参数是配置项
        - 例
          {
            onSuccess: () => {
              // doSomething
            }
          }
    2. 会返回一个函数，点击按钮或其他时，调用返回的函数进行发送请求
      - 该函数的参数 即 doSome 的参数
      - 例
        function doSome(todo) {
          return axios.post('.....', todo)
        }
        const queryClient = useQueryClient()
        const { mutate } = useMutation(doSome, {
          onSuccess: () => {
            // doSomething
            // 可以清空输入框数据
            // 更新列表数据
            queryClient.invalidateQueries('todos')
          }
        })

        <button onClick={() => {
          mutate({ isCompleted: false, isEditing: false, title })
        }}></button>

    3. 同步服务器数据
      - 调用 queryClient.invalidateQueries('todos') 方法，是对应key的数据失效，然后他会自动发送请求，获取最新的数据
      - 示例代码
        const queryClient = useQueryClient()
        queryClient.invalidateQueries('todos')
    
    4. 操作客户端缓存 还是通过 queryClient 下的API
      - setQueryData 手动设置缓存数据
      - 示例代码 
        const { mutate } = useMutation(doSome, {
          onSuccess: (response) => {
            // doSomething
            // 可以清空输入框数据
            // 更新列表数据
            setQueryData('todos', data => data.map(todo => todo.id !== response.id ? todo : response))
          }
        })

  ## useQuery 全局状态共享
    - 当缓存中的数据发生变化时，所有的使用 useQuery 获取到的数据都会同步获取到更新

  ## QueryObserver 状态订阅
    - 不推荐使用，因为相对复杂，能使用 useQuery 获取到的就不要用 QueryObserver

  ## useQueries 请求并发
    - 示例代码
      const data = useQueries([
        { queryKey: 'some1', queryFn: doSomeOne },
        { queryKey: 'some2', queryFn: doSomeTwo }
      ])

  ## useInfiniteQuery 实现分页
    1. 第三个参数是配置项，配置项中有一个 getNextPageParams ，该属性为一个函数，需要返回 下一页的页码
    2. 示例代码
      function fetchUsers({ pageParam }) {
        return axios.get(...)
      }
      const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery(
        'users',
        fetchUsers,
        {
          getNextPageParams(current) {
            if (current.page < current.total_pages) {
              return current.page + 1
            }
          }
        }
      )
    3. 获取到的数据
      - isLoading 初次加载的时候会变为 true 
      - isFetching只要发生加载行为就会变为 true
      - hasNextPage 是否还有下一页
      - fetchNextPage 获取下一页的数据的方法

  ## useIsFetching 全局加载状态
    - 代码示例  
      const isFething = useIsFetching()
    - isFething 只要使用了useQuery 等React Query 的 API 进行了数据请求，那么在请求过程中，数据未返回时， useIsFetching() 返回的就是 true
