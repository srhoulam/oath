'use strict';

var Oath = require('../oath');

describe("oath", function() {
    it("should have then and catch methods", function() {
        var oath = new Oath(function(res, rej) {
            res(null);
        });
        expect(oath.then).toNotBe(undefined);
        expect(oath.catch).toNotBe(undefined);
    });
});
