var connection = require('./connection');
var oauth = {};

oauth.authenticate = function(req, res, app) {
	console.log('before oauth - '+req.query.code);
	connection.getOrg().authenticate({code: req.query.code}, function(err, resp){
		if(!err) {
			console.log('Access Token: ' + resp.access_token);
			app.locals.oauthtoken = resp.access_token;
			app.locals.lightningEndPointURI = "https://vishlightningss-dev-ed.lightning.force.com/";
			connection.getOrg().setOAuth = resp.oauth;
			connection.getOrg().refreshToken({}, function(err, response){
				if(!err) {
					console.log('refreshtoken: ' + response.refresh_token);
					app.locals.refreshtoken = response.refresh_token;
				} else {
					console.log('Error: ' + err.message);
				}
			});
			res.redirect('/home');
		} else {
			console.log('Error: ' + err.message);
		}
	});
};

oauth.redirectAuthURI = function(res) {
	res.redirect(connection.getOrg().getAuthUri());
};

module.exports = oauth;
