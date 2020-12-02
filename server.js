require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const Vonage = require('@vonage/server-sdk');

const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const VONAGE_BRAND_NAME = process.env.VONAGE_BRAND_NAME;

const vonage = new Vonage(
	{
		apiKey: VONAGE_API_KEY,
		apiSecret: VONAGE_API_SECRET,
	},
	{
		debug: true,
	}
);

let verifyRequestId = null;
let verifyRequestNumber = null;

app.use(express.static('public'));

app.use(
	session({
		secret: 'loadsofrandomstuff',
		resave: false,
		saveUninitialized: true,
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

// Add your routes here

app.get('/', (req, res) => {
	/*
    If there is a session for the user, the `index.html`
    page will display the number that was used to authenticate them.
    If not, it will prompt them to authenticate.
  */
	if (!req.session.user) {
		res.render('index', {
			brand: VONAGE_BRAND_NAME,
		});
	} else {
		res.render('index', {
			number: req.session.user.number,
			brand: VONAGE_BRAND_NAME,
		});
	}
});

app.get('/authenticate', (req, res) => {
	res.render('authenticate');
});

app.post('/verify', (req, res) => {
	// Start the verification process
	verifyRequestNumber = req.body.number;
	vonage.verify.request(
		{
			number: verifyRequestNumber,
			brand: VONAGE_BRAND_NAME,
		},
		(err, result) => {
			if (err) {
				console.error(err);
			} else {
				verifyRequestId = result.request_id;
				console.log(`request_id: ${verifyRequestId}`);
			}
		}
	);
	/* 
    Redirect to page where the user can 
    enter the code that they received
  */
	res.render('entercode');
});

app.post('/check-code', (req, res) => {
	// Check the code provided by the user
	vonage.verify.check(
		{
			request_id: verifyRequestId,
			code: req.body.code,
		},
		(err, result) => {
			if (err) {
				console.error(err);
			} else {
				if (result.status == 0) {
					/* User provided correct code,
             so create a session for that user
          */
					req.session.user = {
						number: verifyRequestNumber,
					};
				}
			}
			// Redirect to the home page
			res.redirect('/');
		}
	);
});

app.get('/cancel', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

const server = app.listen(3000, () => {
	console.log(`Server running on port ${server.address().port}`);
});
