var express = require('express');
var router = express.Router();

router.get('/admin', function(req, res) {
	    res.render('pages/admin', {
	        oauthtoken: req.app.locals.oauthtoken,
	        ouathLightningURL: req.app.locals.lightningEndPointURI
    });
});

module.exports = router;