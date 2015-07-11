var regex = require('tiny-url-regex');

Router = function() {
    this.getEndpoints = [];
    this.postEndpoints = [];
    this.externController = [];
    this.middleWare = [];
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
    this.middleWare.push(middleWare);
}

Router.prototype.apply = function(req, res) {
    for(var index = 0; index < this.middleWare.length; index++) {
        this.middleWare[index](req, res);
    }
}

UrlCheck = function(regexRule, checkFunc) {
    this.ndfa = new regex.Ndfa(regexRule);
    this.regex.generateStates();
    this.checkFunc = checkFunc;
}

UrlCheck.prototype.testUrlSegment = function(urlSeg, req, res) {
    var stringMatch = this.ndfa.testString(urlSeg);
    if (typeof this.checkFunc !== 'undefined') {
        return stringMatch && this.checkFunc(req, res);
    }
    return stringMatch;
}

Endpoint = function(urlChecker, endpointHandler) {
    this.handler = endpointHandler;
    this.childEndpoints = [];
    this.urlChecker = urlChecker;
}

Endpoint.prototype.applyUrl = function(urlSeg, req, res) {

}

Endpoint.prototype.testUrl = function(urlSeg, req, res) {
    return this.urlChecker.testUrlSegment(urlSeg, req, res);
}

Endpoint.prototype.addChildEndpoint = function(endPoint) {
    this.childEndpoints.push(endPoint);
}

Endpoint.prototype.getMatchingChildEndpoint = function(urlSeg) {
    var match = childEndpoints.filter(function(elem, index, array) {
        return elem.testUrl(urlSeg);
    });
    return match[0];
}

Endpoint.prototype.hasMatchingChildEndpoint = function(urlSeg) {
    var matches = childEndpoints.filter(function(elem, index, array) {
        return elem.testUrl(urlSeg);
    });
    return matches.length === 1;
}

exports.Router = Router;
exports.Endpoint = Endpoint;
