var nforce = require('nforce');

var org = nforce.createConnection({
	clientId: '3MVG9xOCXq4ID1uENR_n0vamNcV9ttUyOINbn6coRAQ4rj4QrMvdOoUozVXyqlXIZXQ0Yp1kgmpGRGXX0j1cB',
	clientSecret: '5893789878304722858',
	redirectUri: 'https://oauthss.herokuapp.com/oauthcallback',
	apiVersion: 'v38.0',  // optional, defaults to current salesforce API version
	environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

