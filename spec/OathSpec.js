'use strict';

var Oath = require('../oath');

describe("oaths", function() {
    it("should have then and catch methods", function() {
        var oath = new Oath(function(res) {
            res(null);
        });
        expect(oath.then === undefined).toBe(false);
        expect(oath.catch === undefined).toBe(false);
        expect(oath.then instanceof Function).
            toBe(true);
        expect(oath.catch instanceof Function).
            toBe(true);
    });
    describe("when resolved", function() {
        describe("should immediately call `then`ed functions",
            function() {
                var result;

                beforeEach(function(done) {
                    var oath = new Oath(function(res) {
                        res(112358);
                    });
                    oath.then(function(rV) {
                        result = rV;
                        done();
                    });
                });

                it('',function() {
                    expect(result === undefined).
                        toBe(false);
                    expect(result).toBe(112358);
                });
            }
        );
    });
    describe("when rejected", function() {
        describe("should immediately call `catch`ed functions",
            function() {
                var result;

                beforeEach(function(done) {
                    var oath = new Oath(function(res, rej) {
                        rej(new Error("Warp coil malfunction."));
                    });
                    oath.catch(function(err) {
                        result = err;
                        done();
                    });
                });

                it('', function() {
                    expect(result === undefined).
                        toBe(false);
                    expect(result instanceof Error).
                        toBe(true);
                    expect(result.message).
                        toBe("Warp coil malfunction.");
                });
            }
        );
    });
    describe("when chained", function() {
        describe("should cascade rejection", function() {
            var result;

            beforeEach(function(done) {
                var oath = new Oath(function(res, rej) {
                    rej(new Error(''));
                });
                oath.then(function() {
                    return 1;
                }).then(function(rV) {
                    result = rV;
                    return 'a';
                }).then(function(rV) {
                    result = rV;
                    done();
                    return null;
                }).catch(function(err) {
                    result = err;
                    done();
                });
            });

            it('', function() {
                expect(result === undefined).toBe(false);
                expect(result === 1).toBe(false);
                expect(result === 'a').toBe(false);
                expect(result instanceof Error).toBe(true);
                expect(result.message).toBe('');
            });
        });
    });
});
