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

We will be using [Swagger-Node-Express](https://github.com/swagger-api/swagger-node-express), [minimist](https://www.npmjs.com/package/minimist) and [Swagger-UI](https://github.com/swagger-api/swagger-ui). 

# Setting up Swagger

We begin by including `swagger-node-express` and `minimist` in our `package.json` dependencies.

```javascript
{
	...

	"dependencies": {
		"swagger-node-express": "~2.0",
    	"minimist": "*",
    	...
	}

	...


}


```