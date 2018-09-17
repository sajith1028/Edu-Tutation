var expect  = require('chai').expect;
var request = require('request');

it('Landing page status', function(done) {
    request('https://akura-nimesha.c9users.io/' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Login page status', function(done) {
    request('https://akura-nimesha.c9users.io/login' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Student Home page status', function(done) {
    request('https://akura-nimesha.c9users.io/student' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});