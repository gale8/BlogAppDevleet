/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

var uuid = require('uuid');
// JWT dependencies
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
const rp = require('request-promise');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "blogAppDB";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "PK";
const partitionKeyType = "S";
const sortKeyName = "SK";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/comments";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials",true);
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

// function returns VERIFIED JWT!!
function verifyJWT(token) {
  const param = {
    method: "GET",
    uri: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_zQDYnTlws/.well-known/jwks.json",
    json: true
  };
  rp(param)
    .then(function (jwkArr) {
      // poisci ustrezen public key na podlagi KID!!
      for (var i = 0; i<jwkArr.keys.length; i++) {
        if(jwkArr.keys[i].kid === token.header.kid){
          // get PEM
          const pem = jwkToPem(jwkArr.keys[i]);
          // VERIFY TOKEN:
          jwt.verify(token, pem, { algorithms: ['RS256'] }, function(err, decodedToken) {
            if (err) {
              console.log("ERRRRROR");
              return false;
            }
            else{
              // VRNI DEKODIRAN ŽETON!
              return decodedToken;
            }
          });
        }
      }
    })
    .catch(function (err) {
      // API call failed...
      console.log("ERR");
    });
}

// function returns DECODED JWT!!
function decodeJWT(token) {
  var decodedJwt = jwt.decode(token,{complete: true});
  // dekodiran zeton!
  return decodedJwt;
}

/*****************************************
 * HTTP Get method for get ALL objects   *
 *****************************************/
app.get(path + hashKeyPath, function(req, res) {

  console.log(req.params.PK);
  let queryParams = {
    TableName: tableName,
    FilterExpression: '#pk=:val1 AND begins_with(#sk,:val2)',
    ExpressionAttributeNames: {
      '#pk': 'PK',
      '#sk': 'SK'
    },
    ExpressionAttributeValues: {
      ':val1': req.params.PK,
      ':val2': 'COMMENT#'
    }
  };

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  var token = req.get("X-Api-Key");
  var decodedToken = decodeJWT(token);

  // preveri, če ureja komentar njegov avtor:
  if(decodedToken.payload.username !== req.body.avtor) {
    return res.json({statusCode: 403, error: "Unauthorized"});
  }

  let putItemParams = {
    TableName: tableName,
    Key: {
      "PK": req.body.PK,
      "SK": req.body.SK
    },
    UpdateExpression: 'set vsebina = :v',
    ExpressionAttributeValues: {
      ":v" : req.body.vsebina
    },
    ReturnValues: "UPDATED_NEW"
  };
  dynamodb.update(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'put call succeed!', url: req.url, data: data})
    }
  });
});

/************************************
* HTTP post method for insert NEW object *
*************************************/

app.post(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  // get JWT from HEADER!
  //var jwtUser = req.get("X-Api-Key");

  // generate SK
  var sk = "COMMENT#"+uuid.v1();

  var newComment = {
    PK: req.body.PK,
    SK: sk,
    vsebina: req.body.vsebina,
    avtor: req.body.avtor,
    upvotes: req.body.upvotes
  };

  let putItemParams = {
    TableName: tableName,
    Item: newComment
  };

  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: newComment})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  // RESTRICT delete to author of comment and author of the blog
  var token = req.get("X-Api-Key");
  var decodedToken = decodeJWT(token);

  if(decodedToken.payload.username !== req.body.avtorKomentarja){
    res.json({statusCode: 403, error: "Unauthorized"});
  }


  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
