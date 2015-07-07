var regex = require('tiny-url-regex');

Router = function() {
    this.getEndpoints = [];
    this.postEndpoints = [];
    this.addEndpoint = function(endpoints, path, handler) {
        var pathSegments = path.split('/');
        var paths = endpoints.filter(function(elem, index, array) {
            return elem.testUrl(pathSegments[0]);
        });
        var path = paths[0];
        var pathExists = paths.length === 1;
        for (var index = 1; index < pathSegments.length; index++) {
            if (path.hasMatchingChildEndpoint(pathSegments[index])) {
                path = path.getMatchingChildEndpoint(pathSegments[index]);
            } else {
                var ndfa = new regex.Ndfa(pathSegments[index]);
                ndfa.generateStates();
                if (index + 1 === pathSegments.length) {
                    var newEndpoint = new Endpoint(ndfa, this, handler);
                } else {
                    var newEndpoint = new Endpoint(ndfa, this);
                }
                path.addEndpoint(newEndpoint);
                path = newEndpoint;
            }
        }
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

Endpoint = function(regex, parentRouter, endpointHandler) {
    this.router = parentRouter;
    this.handler = endpointHandler;
    this.childEndpoints = [];
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

Endpoint.prototype.getMatchingChildEndpoint = function(urlSegment) {
    var match = childEndpoints.filter(function(elem, index, array) {
        return elem.testUrl(urlSegment);
    });
    return match[0];
}

Endpoint.prototype.hasMatchingChildEndpoint = function(urlSegment) {
    var matches = childEndpoints.filter(function(elem, index, array) {
        return elem.testUrl(urlSegment);
    })
    return matches.length === 1;
}



var r = new Router();

r.get('a', 'b');

exports.Router = Router;
exports.Endpoint = Endpoint;

var ndfa = new regex.Ndfa('ab[a|b]san334bnljslj4blsj[a|b|09|s|e|g]A[a|b|9|s|e|g]cA[a|b|9|s|e|g]cA[a|b|9|s|e|g]cA[a|b|9|s|e|g]cA[a|b|9|s|e|g]c');
ndfa.generateStates();
console.log(ndfa.testString('abaaac'));
console.log(ndfa.testString('abbbaababbc'));
