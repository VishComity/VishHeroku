var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log('Before redirect to home');
    res.render('pages/home', {
        oauthtoken: req.app.locals.oauthtoken,
        ouathLightningURL: req.app.locals.lightningEndPointURI,
        refreshtoken: req.app.locals.refreshToken
    });
});

module.exports = router;