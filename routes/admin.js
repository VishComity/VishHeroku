var express = require('express');
var router = express.Router();

router.get('/admin', function(req, res) {
	    res.render('pages/admin', {
	        oauthtoken: req.app.locals.oauthtoken,
    });
});

module.exports = router;