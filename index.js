var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

//body-parser module to process the requests body as json objects.
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// imports 'router module' for the authentication endpoints
var authRoutes = require('./routes/authRoutes') 
authRoutes(app);

// starts the node server on the specified port
app.listen(port);

console.log(`Node server started on: ${port}.`);