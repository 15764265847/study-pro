// import { log } from './logger';
// import message from './message';
// import { name, version } from '../../package.json';
// import cjs from './commonjs.module';

// const msg = message.hi;

// log(msg);
// log(name);
// log(version);
// log(cjs); 

import('./logger')
    .then(({ log }) => {
        log('hello world');
    });