# tiny-url
A small node.js url routing package.

#example

```js
var http = require('http');
var fs = require('fs');
var url = require('tiny-url');

var route = new url.Router();

route.get('/[ac]', function(req, res) {
    res.write('this is a loop');
    res.end();
});

route.get('/(e|3)', function(req, res) {
    res.write('this is a enum');
    res.end();
})

route.get('/', function(req, res) {
    res.write('root');
    res.end();
});

route.page404 = function(req, res) {
    res.write('I have overridden the page.');
    res.end();
}

var server = http.createServer(function(req, res) {
    route.apply(req, res);
});

server.listen(8000);
```

I pity anyone who uses this for production.  

Feel free to improve it!
