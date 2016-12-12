/**
 * http://usejsdoc.org/
 */
var nforce = require('nforce');

var org = nforce.createConnection({
	clientId: '3MVG9xOCXq4ID1uENR_n0vamNcV9ttUyOINbn6coRAQ4rj4QrMvdOoUozVXyqlXIZXQ0Yp1kgmpGRGXX0j1cB',
	clientSecret: '5893789878304722858',
	redirectUri: 'https://oauthss.herokuapp.com/oauthcallback',
	apiVersion: 'v38.0',  // optional, defaults to current salesforce API version
	environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var oauth = {};

oauth.authenticate = function(req, res, app) {
	console.log('before oauth - '+req.query.code);
	var authenticated = false;
	org.authenticate({code: req.query.code}, function(err, resp){
		if(!err) {
			console.log('Access Token: ' + resp.access_token);
			app.locals.oauthtoken = resp.access_token;
			app.locals.lightningEndPointURI = "https://vishlightningss-dev-ed.lightning.force.com/";
			res.redirect('/home');
		} else {
			console.log('Error: ' + err.message);
		}
	});
};

oauth.redirectAuthURI = function(req, res, app) {
	app.get('/', function(req,res){
		console.log('res.redirect - '+org.getAuthUri());
		res.redirect(org.getAuthUri());
	});

};

module.exports = oauth;
