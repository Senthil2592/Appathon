'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express();
var http    = require( 'http' );
var arr = [];
var count = 0;

app.set('port', (process.env.PORT || 8080))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	console.log("Get webhook : "+req.query['hub.verify_token']);
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
	greetingText();
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			start(sender);
			count +=1;
			let text = event.message.text;
			if(text === 'RESET') count = 0;
			arr.push(text);
			//sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))

		}
		if (event.postback) {
			let text = event.postback;
			console.log("Postback : "+ text.payload);
			if(text.payload === 'GET_START'){
				sendTextMessage(sender, "Welcome! Please provide your Personal Information to get Quote", token);
			} else if(text.payload === 'GENDER'){
				count +=1;
				console.log("Count GENDER : "+count);
				start(sender);
			} else if(text.payload === 'TOBACCO'){
				count +=1;
				console.log("Count TOBACCO : "+count);
				start(sender);
			} else if(text.payload === 'MARITIAL_STATUS'){
				count +=1;
				console.log("Count HEALTH : "+count);
				start(sender);
			} else if(text.payload === 'TERM'){
				count +=1;
				console.log("Count CVGAMT : "+count);
				start(sender);
			} else if(text.payload === 'PAYMENT_MODE'){
				count +=1;
				console.log("Count CVGAMT : "+count);
				start(sender);
			}else {
				sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
			}
			continue
		}
	}
	res.sendStatus(200)
})

function start(id) {
  if (count == 1) {
    sendTextMessage(id, 'Please enter your full name');
  } else if (count == 3 ) {
  	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "What is your Gender?",
					"image_url": "http://globaltoynews.typepad.com/.a/6a0133ec87bd6d970b0168ea4059ce970c-500wi",
					"buttons": [{
						"type": "postback",
						"payload": "GENDER",
						"title": "Female"
					}, {
						"type": "postback",
						"title": "Male",
						"payload": "GENDER"
					}, {
						"type": "postback",
						"title": "Transgender",
						"payload": "GENDER"
					}],
				}]
			}
		}
	}
    sendGenericMessage(id, messageData);
  } else if (count == 2) {
    sendTextMessage(id, 'Please enter your birthdate in dd-MM-yyy format : ');

  } else if (count == 7) {
    let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Have you used tobacco products in last 3 years?",
					"image_url": "http://www.chargerbulletin.com/wp-content/uploads/2015/03/tobacco-free.jpg",
					"buttons": [{
						"type": "postback",
						"payload": "TOBACCO",
						"title": "Yes"
					}, {
						"type": "postback",
						"title": "No",
						"payload": "TOBACCO"
					}],
				}]
			}
		}
	}
    sendGenericMessage(id, messageData);
  }

	else if (count == 4 ) {
    let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Please select your maritial status",
					"image_url": "http://7-themes.com/data_images/out/67/7000746-red-heart-tree.jpg",
					"buttons": [{
						"type": "postback",
						"payload": "MARITIAL_STATUS",
						"title": "Yes"
					}, {
						"type": "postback",
						"title": "No",
						"payload": "MARITIAL_STATUS"
					}],
				}]
			}
		}
	}
    sendGenericMessage(id, messageData);
  }

	else if (count == 5) {
    let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Please select the payment term",
					"image_url": "https://thumbs.dreamstime.com/z/indian-rupees-holding-giving-to-someone-purse-34661945.jpg",
					"buttons": [{
						"type": "postback",
						"payload": "TERM",
						"title": "Monthly"
					}, {
						"type": "postback",
						"title": "Quarterly",
						"payload": "TERM"
					}, {
						"type": "postback",
						"title": "Half yearly",
						"payload": "TERM"
					}, {
						"type": "postback",
						"title": "Yearly",
						"payload": "TERM"
					}],
				}]
			}
		}
	}
    sendGenericMessage(id, messageData);
  }

	else if (count == 6) {
    let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Please select your mode of payment",
					"image_url": "https://thumbs.dreamstime.com/z/indian-rupees-holding-giving-to-someone-purse-34661945.jpg",
					"buttons": [{
						"type": "postback",
						"payload": "PAYMENT_MODE",
						"title": "Online"
					}, {
						"type": "postback",
						"title": "Offline",
						"payload": "PAYMENT_MODE"
					}],
				}]
			}
		}
	}
    sendGenericMessage(id, messageData);
  }
}
// recommended to inject access tokens as environmental variables, e.g.
var token = '';
//const token = "EAAQ45JoFChABAM5BwwqpjJuYT4xW1gX0LZC4TA6HV44hGGUQdcIGKZBfS16mIstVWx0VjL02oKa4ZBC26wn9ZCAT1Wj6HhMHCZCNZCgznSt2RYglWSgNPiHk2IbzokxqlCZBtrmGZC7S3xEuOXCjf19UW3oMlqO5BWMSZC91Fk0qGLlznEpgsMGNb";

function greetingText() {
	request({
		url: 'https://graph.facebook.com/v2.6/me/thread_settings',
		qs: {
			access_token:token,
			setting_type: 'call_to_actions',
        	thread_state: 'new_thread',
            call_to_actions: [{
                payload: 'GET_START'
            }]
		},
		method: 'POST',
		json: true
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	});
}

function sendGenericMessage(sender, messageData) {
	/*let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}*/
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendTextMessage(sender, text) {
	let messageData = { text:text }

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
