var regex = require('tiny-url-regex');

/// Update! This code is under heavy work!
/// I have decided to take the easy route.
/// There will be a major change in how this will be designed.

Router = function() {
    var urls = [];
    var subControllers = [];
    var middleWare = [];

    Verbs = function(verb) {
        if (!verb) {
            throw "No verb defined.";
        }
        this.verb = verb;
        this.endPoints = [];
    }

    SubController = function(router, path, master) {
        if (!router) {
            throw "Router not defined.";
        }
        if (!path) {
            throw "Path not defined.";
        }
        if (!master) {
            throw "Master not defined.";
        }
        this.path = path;
        this.router = router;
        this.master = master;
    }

    this.addEndpoint = function(verb, path, handler) {
        // I will need test the subControllers.


        var verbObj = this.getVerbObject(verb);
        if (verbObj) {
            verbObj.endPoint.map(function(elem) {
                elem.addChildEndpoint(handler, path.split('/'));
            });
        }
    }

    this.get = function(path, handler) {
        this.addEndpoint('get', path, handler);
    }

    this.post = function(path, handler) {
        this.addEndpoint('post', path, handler);
    }

    this.getVerbObject = function(verb) {
        return this.urls.filter(function(elem) {
            return verb === elem.verb;
        })[0];
    }

    this.checkSubControllerPaths = function(path) {

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

Endpoint = function(initObj) {
    var childEndpoints = [];
    var depth = initObj.depth;

    var handler = initObj.endpointHandler;
    var ndfa = new regex.Ndfa(initObj.regexRule);
    ndfa.generateStates();

    this.testRequestSeg = function(req, res) {
        var urlSeg = req.url.split('/');
        var stringMatch = ndfa.testString(urlSeg[depth]);
        if (checkFunc) {
            return stringMatch && checkFunc(req, res);
        }
        return stringMatch;
    }

    this.applyUrl = function(req, res) {
        if (this.testUrlSeg(req, res)) {
            if (handler) {
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

    this.testUrl = function(req, res) {
        var isValid = true;
        if (this.testRequestSeg(req, res)) {
            var nextEndpoint = this.getNextEndpoint(req, res);
            if (nextEndpoint) {
                isValid = isValid && nextEndpoint.testUrl(req, res);
            }
            return isValid;
        }
        return false;
    }

    this.addChildEndpoint = function(newHandler, segments) {
        // This could likely be optomized because I am checking the
        // validity of the url too many times.
        if (ndfa.testString(segments[depth])) {
            var nextEndpoint = this.childEndpoints.filter(function(elem) {
                return elem.testUrlSeg(path);
            })[0];
            if (nextEndpoint) {
                nextEndpoint.addChildEndpoint(endPoint, segments);
            } else if (segments.length > depth) {
                var endPoint = new Endpoint({
                    regexRule: segments[depth + 1],
                    depth: depth + 1
                });
                childEndpoints.push(endPoint)
            } else {
                var endPoint = new Endpoint({
                    regexRule: segments[depth + 1],
                    depth: depth + 1,
                    endpointHandler: newHandler
                });
                childEndpoints.push(endPoint);
            }
        }
    }

    this.getNextEndpoint = function(req, res) {
        return childEndpoints.filter(function(elem) {
            return elem.testRequestSeg(req, res);
        })[0];
    }
}

exports.Router = Router;
exports.Endpoint = Endpoint;
