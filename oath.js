'use strict';

const STATES = {
    PENDING : 'pending',
    REJECTED : 'rejected',
    RESOLVED : 'resolved'
};

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
    var self = this;
    var newOath;

    if(self.state === STATES.RESOLVED) {
        newOath = new Oath(function(res, rej) {
            var chain = function chain(value) {
                try {
                    let resVal = handler(value);
                    res(resVal);
                } catch(e) {
                    rej(e);
                }
            };
            chain(self.value);
        });
    } else if(self.state === STATES.PENDING) {
        var rejChain;
        newOath = new Oath(function(res, rej) {
            var chain = function chain(value) {
                try {
                    let resVal = handler(value);
                    res(resVal);
                } catch(e) {
                    rej(e);
                }
            };
            self.handlers[STATES.RESOLVED].push(chain);
            rejChain = function rejChain(error) {
                rej(error);
            };
            self.handlers[STATES.REJECTED].push(rejChain);
        });
    } else {
        newOath = new Oath(function(res, rej) {
            rej(self.value);
        });
    }

    return newOath;
};
Oath.prototype.catch = function oathCatch(handler) {
    var self = this;
    var newOath;

    if(self.state === STATES.REJECTED) {
        newOath = new Oath(function(res, rej) {
            var chain = function chain(value) {
                try {
                    let resVal = handler(value);
                    res(resVal);
                } catch(e) {
                    rej(e);
                }
            };
            chain(self.value);
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
            self.handlers[STATES.REJECTED].push(chain);
        });
    }

    return newOath;
};
Oath.prototype.all = function oathAll() {
    // write Promise.all
};

module.exports = Oath;
