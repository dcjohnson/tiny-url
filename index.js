var regex = require('tiny-url-regex');

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
        var segments = path.split('/');
        var verbObj = this.getVerbObject(verb);
        if (verbObj) {
            var hasUndefined = false;
            var endPoints = segments.map(function(elem, index, array) {
                if (elem === '' && index >= 0) {
                    hasUndefined = true;
                    return 'undefined';
                }
                var newHandler = index === array.length - 1 ? handler : 'undefined';
                return new Endpoint({
                    regexRule: elem,
                    depth: index,
                    handler: newHandler
                });
            });
            if (!hasUndefined) {
                for (var index = 1; index < endPoints.length; index++) {
                    endPoints[index - 1].setChildEndpoint(endPoints[index]);
                }
                verbObj.endPoints.push(endPoints[0]);
            }
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

    }
}

Endpoint = function(initObj) {
    var childEndpoint = 'undefined';
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
                if (this.childEndpoint) {
                    this.childEndpoint.applyUrl(req, res);
                }
            }
        }
        // Need to handle 404s
    }

    this.testUrl = function(req, res) {
        var isValid = true;
        if (this.testRequestSeg(req, res)) {
            if (this.childEndpoint) {
                isValid = isValid && this.childEndpoint.testUrl(req, res);
            }
            return isValid;
        }
        return false;
    }

    this.setChildEndpoint = function(newEndpoint) {
        this.childEndpoint = newEndpoint;
    }
}

exports.Router = Router;
exports.Endpoint = Endpoint;
