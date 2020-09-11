define(['require'], function (require) { 'use strict';

    // import { log } from './logger';
    // import message from './message';
    // import { name, version } from '../../package.json';
    // import cjs from './commonjs.module';

    // const msg = message.hi;

    // log(msg);
    // log(name);
    // log(version);
    // log(cjs); 

    new Promise(function (resolve, reject) { require(['./logger-329727e0'], resolve, reject) })
        .then(({ log }) => {
            log('hello world');
        });

});
