var ndfa = require('tiny-url-regex');

UrlTreeNode = function(children, urlPoint, handler) {
    this.children = children;
    this.urlPoint = urlPoint;
    this.handler = handler;
}

UrlTree = function(head, httpVerb) {
    this.head = head;
    this.httpVerb = httpVerb;
}

UrlTree.prototype.addEndPoint = function(points, handler) {

}

exports.Route = function() {
    this.endPoints = new UrlTree();
}

exports.Route.prototype.newRout = function(route, handler) {

}


var state = new ndfa.Ndfa('abc');
state.generateStates();
console.log(state.testString('abc'));
console.log(state.testString('abcc'));
