var connection = require('./connection'),
	knex = require('../Services/db').knex;
var oauth = {};

oauth.authenticate = function(req, res, app) {
	console.log('before oauth - '+req.query.code);
	connection.getOrg().authenticate({code: req.query.code}, function(err, resp){
		if(!err) {
			console.log('Access Token: ' + resp.access_token);
			app.locals.oauthtoken = resp.access_token;
			app.locals.refreshtoken = resp.refresh_token;
			app.locals.lightningEndPointURI = process.env.LIGHTNING_END_POINT_URI;
			//user_id = req.get('user_id');
			//org_id  = req.get('org_id');
			//if (user_id && org_id) {
				oauth.updateUserAndOrgIds(req, res);
			//}
			res.redirect('/home');
		} else {
			console.log('Error: ' + err.message);
		}
	});
};

oauth.updateUserAndOrgIds = function(req, res) {
	knex('meta_user')
		.whereNot('org_id', '1')
		.then(function() {
			  return knex.insert({org_id:'1', user_id: '1234', refresh_token: '23423'}).into('meta_user');
		});
	console.log('About to update');
	knex('meta_user')
		.where('org_id', '1')
		.update({user_id: 'ZZZZ', refresh_token: '9999'});
	console.log('Updated');
		

};

oauth.redirectAuthURI = function(res) {
	res.redirect(connection.getOrg().getAuthUri());
};

module.exports = oauth;
