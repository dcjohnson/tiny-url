UrlTreeNode = function(children, urlPoint, isRegex, handler) {
	this.children = [children];
	this.urlPoint = urlPoint;
	this.isRegex = isRegex;
	this.handler = handler;
};

// UrlTreeNode.prototype.compareUrlPoints = function(urlPoint) {
// 	if(this.isRegex === true) {
//
// 	} else {
// 		return this.urlPoint === urlPoint;
// 	}
// }

UrlTree = function(head, httpVerb) {
	this.head = head;
	this.httpVerb = httpVerb;
};

UrlTree.prototype.addEndPoint = function(points, handler) {

}

exports.Route = function() {
	this.endPoints = new UrlTree();
};

exports.Route.prototype.newRout = function(route, handler) {

};
