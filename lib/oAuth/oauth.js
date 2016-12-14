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
	/*
	knex('meta_user')
		.where('org_id', '<>', '1')
		.insert({org_id:'1', user_id: '1234', refresh_token: '23423'}).into('meta_user');
	*/
	var orgid = 'ZZZ';
	var userid = 'ZZZ';
	var refTok = '9999';
	console.log('About to update');
	knex('meta_user')
		.where('org_id', '=', orgid)
		.update({user_id: userid, refresh_token: refTok})
		.catch(function(error) {
		    console.log('ERROR --> '+error);
		  });
	console.log('Updated');
		

};

oauth.redirectAuthURI = function(res) {
	res.redirect(connection.getOrg().getAuthUri());
};

module.exports = oauth;
