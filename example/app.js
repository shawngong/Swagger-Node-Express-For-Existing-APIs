'use strict';

var express = require( 'express' );
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var bodyParser = require( 'body-parser' );
