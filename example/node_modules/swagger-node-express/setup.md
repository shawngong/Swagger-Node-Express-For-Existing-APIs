#Swagger for express.js Project Setup

In order to integrate the Swagger documentation in your application, you'd need to follow these three set up steps:

1. [Adding Swagger's dependencies to your project.](#adding-swaggers-dependencies-to-your-project)
2. [Hook Swagger into your express application.](#hooking-up-swagger-core-in-your-application)
3. [Configure and Initialize Swagger.](#configure-and-initialize-swagger)

## Adding Swagger's Dependencies to your Project
Swagger uses npmjs for dependency management. You can either build the swagger-node-express module locally or simply depend on a version from npmjs.org in your `package.json`.

### Understanding Swagger's Naming Convention

Swagger for express.js uses the package name of [`swagger-node-express`](https://www.npmjs.org/package/swagger-node-express).  The versioning for swagger for express.js and compatibility is as follows:

swagger-node-express version | swagger-spec version | express.js compatible version
------|-----|------
2.1.x | 1.2 | 3.x |

As you see above, the 2.1.x versions of swagger for express.js are compatible with the swagger 1.2 specificaiton.  For more information on swagger specification versions, please see the [swagger-spec repository](https://github.com/swagger-api/swagger-spec).

### Adding the dependencies to your application

At the time of writing this document, Swagger-node-express 2.1.1 is the latest release, which will be used in the examples in this document. It can be assumed that future versions will be attached in a similar manner. Should the behavior change, the document will be updated accordingly. The latest Swagger-Core version can be found here - https://github.com/swagger-api/swagger-node-express#compatability.

To add the swagger dependencies, simply add the following to your `package.json`:

```json
"dependencies": {
  "swagger-node-express": "2.1.0"
}
```

## Hooking up swagger-node-express in your Application

Swagger-node-express exposes a single, dynamic endpoint to serve the Swagger API documentation. In this section we'll explore the process to enable swagger in your application to start serving your documentation.

A successful hook-up will give you access to Swagger's `/api-docs`. It does not mean the `/api-docs` will be populated, and you may need to follow the Swagger Configuration step as well.

### Creating a swagger instance in your app
First, you need to require swagger in your app.  This is usually done when requiring `express`, `cors`, etc:

```js
var swagger = require("swagger-node-express")
```

### Describing routes and attaching business logic

You can now add operations to your swagger instance.  This not only configures the routes for express, but allows the API description to be defined for the purposes of generating the swagger specification.  A resource definition looks like the following:

```js
var findById = {
  'spec': {
    method: "GET",
    path : "/pet/{petId}",
    description : "Operations about pets",  
    summary : "Find pet by ID",
    notes : "Returns a pet based on ID",
    nickname : "getPetById",
    type : "Pet",
    produces : ["application/json"],
    parameters : [paramType.path("petId", "ID of pet that needs to be fetched", "string")],
    responseMessages : [swe.invalid('id'), swe.notFound('pet')]
  },
  'action': function (req,res) {
    if (!req.params.petId) {
      throw swe.invalid('id'); }
    var id = parseInt(req.params.petId);
    var pet = petData.getPetById(id);

    if(pet) res.send(JSON.stringify(pet));
    else throw swe.notFound('pet',res);
  }
};
```

In the above, we're setting a JSON object in the `spec` field.  This object contains fields from the [swagger 1.2 specification](https://github.com/swagger-api/swagger-spec/blob/master/versions/1.2.md#52-api-declaration).  Primitive fields in the `spec` object map directly to [section 5.2.3](https://github.com/swagger-api/swagger-spec/blob/master/versions/1.2.md#523-operation-object) of the swagger spec.

For objects in the `operation`:

*parameters*.  Parameters are defined in [`paramTypes.js`](https://github.com/swagger-api/swagger-node-express/blob/master/lib/paramTypes.js) and are exported in the swagger object as `paramTypes`.  They may be of the following:

paramType | arg1 | arg2        | arg3 | arg4                | arg5                | arg6
-----------|------|-------------|------|---------------------|---------------------|------
query      | name | description | type | required            | allowableValuesEnum | defaultValue
path       | name | description | type | allowableValuesEnum | defaultValue        |
body       | name | description | type | defaultValue        |                     |
form       | name | description | type | required            | allowableValuesEnum | defaultValue
header     | name | description | type | required            |

*responseMessages*.  For convenience, default response messages have been defined in the core swagger library:

error name | http response code
-----------|-------------------
invalid    | 400
forbidden  | 403
notFound   | 404

You can use these default response messages as follows:

```js
swagger.errors.invalid('{field_name}')
```

Which will return the following message to the client, if an `invalid` state is detected:

```json
{
  "code": 400,
  "message": "invalid {field_name}"
}
```

You can add your own response functions and bind them to http response codes:

```js
{
  "code": 404,
  "message": "your custom message"
}
```

Now that the swagger spec is defined, you can bind an action to this HTTP method + path.

*action*.  The function to call when this route is executed.

```js
  'action': function (req, res) {
    /* do your business logic here */
  }
```

### Defining models
Key to Swagger definitions are the representation of models that flow in and out of the system.  The structure of swagger models is based on JSON Schema draft 4.  Models are added to swagger like such:

```json
var models = {
  'Category':{
    'id':'Category',
    'required': ['id', 'name'],
    'properties':{
      'id':{
        'type':'integer',
        'format': 'int64',
        'description': 'Category unique identifier',
        'minimum': '0.0',
        'maximum': '100.0'
      },
      'name':{
        'type':'string',
        'description': 'Name of the category'
      }
    }
  }
}

swagger.addModels(models)
```

Now models can be associated by `key` into operation inputs and outputs.

## Configure and Initialize Swagger
The final step is to configure Swagger metadata and initialize it. This is required for Swagger to scan the operations and expose them.

```js
swagger.setApiInfo({
  title: '{your-title}',
  description: '{your-description}',
  termsOfServiceUrl: '{your-terms-of-service}',
  contact: '{email-contact}',
  license: '{api-license}',
  licenseUrl: '{api-license-url}'
});
```

While optional, the above fields display important data on your API.

You now can tell swagger to build it's documentation, with the specified version and resource listing paths:

```js
swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure("http://localhost:8002", "1.0.0");
```

*configureSwaggerPaths* has the following signature:

`function(format, resourcePath, suffix)`

`format` is a format specifier for the path (i.e. `/pets.{format}`), and is typically used to specify the media type produced by this API.  Note, most API implementations now use the `accept` header to specify media types.

`resourcePath` is the location that the resource listing will be made available on the server.  The default for swagger 1.2 deployments is `api-docs`.

`suffix` is what to replace the `format` specifier with upon execution.  The value of `json` would convert this:

`/pet.{format}/find`

to this:

`/pet.json/find`

*configure* takes two parameters:

`basePath`.  This is used to define the path which operations are relative to.