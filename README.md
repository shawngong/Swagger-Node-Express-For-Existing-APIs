# Swagger-Node-Express-For-Existing-APIs
A comprehensive guide on setting up Swagger in already built node-express-APIs.

# Introduction

Tired of your poorly documented APIs? Well, luckily for you [Swagger](http://swagger.io/) provides an open source software that allows for easy RESTful API documentation with the ability to test API endpoints in the UI. 

An example can be found [here](http://petstore.swagger.io/).

However, a lot of the documentation is based around creating Swagger compatable APIs from the ground up. 
With this guide, you will learn how to configure an existing node API with Swagger.

# Contents

* [Getting Started](https://github.com/shawngong/Swagger-Node-Express-For-Existing-APIs#getting-started)
* [Setting up Swagger](https://github.com/shawngong/Swagger-Node-Express-For-Existing-APIs#setting-up-swagger)
* [Swagger-Spec](https://github.com/shawngong/Swagger-Node-Express-For-Existing-APIs#swagger-spec) 
* Troubleshooting

# Getting Started

## Assumptions

For the purpose of this guide we will assume that you have a working knowledge of node.js and express, as
well as an existing node API. 

## The Idea

What we want to do is set up Swagger as a subpath within our existing API (which may or may not already have 
an UI). Thus, the Swagger routes will not interfer with the routes that already exist within our API. 

We will then create a [swagger-spec](https://github.com/swagger-api/swagger-spec), which is .json file that contains
all the information Swagger-UI needs to generate its UI. 

Finally, we will set up [Swagger-UI](https://github.com/swagger-api/swagger-ui) with the spec, and make sure the endpoints are being tested properly. 

## What to Use

We will be using [Swagger-Node-Express](https://github.com/swagger-api/swagger-node-express), [minimist](https://www.npmjs.com/package/minimist), [body-parser](https://www.npmjs.com/package/body-parser) and [Swagger-UI](https://github.com/swagger-api/swagger-ui). 

# Setting up Swagger

We begin by including `swagger-node-express` and `minimist` in our `package.json` dependencies.

```javascript
{
	...

	"dependencies": {
		"swagger-node-express": "~2.0",
    	"minimist": "*",
    	"body-parser": "1.9.x",
    	...
	}

	...

}
```

Then we install these modules using `npm install`

## Cloning Swagger-UI

We go to [Swagger-UI](https://github.com/swagger-api/swagger-ui) and clone their repository into our project.

Then we remove the `dist` directory from the Swagger-UI folder and delete the remainder of the folder (it is not necessary). The `dist` folder from Swagger-UI contains a functioning example of Swagger-UI, which is all we need. 

## Adding Swagger to our Application

We go into our express application and begin by adding swagger,minimist, and body-parser as dependencies: 

```javascript
	var express = require( 'express' );
	...
	var argv = require('minimist')(process.argv.slice(2));
	var swagger = require("swagger-node-express");
	var bodyParser = require( 'body-parser' );
```
Then, after the app is initialized, we set swagger to a subpath to avoid route overlaps: 

```javascript
	var app = express();
	var subpath = express();

	app.use(bodyParser());
	app.use("/v1", subpath);

	swagger.setAppHandler(subpath);
```
Next, we make sure that `/dist` is able to serve static files in express: 

```javascript
	app.use(express.static('dist'));
```
We continue by setting the info for our API:

```javascript
	swagger.setApiInfo({
	    title: "example API",
	    description: "API to do something, manage something...",
	    termsOfServiceUrl: "",
	    contact: "yourname@something.com",
	    license: "",
	    licenseUrl: ""
	});
```
We now want to get the `/dist/index.html` file that we pulled from the [Swagger-UI](https://github.com/swagger-api/swagger-ui) `dist` directory in our API. 

```javascript
	app.get('/', function (req, res) {
	    res.sendFile(__dirname + '/dist/index.html');
	});
```
Finally, we configure the api-doc path, and the API domain:

```javascript
		// Set api-doc path
	swagger.configureSwaggerPaths('', 'api-docs', '');
	 
	// Configure the API domain
	var domain = 'localhost';
	if(argv.domain !== undefined)
	    domain = argv.domain;
	else
	    console.log('No --domain=xxx specified, taking default hostname "localhost".')
	 
	// Configure the API port
	var port = 8080;
	if(argv.port !== undefined)
	    port = argv.port;
	else
	    console.log('No --port=xxx specified, taking default port ' + port + '.')
	 
	// Set and display the application URL
	var applicationUrl = 'http://' + domain + ':' + port;
	console.log('snapJob API running on ' + applicationUrl);
	 

	swagger.configure(applicationUrl, '1.0.0');

	 
	// Start the web server
	app.listen(port);
```
## Configuring our index.html file

Go to `/dist/index.html` and find the `url = "http://petstore.swagger.io/v2/swagger.json";` line. 

We will replace it with `url = "api-docs.json";`

```javascript
	if (url && url.length > 1) {
        url = decodeURIComponent(url[1]);
    } else {
    	<del>url = "http://petstore.swagger.io/v2/swagger.json";</del>
        url = "api-docs.json";
    }
```

Next, we will have to create a `api-docs.json` file in our `dist` directory. This file will be our Swagger-spec.

# Swagger-Spec

In our `api-docs.json` file we generate a [Swagger-spec](https://github.com/swagger-api/swagger-spec). 

The link will provide you with most information but it can be overwhelming so I will provide you with the most
important things to know about Swagger-spec for Swagger 2.0.

Please consult [here] for a sample Swagger-spec with detailed documentation about the common components of a Swagger-spec. 

## 
