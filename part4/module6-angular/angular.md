### 创建 angular 应用 
  1. 安装 @angular/cli 脚手架
  2. 使用 ng new projects_name 来创建 angular 项目
    - 简单的创建一个项目 ng new projects_name --minimal --inlineTemplate false
    - 命令参数
      1. --minimal=true 创建最小化 angular 的项目
        -使用 ng new projects_name --minimal
        - 没有该参数时 会有很多单元测试相关的文件
      2. --skipGit=true 应用创建完成后脚手架会自动帮我们创建仓库，如果不需要这个功能，该参数设置为 true 即可
        - 使用 ng new projects_name --skipGit=true
      3. --skip-install 创建完项目结构以后，脚手架会自动帮我们下载依赖，如果不需要该功能，该参数设置为 true 即可
        - 使用 ng new projects_name
      4. --style=css  指定使用什么样的方式来处理css，可以是less和sass这样的css预处理器，也可以是原生的css
        - 默认值就是css
        - 使用 ng new projects_name --style=css 
      5. --routing=false 不创建路由文件
        - 使用 ng new projects_name --routing=false
        - 为 true 就是创建
      6. --inlineTemplate false  为 false 时 会将html模板与 js 拆分成两个文件
        - 使用 ng new projects_name --inlineTemplate false
        - 不加该参数 html 与 js 会在同一个文件内 
      7. --inlineStyle 将 css 文件合并到 组件的js文件中 
        - 使用 ng new projects_name --routing=false
      8. --prefix 组件类名字的前缀
        - 当我们使用 angular-cli 创建组件的时候 会有个默认的前缀名 app ，例如有一个 home 组件，在使用的时候必须为 app-home 才可以
        - 如果想修改的话就得使用该参数
        - 使用 ng new projects_name --prefix xxx
  3. 运行项目
    - 可以使用 npm start
    - 也可以使用 ng serve
      1. 参数
        - --open=true 应用构建完成之后，自动打开浏览器
        - --hmr=true 开启热更新
        - hmrWarning=false 禁用热更新警告
        - --port 8080 修改默认项目启动端口

  4. 项目创建完成后的默认代码解析
    - main.ts angular应用在启动的时候执行

  5. 共享模块
    - ng g m shared 创建共享模块，默认会在src/app 下创建一个 shared 文件夹
      - --flat=true 可以直接创建成一个文件，而不是一个文件夹，其他命令使用这个参数应该也可以
      - --routing=true 会同时创建当前模块对应的路由模块
    - ng g c shared/components/Lyout 创建组件
    - ng g d derectives/someDiretives 创建自定义指令 在 app 下的 derectives文件夹中
    - ng g p pipe/sumary 创建管道，管道的功能和 vue 的 filter 类似
    - ng g s test 直接在 app 目录下创建 test.service.ts 的服务
    - ng g guard guards/authGuard 创建路由守卫
    - ng g resolver guards/getName 创建 resolve 路由守卫
   
## Angular 基础
  1. 内容投影 =》 类似于 Vue 的插槽（<slot></slot>），只不过使用方式不太一样
  2. 生命周期 三个阶段
    - 挂载阶段，挂载阶段的生命周期只会在挂载阶段执行着一次，在后面组件更新时不会在执行
      1. angular 组件的 constructor 构造函数，可以接受到 Angular 注入的服务实例对象
      2. ngOnInit 在首次接受到输入的属性值之后执行，即此处可以接收类似 Vue 的 props 的数据
      3. ngAfterContentInit 内容投影初始渲染完成后调用 ，即 在此处可以拿到 内容投影(类似于 Vue 的插槽)
      4. ngAfterViewInit 组件视图渲染完成后调用 
    - 更新阶段
      1. ngOnChanges 
        - 当 输入属性值(类似 Vue 的 props) 发生变化时执行，初始设置时也会执行一次，顺序先于 ngOnInit
        - 不论多少输入属性值同时发生变化，该函数只会执行一次，变化的值会同时存储在参数中
        - 参数类型为 SimpleChange ，子属性类型为 SimpleChange
        - 对于基本类型值而言，只要只发生变化就会被监听到
        - 对于引用类型，可以检测到从一个对象变成了另一个对象，但是无法检测到对象内部属性的变化，但是不影响组件模板更新数据
      2. ngDoCheck
        - 主要用于调试
        - 只要输入属性发生了变化，他就会执行
        - 不推荐使用，因为执行频率太高，使用代价太大
      3. ngAfterContentChecked 
        - 内容投影更新完之后执行
      4. ngAfterViewChecked 
        - 组件视图更新完成后执行
    - 卸载阶段
      1. ngOnDestroy
        - 组件销毁之前进行清理操作
  
  3. 路由守卫
    - CanActivate 路由是否允许被访问
    - CanActivateChild 子级路由是否允许被访问
    - CanDeactivate 检测用户是否可以退出路由
    - Resolve 允许在进入路由前先获取数据，获取完数据后再进入路由



  
