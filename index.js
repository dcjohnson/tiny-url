var regex = require('tiny-url-regex');

Router = function() {
    var urls = [];
    var subControllers = [];
    var middleWare = [];

    Verb = function(verb) {
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

    this.page404 = function(req, res) {
        res.write('Ooops!');
        res.end();
    }

    this.addEndpoint = function(verb, path, handler) {
        var segments = path.split('/');
        var verbObj = this.getVerbObject(verb);
        var endPoints = segments.map(function(elem, index, array) {
            var newHandler = index === array.length - 1 ? handler : undefined;
            return new Endpoint({
                regexRule: elem,
                depth: index,
                endpointHandler: newHandler,
            });
        });
        for (var index = 1; index < endPoints.length; index++) {
            endPoints[index - 1].setChildEndpoint(endPoints[index]);
        }
        if (verbObj) {
            verbObj.endPoints.push(endPoints[0]);
        } else {
            var newVerb = new Verb(verb);
            newVerb.endPoints.push(endPoints[0]);
            urls.push(newVerb)
        }
    }

    this.get = function(path, handler) {
        this.addEndpoint('GET', path, handler);
    }

    this.post = function(path, handler) {
        this.addEndpoint('POST', path, handler);
    }

    this.getVerbObject = function(verb) {
        return urls.filter(function(elem) {
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
        var passControl = true;
        for (var index = 0; index < middleWare.length; index++) {
            passControl = passControl && middleWare[index](req, res);
            if (!passControl) {
                break;
            }
        }
        if (passControl) {
            var endPoints = this.getVerbObject(req.method).endPoints;
            var useEndpoints = false;
            for (var index = 0; index < endPoints.length; index++) {
                useEndpoints = useEndpoints || endPoints[index].testUrl(req, res);
            }
            if (useEndpoints) {
                for (var index = 0; index < endPoints.length; index++) {
                    endPoints[index].applyUrl(req, res);
                }
            } else {
                this.page404(req, res);
            }
            // Now, handle the subcontrollers.
        }
    }
}

Endpoint = function(initObj) {
    var childEndpoint = initObj.childEndpoint;
    var depth = initObj.depth;
    var handler = initObj.endpointHandler;
    var ndfa = new regex.Ndfa(initObj.regexRule);
    ndfa.generateStates();

    this.testRequestSeg = function(req, res) {
        return ndfa.testString(req.url.split('/')[depth]);
    }

    this.consumedEntireUrl = function(req) {
        return req.url.split('/').length - 1 === depth;
    }

    this.applyUrl = function(req, res) {
        if (this.testRequestSeg(req, res)) {
            var consumedUrl = this.consumedEntireUrl(req);
            if (childEndpoint && !consumedUrl) {
                childEndpoint.applyUrl(req, res);
            } else if (handler && consumedUrl) {
                handler(req, res);
            }
        }
    }

    this.testUrl = function(req, res) {
        var isValid = true;
        if (this.testRequestSeg(req, res)) {
            if (childEndpoint) {
                isValid = isValid && childEndpoint.testUrl(req, res);
            }
            return isValid;
        }
        return false;
    }

    this.setChildEndpoint = function(newEndpoint) {
        childEndpoint = newEndpoint;
    }
}

exports.Router = Router;
exports.Endpoint = Endpoint;
