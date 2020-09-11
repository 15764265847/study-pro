define(['exports'], function (exports) { 'use strict';

    const log = (msg) => {
        console.log('------------ INFO -----------');
        console.log(msg);
        console.log('-----------------------------');
    };
    const error = (msg) => {
        console.log('------------ ERROR -----------');
        console.log(msg);
        console.log('------------------------------');
    };

    exports.error = error;
    exports.log = log;

});
