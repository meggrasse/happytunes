var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var client = require('twilio')(accountSid, authToken);

var http = require('http');
var express = require('express');
var twilio = require('twilio');

var app = express();
var phonenumber = '';

app.set('port', (process.env.PORT || 5000));

app.post('/sms', function(req, res) {
	console.log("here")
	res.redirect('/getnumber');
});

app.post('/inbound', function(req, res) {
	res.setHeader('content-type', 'text/html');
	var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Play>https://p.scdn.co/mp3-preview/6902e7da51d2f17e5369d57dadf8ce7d2a123f99.mp3</Play></Response>'
	res.end(xml)
});

app.post('/getnumber', function(req, res) {
	client.sms.messages.list(function(err, data) {
	  if (err) {
	  	console.log(err)
	  }
	  phonenumber = data.smsMessages.shift().from
	  res.redirect('/makecall')
	})
});

app.post('/makecall', function(req, res) {
	client.calls.create({
    	url: "https://frozen-inlet-59360.herokuapp.com/inbound",
    	to: phonenumber,
    	from: "+12678634319"
    }, function(err, call) {
		if (err) {
			console.log(err)
		}
    process.stdout.write(call.sid);
	})
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});