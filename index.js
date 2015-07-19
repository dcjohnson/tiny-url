var regex = require('tiny-url-regex');

Router = function() {
    var urls = [];
    var subControllers = [];
    var middleWare = [];

    Verbs = function(verb) {
        this.verb = verb;
        this.endPoints = [];
    }

    SubController = function(router, path, master) {
        var segs = path.split('/');
        this.paths = segs.map(function(elem) {
            var ndfa = new regex.Ndfa(elem);
            ndfa.generateStates();
            return ndfa;
        });
        this.router = router;
        this.master = master;
    }

    this.addEndpoint = function(verb, path, handler) {
        var segments = path.split('/');
        var verbObj = this.getVerbObject(verb);
        if (verbObj) {
            var endPoints = segments.map(function(elem, index, array) {
                var newHandler = index === array.length - 1 ? handler : undefined;
                return new Endpoint({
                    regexRule: elem,
                    depth: index,
                    handler: newHandler
                });
            });
            for (var index = 1; index < endPoints.length; index++) {
                if (endPoints[index - 1]) {
                    endPoints[index - 1].setChildEndpoint(endPoints[index]);
                }
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

    this.addSubController = function(router, path) {
        this.subControllers.push(new SubController(router, path, this));
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
