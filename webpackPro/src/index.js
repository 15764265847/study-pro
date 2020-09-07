import './main.css';
// import temp from './markdown-temp.md';
import { a } from './editor.js';

const a = 1;
console.log(a);

module.hot.accept('./editor', () => {
    console.log('editor 模块gengxin了');
})