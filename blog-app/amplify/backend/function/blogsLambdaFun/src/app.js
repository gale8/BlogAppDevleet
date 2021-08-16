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

var uuid = require('node-uuid')

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
const path = "/blogs";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
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

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function(req, res) {

  // REZULTATE FILTRIRAJ -> da dobis samo SEZNAM BLOGOV
  let queryParams = {
    TableName: tableName,
    FilterExpression: 'begins_with(#pk,:val1) AND begins_with(#sk,:val2)',
    ExpressionAttributeNames: {
      '#pk': 'PK',
      '#sk': 'SK'
    },
    ExpressionAttributeValues: {
      ':val1': 'USER#',
      ':val2': 'BLOG#'
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

  params[partitionKeyName] = "BLOG#"+req.params[partitionKeyName];
  params[sortKeyName] = "BLOG#"+req.params[sortKeyName];

  let getItemParams = {
    TableName: tableName,
    Key: params
  };

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
* HTTP put method for UPDATE object *
*************************************/

app.put(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  var pkUID = "";
  // Spremeni oba zapisa -> avtor/blog IN blog/blog
  if(req.body["avtor"] === ""){
    pkUID = req.body.SK;
  } else {
    pkUID = "USER#"+req.body["avtor"];
  }
  // parametri za UPDATE --> UPDATE_EXPRESSION
  let putItemParams = {
    TableName: tableName,
    Key: { // ADD KEYS to alter the correct table!!!
      "PK": pkUID,
      "SK": req.body.SK
    },
    UpdateExpression: "set naslov = :n, vsebina = :v",
    ExpressionAttributeValues: {
      ":n": req.body.naslov,
      ":v": req.body.vsebina
    },
    ReturnValues: "UPDATED_NEW"
  };

  dynamodb.update(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'update call succeed!', url: req.url, data: req.body})
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

  // nastavimo UNIQUE PK!!!
  var UUID = "BLOG#"+uuid.v1();
  var pkUID = "";
  var skUID = "";
  // enkrat shrani blog sam, drugič pa še njegovega avtorja
  if(req.body["PK"]){
    pkUID = req.body.PK;
    skUID = pkUID;
  } else {
    pkUID = "USER#"+req.body["avtor"];
    skUID = UUID;
  }

  let noviBlog = {
    PK: pkUID,
    SK: skUID,
    naslov: req.body.naslov,
    vsebina: req.body.vsebina,
    datum: req.body.datum,
    avtor: req.body.avtor
  };

  let putItemParams = {
    TableName: tableName,
    Item: noviBlog
  };
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: noviBlog})
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

  // podaj ustrezno oznako za PK in SK!!!
  params[sortKeyName] = "BLOG#"+req.params[sortKeyName];
  if(req.body.izbrisiAvtorja === "")
    params[partitionKeyName] = "BLOG#"+req.params[partitionKeyName];
  else
    params[partitionKeyName] = "USER#"+req.params[partitionKeyName];


  let removeItemParams = {
    TableName: tableName,
    Key: params
  };
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
