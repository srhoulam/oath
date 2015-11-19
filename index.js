'use strict';

var Oath = require('./oath');

Oath.all = function oathAll(oaths) {
    return new Oath(function(res, rej) {
        var accumulator = new Array(oaths.length);
        var numResolved = 0;

        function onResolveFactory(index) {
            return function onResolve(resVal) {
                accumulator[index] = resVal;
                numResolved++;

                if(numResolved === oaths.length) {
                    res(accumulator);
                }
            };
        }
        function onReject(error) {
            rej(error);
        }

        oaths.forEach(function(currOath, index) {
            currOath.then(onResolveFactory(index));
            currOath.catch(onReject);
        });
    });
};

Oath.race = function oathRace(oaths) {
    return new Oath(function(res, rej) {
        var numRejected = 0;

        function onReject(error) {
            numRejected++;

            if(numRejected === oaths.length) {
                rej(error);
            }
        }
        function onResolve(resVal) {
            res(resVal);
        }

        oaths.forEach(function(currOath) {
            currOath.then(onResolve);
            currOath.catch(onReject);
        });
    });
};

module.exports = Oath;
