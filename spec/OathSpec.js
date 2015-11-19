'use strict';

var Oath = require('../');

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
    describe("when immediately resolved", function() {
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
    describe("when resolved", function() {
        describe("should call `then`ed functions",
            function() {
                var result;

                beforeEach(function(done) {
                    var oath = new Oath(function(res) {
                        setTimeout(function() {
                            res(112358);
                        }, 1000);
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
    describe("when immediately rejected", function() {
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
    describe("when rejected", function() {
        describe("should call `catch`ed functions",
            function() {
                var result;

                beforeEach(function(done) {
                    var oath = new Oath(function(res, rej) {
                        setTimeout(function() {
                            rej(new Error("Warp coil malfunction."));
                        }, 1000);
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
                    setTimeout(function(){
                        rej(new Error(''));
                    }, 1000);
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
        describe("should reject if a resolve handler throws",
            function() {
                var result;

                beforeEach(function(done) {
                    var oath = new Oath(function(res) {
                        setTimeout(function() {
                            res(1);
                        }, 1000);
                    });
                    oath.then(function(rV) {
                        return rV + 1;
                    }).then(function() {
                        throw new Error("oh noez!");
                    }).catch(function(error) {
                        result = error;
                        done();
                    });
                });

                it('', function() {
                    expect(result === undefined).toBe(false);
                    expect(result instanceof Error).toBe(true);
                    expect(result.message).toBe("oh noez!");
                });
            }
        );
        describe("should resolve if a reject handler returns",
            function() {
                var result;

                beforeEach(function(done) {
                    var oath = new Oath(function(res, rej) {
                        setTimeout(function() {
                            rej(new Error("w"));
                        }, 1000);
                    });
                    oath.catch(function(error) {
                        return error.message + 'i';
                    }).then(function(m) {
                        return m + 'n';
                    }).then(function(m) {
                        throw new Error(m + 'n');
                    }).catch(function(error) {
                        return error.message + 'e';
                    }).then(function(m) {
                        result = m + 'r';
                        done();
                    });
                });

                it('', function() {
                    expect(result === undefined).
                        toBe(false);
                    expect(result).toBe('winner');
                });
            }
        );
    });
    describe("can be combined into one oath that", function() {
        describe("resolves once all oaths have resolved",
            function() {
                var result;

                beforeEach(function(done) {
                    var oaths = [];

                    function executor(res) {
                        var randNum = Math.random();
                        setTimeout(function() {
                            res(randNum);
                        }, 5000 * randNum);
                    }

                    for(var index = 0; index < 10; index++) {
                        oaths.push(new Oath(executor));
                    }

                    Oath.all(oaths).then(function(rV) {
                        result = rV;
                        done();
                    });
                });

                it('', function() {
                    expect(result === undefined).toBe(false);
                    expect(result instanceof Array).
                        toBe(true);
                    expect(result.reduce(function(pV, cV) {
                        return pV && cV <= 1 && cV >= 0;
                    }, true)).toBe(true);
                });
            }
        );
        describe("rejects once one oath has rejected",
            function() {
                var result;

                beforeEach(function(done) {
                    var oaths = [];

                    function executor(res, rej) {
                        var randNum = Math.random();
                        setTimeout(function() {
                            if(Math.random() > .5) {
                                res(randNum);
                            } else {
                                rej(new Error(''));
                            }
                        }, 5000 * randNum);
                    }

                    for(var index = 0; index < 10; index++) {
                        oaths.push(new Oath(executor));
                    }

                    Oath.all(oaths).then(function(rV) {
                        result = rV;
                        done();
                    }).catch(function(error) {
                        result = error;
                        done();
                    });
                });

                it('', function() {
                    expect(result === undefined).toBe(false);
                    expect(result instanceof Error).
                        toBe(true);
                    expect(result.message).toBe('');
                });
            }
        );
        describe("resolves once the first oath resolves",
            function() {
                var result;

                beforeEach(function(done) {
                    var oaths = [];

                    function executor(res, rej) {
                        var randNum = Math.random();
                        setTimeout(function() {
                            if(Math.random() > 0) {
                                res(randNum);
                            } else {
                                rej(new Error(''));
                            }
                        }, 5000 * randNum);
                    }

                    for(var index = 0; index < 10; index++) {
                        oaths.push(new Oath(executor));
                    }

                    Oath.race(oaths).then(function(rV) {
                        result = rV;
                        done();
                    }).catch(function(error) {
                        result = error;
                        done();
                    });
                });

                it('', function() {
                    expect(result === undefined).toBe(false);
                    expect(typeof result).
                        toBe('number');
                    expect(result >= 0).toBe(true);
                    expect(result <= 1).toBe(true);
                });
            }
        );
        describe("resolves once the first oath resolves",
            function() {
                var result;

                beforeEach(function(done) {
                    var oaths = [];

                    function executor(res, rej) {
                        var randNum = Math.random();
                        setTimeout(function() {
                            if(Math.random() > 1) {
                                res(randNum);
                            } else {
                                rej(new Error(''));
                            }
                        }, 5000 * randNum);
                    }

                    for(var index = 0; index < 10; index++) {
                        oaths.push(new Oath(executor));
                    }

                    Oath.race(oaths).then(function(rV) {
                        result = rV;
                        done();
                    }).catch(function(error) {
                        result = error;
                        done();
                    });
                });

                it('', function() {
                    expect(result === undefined).toBe(false);
                    expect(result instanceof Error).
                        toBe(true);
                    expect(result.message).toBe('');
                });
            }
        );
    });
    describe("unwrap values from oaths they resolve to",
        function() {
            var result;

            beforeEach(function(done) {
                (new Oath(function(res) {
                    res(new Oath(function(res) {
                        res("Gift wrapped");
                    }));
                })).then(function(rV) {
                    result = rV;
                    done();
                });
            });

            it('', function() {
                expect(result === undefined).toBe(false);
                expect(result instanceof Oath).toBe(false);
                expect(result).toBe("Gift wrapped");
            });
        }
    );
});
