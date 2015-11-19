'use strict';

const STATES = {
    PENDING : 'pending',
    REJECTED : 'rejected',
    RESOLVED : 'resolved'
};

function setHandler(oath, targetState, handler) {
    var newOath;

    if(oath.state === targetState) {
        newOath = new Oath(function(res, rej) {
            var chain = function chain(value) {
                try {
                    let resVal = handler(value);
                    res(resVal);
                } catch(e) {
                    rej(e);
                }
            };
            chain(oath.value);
        });
    } else {
        newOath = new Oath(function(res, rej) {
            var chain = function chain(value) {
                try {
                    let resVal = handler(value);
                    res(resVal);
                } catch(e) {
                    rej(e);
                }
            };
            oath.handlers[targetState].push(chain);
        });
    }

    return newOath;
}

function fulfill(oath) {
    var handlerArray = oath.handlers[oath.state];

    for(var index = 0; index < handlerArray.length; index++) {
        handlerArray[index](oath.value);
    }
}

function Oath(executor) {
    var self = this;
    self.state = STATES.PENDING;
    self.value = null;

    self.handlers = {};
    self.handlers[STATES.RESOLVED] = [];
    self.handlers[STATES.REJECTED] = [];

    function resolve(resVal) {
        self.state = STATES.RESOLVED;
        self.value = resVal;
        fulfill(self);
    }
    function reject(rejVal) {
        self.state = STATES.REJECTED;
        self.value = rejVal;
        fulfill(self);
    }

    executor(resolve, reject);
}
Oath.prototype.then = function oathThen(handler) {
    return setHandler(this, STATES.RESOLVED, handler);
};
Oath.prototype.catch = function oathCatch(handler) {
    return setHandler(this, STATES.REJECTED, handler);
};

module.exports = Oath;
