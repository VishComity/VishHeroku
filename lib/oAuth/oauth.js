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
			var refreshToken = resp.refresh_token;
			var id = resp.id;
			console.log('id val - '+id + id );
			var idList = id.split('/');
			console.log('idList - '+idList);
			var userId = idList[idList.length-1];
			var orgId = idList[idList.length-2];
			console.log('oAuth val - '+JSON.stringify(resp));
			oauth.updateUserAndOrgIds(orgId, userId, refreshToken);
			res.redirect('/admin');
		} else {
			console.log('Error: ' + err.message);
		}
	});
};

oauth.updateUserAndOrgIds = function(orgId, userId, refreshToken) {
	var updated = false;
	console.log('About to update');
	knex('meta_user')
		.update({user_id: userId, refresh_token: refreshToken})
		.where('org_id', '=', orgId)
		.then(function() {
			updated = true;
		})
		.catch(function(error) {
		    console.log('ERROR --> '+error);
		  });
	console.log('About to update --'+updated);
	
	if (updated===false){
		console.log('About to insert');
		knex('meta_user')
		.where('org_id', '<>', orgId)
		.insert({org_id: orgId, user_id: userId, refresh_token: refreshToken}).into('meta_user')
		.catch(function(error) {
		    console.log('ERROR --> '+error);
		  });
		console.log('Inserted');
	}

};

oauth.redirectAuthURI = function(res) {
	res.redirect(connection.getOrg().getAuthUri());
};

// Get refresh token from the database based on org id followed by calling refresh token method to get access token
oauth.retrieveRefreshToken = function(orgId, res, app, callBackFunc) {
	var refreshToken=[];
	console.log('org id - '+orgId);
	
	knex.select('refresh_token')
	    .from('meta_user')
	    .where('org_id', orgId)
	    .then(function(refTokRows) {
	    	console.log('refTokRows - '+refTokRows);
	    	callBackFunc(res, app, refTokRows[0].refresh_token);
	    })
		.catch(function(error) {
		    console.log('ERROR --> '+error);
		  });
	console.log('refreshToken - '+refreshToken);
};

oauth.retrieveAccessForRefreshToken = function(res, app, refreshToken) {
	var oauth = {
		refresh_token : refreshToken	
	};
	
	connection.getOrg().refreshToken({oauth: oauth}, function(err, resp){
		console.log('err - '+err);
		if(!err) {
			console.log('Access Token: ' + resp.access_token);
			app.locals.oauthtoken = resp.access_token;
			app.locals.refreshtoken = resp.refresh_token;
			app.locals.lightningEndPointURI = process.env.LIGHTNING_END_POINT_URI;
			console.log('Final oAuth Val - '+JSON.stringify(resp));
			res.redirect('/home');
		} else {
			console.log('Within refreshToken - '+err);
			console.log('Error: ' + err.message);
		}
	});
};

oauth.retrieveAuthDisplayInfo = function(req, res, app) {
	oauth.retrieveRefreshToken('00Do0000000KC49EAG', res, app, oauth.retrieveAccessForRefreshToken);
	//app.locals.oauthtoken = '';
	//app.locals.refreshtoken = '';
	//app.locals.lightningEndPointURI = '';
};

module.exports = oauth;

