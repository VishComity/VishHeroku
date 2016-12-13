var connection = require('./connection');//,
	//knex = require('../Services/db').knex;
var oauth = {};

oauth.authenticate = function(req, res, app) {
	console.log('before oauth - '+req.query.code);
	connection.getOrg().authenticate({code: req.query.code}, function(err, resp){
		if(!err) {
			console.log('Access Token: ' + resp.access_token);
			console.log('Refresh Token: ' + resp.refresh_token);
			app.locals.oauthtoken = resp.access_token;
			app.locals.lightningEndPointURI = process.env.LIGHTNING_END_POINT_URI;
			//user_id = req.get('user_id');
			//org_id  = req.get('org_id');
			//if (user_id && org_id) {
				//oauth.updateUserAndOrgIds(req, res);
			//}
			connection.getOrg().refreshToken({oauth:resp}, function(err, response){
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
/*
oauth.updateUserAndOrgIds = function(req, res) {
	knex('meta_user')
		.returning('org_key')
		.where({ user_key: req.user_key })
		.update({ external_id: req.user_key })
		.then(function (orgkeys) {
			var orgkey = orgkeys[0] || '';
			if (orgkey) {
				knex('meta_org')
					.where({ org_key: orgkey })
					.update({ external_id: req.org_id})
					.then(function (org) {
						//res.status(200).json({ url: app.locals.lightningEndPointURI });
					});
		    } else {
		    	//Helper.addError(req, 'Invalid Org Key');
		    	//Helper.respond(req, res, 401);
		    }
		});
};
*/
oauth.redirectAuthURI = function(res) {
	res.redirect(connection.getOrg().getAuthUri());
};

module.exports = oauth;
