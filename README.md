# Swagger-Node-Express-For-Existing-APIs
A comprehensive guide on setting up Swagger in already built node-express-APIs.

# Introduction

Tired of your poorly documented APIs? Well, luckily for you [Swagger](http://swagger.io/) provides an open source software that allows for easy RESTful API documentation with the ability to test API endpoints in the UI. 

An example can be found [here](http://petstore.swagger.io/).

However, a lot of the documentation is based around creating Swagger compatable APIs from the ground up. 
With this guide, you will learn how to configure an existing node API with Swagger.

# Contents

* Assumptions
* The Idea
* What to Use
* Setting up Swagger
* Swagger-Spec
* Troubleshooting

# Assumptions

For the purpose of this guide we will assume that you have a working knowledge of node.js and express, as
well as an existing node API. 

# The Idea

What we want to do is set up Swagger as a subpath within our existing API (which may or may not already have 
an UI). Thus, the Swagger routes will not interfer with the routes that already exist within our API. 

We will then create a [swagger-spec](https://github.com/swagger-api/swagger-spec), which is .json file that contains
all the information Swagger-UI needs to generate its UI. 

Finally, we will set up [Swagger-UI](https://github.com/swagger-api/swagger-ui) with the spec, and make sure the endpoints are being tested properly. 

# What to Use

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

We go into our express application and begin by adding swagger and minimist as dependencies: 

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





