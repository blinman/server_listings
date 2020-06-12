var express = require('express');
var app = express();
const fs = require('fs');
const request = require('request');

app.use(express.static('public'));

app.get('/servers', function (req, res) {
    return getAuth('https://playground.tesonet.lt/v1/tokens', {
        'username': "tesonet",
        'password': "partyanimal"
    }).then(function (response) {
        return getServerList(response.token);
    }).then(function (response) {
        res.send(response);
    }).catch(function (failure){
        res.status(500).send(failure);
    });
});

app.use(function (req, res) {
    res.status(404).send('The thing you requested is not here, sorry about that');
  });

function getAuth(url, loginDetails) {
    return new Promise(function (resolve, reject) {
        request.post(url, {
            json: loginDetails
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject('sorry bro...\n getting the authorization token did not go as planned');
            }
        });
    });
}

function getServerList(authToken) {
    return new Promise(function (resolve, reject) {
        request.get('http://playground.tesonet.lt/v1/servers', {
            headers: {
                'Authorization': authToken
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject('sorry bro...\n getting the Teso server list did not go as planned');
            }
        });
    });
}

app.listen(5000);