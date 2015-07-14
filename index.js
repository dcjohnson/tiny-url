var regex = require('tiny-url-regex');

Router = function() {
    var urls = [];
    var subControllers = [];
    var middleWare = [];

    this.addEndpoint = function(verb, path, handler) {

    }

    this.get = function(path, handler) {

    }

    this.post = function(path, handler) {

    }

    this.addSubController = function(subController) {

    }

    this.use = function(middleWare) {
        this.middleWare.push(middleWare);
    }

    this.apply = function(req, res) {
        for(var index = 0; index < this.middleWare.length; index++) {
            this.middleWare[index](req, res);
        }
    }
}

UrlCheck = function(regexRule, checkFunc, depth) {
    var ndfa = new regex.Ndfa(regexRule);
    ndfa.generateStates();
    var checkFunc = checkFunc;
    var depth = depth;

    this.testUrlSeg = function(req, res) {
        var urlSeg = req.url.split('/');
        var stringMatch = this.ndfa.testString(urlSeg);
        if (typeof this.checkFunc !== 'undefined') {
            return stringMatch && checkFunc(req, res);
        }
        return stringMatch;
    }
}

Endpoint = function(urlChecker, endpointHandler) {
    var handler = endpointHandler;
    var childEndpoints = [];
    var urlChecker = urlChecker;
    var pageNotFound = function(res) {
        res.write('404: Page not found.');
        res.end();
    }

    this.applyUrl = function(req, res) {
        if (this.testUrl(req, res)) {
            if (typeof handler !== 'undefined') {
                handler(req, res);
            } else {
                var nextEndpoint = this.getNextEndpoint(req, res);
                if (nextEndpoint) {
                    nextEndpoint.applyUrl(req, res);
                }
            }
        } else {
            pageNotFound(res);
        }
    }

    this.set404 = function(func404) {
        this.pageNotFound = func404;
    }

    this.testUrl = function(req, res) {
        return this.urlChecker.testUrlSeg(req, res);
    }

    this.addChildEndpoint = function(endPoint) {
        this.childEndpoints.push(endPoint);
    }

    this.getNextEndpoint = function(req, res) {
        return childEndpoints.filter(function(elem) {
            return elem.testUrl(req, res);
        })[0];
    }
}

exports.Router = Router;
exports.Endpoint = Endpoint;
exports.UrlCheck = UrlCheck;
