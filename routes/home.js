var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/home', {
        oauthtoken: req.app.locals.oauthtoken,
        ouathLightningURL: req.app.locals.lightningEndPointURI,
        refreshtoken: req.app.locals.refreshtoken
    });
});

module.exports = router;