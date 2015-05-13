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

What we want to do is set up Swagger-UI as a subpath within your existing API (which may or may not already have 
an UI). Thus, the Swagger routes will not interfer with the routes that already exist within your API. 

