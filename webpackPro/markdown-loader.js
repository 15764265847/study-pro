// 该文件导出一个函数，该函数就是对于文件内容的处理过程，该文件的输入就是需要处理的文件的内容，输出是我们处理后的结果

// marked是专门用来解析markdown文件的工具，转换后返回一个html
const marked = require('marked');

 module.exports = source => {
    // console.log(source);
    // return 'console.log("Hello ~")';
    const html = marked(source);
    // 这里为甚么不是这样 module.exports = html
    // 因为这样直接使用换行符之类的可能会导致语法错误
    // 所以这里使用了JSON.stringify处理一下，换行符之类的就会被转义
    // return `module.exports = ${ JSON.stringify(html) }`;
    return html;
 }