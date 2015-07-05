var regex = require('tiny-url-regex');

Router = function() {
    this.getEndpoints = [];
    this.postEndpoints = [];
    this.addEndpoint = function(endpoints, path, handler) {

    }
}

Router.prototype.get = function(path, handler) {
    this.addEndpoint(this.getEndpoints, path, handler);
}

Router.prototype.post = function(path, handler) {
    this.addEndpoint(this.postEndpoints, path, handler);
}

Router.prototype.addRouter = function(router) {

}

Router.prototype.use = function(middleWare) {

}

Router.prototype.apply = function(req, res) {

}

Endpoint = function(endpointHandler, regex, parentRouter) {
    this.router = parentRouter;
    this.handler = endpointHandler;
    this.childEndpoints = []
    this.regex = regex;
    this.regex.generateStates();
}

Endpoint.prototype.applyUrl = function(path) {

}

Endpoint.prototype.testUrl = function(path) {
    return this.regex.testString(path);
}

Endpoint.prototype.addChildEndpoint = function(endPoint) {
    this.childEndpoints.push(endPoint);
}



var r = new Router();

r.get('a', 'b');

exports.Router = Router;
exports.Endpoint = Endpoint;

var ndfa = new regex.Ndfa('ab[a|b]san334bnljslj4blsj[a|b|09|s|e|g]A[a|b|9|s|e|g]cA[a|b|9|s|e|g]cA[a|b|9|s|e|g]cA[a|b|9|s|e|g]cA[a|b|9|s|e|g]c');
ndfa.generateStates();
console.log(ndfa.testString('abaaac'));
console.log(ndfa.testString('abbbaababbc'));
