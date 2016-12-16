var express = require('express');
var router = express.Router();

router.get('/home', function(req, res) {
    res.render('pages/home', {
        oauthtoken: req.app.locals.oauthtoken,
        ouathLightningURL: req.app.locals.lightningEndPointURI
    });
});

module.exports = router;