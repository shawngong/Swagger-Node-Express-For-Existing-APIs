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
* [Troubleshooting](https://github.com/shawngong/Swagger-Node-Express-For-Existing-APIs#troubleshooting)

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

Please consult [here](https://github.com/shawngong/Swagger-Node-Express-For-Existing-APIs/blob/master/sample-spec.json) for a sample Swagger-spec.

## Https vs. Http

Depending on whether our web app is serving https or http files make sure to adjust our `schemes` component of the 
Swagger-spec to the appropriate transfer protocol. 

Example

```Javascript
	"schemes": [
		"https"
	]
```
## Tags

`tags` allow for all the methods of an API to be grouped together. The tags should be described in the top of the `.json` file.

```Javascript
	...
  "basePath": "/",
  "tags" : [
    {"name": "Tag1", 
    "description": "API for something"
    }
  ],
  ...
```
Then in each path, set a `tags` parameter with whatever tag group we want the method to be apart of.

```Javascript
	...
	/path/to/method": {
       "post": {
          "tags": ["Tag1"],
          ...

       	}
    }
```
This will put all of the methods with the `"Tag1"` tag together in the UI. 

## Paths

Paths are exactly as they sound. They are the API method endpoints. 

The `"paths"` parameter allows for nested path definitions. This can be shown in the example. 

A tricky component is setting up multiple types of requests for the same path (i.e) a `get` request
and a `delete` request in the same path. 

How we would do this is to nest two method definitions in the same path definition. 

```Javascript 
	"/path/to/method/{jobID}": {
        "delete":{
			...
        },
      	"get":{
          	...
        }
      }
```

## Responses

The `responses` parameter is for describing the types of possible responses our API method can provide. 

## Model Schema

A powerful part of Swagger is its model `schema`. Schema are example `.json` parameters that our API method would
take in or output. 

Typically schema in responses or parameters are referred to by `$ref":"#/definitions/schemaName`

```Javascript
	...
	"schema": {
                 "$ref": "#/definitions/createJobsRes"
              }
    ...
```

These schemas are then defined in the `definitions` section, after `paths`.

```Javascript
	...
	"definitions" : {
		"schemaName" : {

		}

	}

```

## Parameters

The `parameters` parameter defines the input that our API method takes in. 

The `in` parameter defines whether the input will be in the path or in the body of the API method. 

Typically single (say numerical) inputs would go in the `path`, whereas `.json` inputs would use the
`body` option. 

The `type` of the parameter could be a [varity](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#data-types) of options.



# Troubleshooting

## Tags

If we do not set a `tags` parameter for a method, then it will automatically have a `default` tag

Make sure to describe our `tags` in the top of the `.json` file, we can not describe the `tags` in 
each specific method.

## Validation 

Swagger uses a [validation tool](https://github.com/swagger-api/validator-badge) to validate all 
specs. This can cause issues as the default validator uses `http` rather than `https`. Thus,
some times it is better to turn off the validator. 

To turn off validation, go to `/dist/index.html` and put in `validatorUrl: null`

```Javascript
	...
	window.swaggerUi = new SwaggerUi({
        //Disabled validator, as soc-api is for local use. 
        validatorUrl: null,
        url: url,
    ...
```
