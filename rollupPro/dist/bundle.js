(function () {
    'use strict';

    const log = (msg) => {
        console.log('------------ INFO -----------');
        console.log(msg);
        console.log('-----------------------------');
    };

    var message = {
        hi: 'Hello World, yudeshui'
    };

    var name = "study-pro";
    var version = "1.0.0";

    var commonjs_module = {
        foo: 'bar'
    };

    const msg = message.hi;

    log(msg);
    log(name);
    log(version);
    log(commonjs_module);

}());
