"use strict";

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
			var refreshToken = resp.refresh_token;
			var id = resp.id;
			console.log('id val - '+id);
			var idList = id.split('/');
			console.log('idList - '+idList);
			var userId = idList[idList.length-1];
			var orgId = idList[idList.length-2];
			console.log('oAuth val - '+JSON.stringify(resp));
			oauth.updateUserAndOrgIds(orgId, userId, refreshToken);
			//}
			res.redirect('/home');
		} else {
			console.log('Error: ' + err.message);
		}
	});
};

oauth.updateUserAndOrgIds = function(orgId, userId, refreshToken) {
	knex('meta_user')
		.where('org_id', '<>', orgId)
		.insert({org_id: orgId, user_id: userId, refresh_token: refreshToken}).into('meta_user')
		.catch(function(error) {
		    console.log('ERROR --> '+error);
		  });
	console.log('About to update');
	knex('meta_user')
		.update({user_id: userId, refresh_token: refreshToken})
		.where('org_id', '=', orgId)
		.then()
		.catch(function(error) {
		    console.log('ERROR --> '+error);
		  });
	console.log('Updated');
		

};

oauth.redirectAuthURI = function(res) {
	res.redirect(connection.getOrg().getAuthUri());
};

oauth.retrieveAuthDisplayInfo = function(req, res) {
	console.log('Value entered - '+ req);
};

module.exports = oauth;
