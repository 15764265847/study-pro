  <script type="module"></script>
  ES module 的特性
      1、自动执行严格模式，不需要自己添加
      2、私有作用域，外部无法访问其内部的变量
      3、通过CORS访问外部模块，如果请求的模块不支持CORS会抛出跨域错误
      4、会延迟执行，同添加defer类似

  export {  }
  单独使用export进行导出，后面必须跟一堆花括号，这是一种语法，而不是导出一个对象字面量
  export default {  }才是导出一个对象字面量
  同理import {  } from  '...'这也并不是结构而是使用import导入的一种固定语法

  import { name, age } from 'xxx';
  import后的变量和使用const类似，name = ''，直接修改会报错，但是假如name是一个对象，则其内部的属性是可以修改的，而这个修改会体现到其他所有使用该属性的地方

  import {xxx} from后的路径
      1、不能省略扩展名，即使用from 'index.js'不能省略掉js；但是时机做项目的过程中会省略是因为使用了webpack或者其他工具
      2、相对路径必须以 ./ 开头，因为不加 './' 会认为引入一个模块，这个和node中的require类似 
      3、也可以使用以'/'开头的绝对路径，是从根目录下开始找
      4、也可以使用完整的url去引入模块，例如 import { name } from 'http://xxxxx' 

  export { name, age };
  export default 'default';

  该情况可以通过 import title, { name, age } from 'xxxx'导入；','左侧是默认成员，右侧是具名成员
  title是给默认成员随便取了一个名字 

  <script nomodule></script>
  nomodule属性表示该脚本运行在不支持ES module的浏览器中，如果支持则不会执行


