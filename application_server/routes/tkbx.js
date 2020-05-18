require('dotenv').config();
var express = require('express');
var router = express.Router();

var sessionId;


/* STEP 1

Require TB client and initalize it

*/
let apiKey = process.env.API_KEY;
let apiSecret = process.env.API_SECRET;
var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, apiSecret, { timeout: 30000});

const createSession = onSessionCreated => {
    /* STEP 2
    Generate session and update the property sessionId. Then call 'onSessionCreated()' method.
        "...sessionId = 123453;"
        "...onSessionCreated();"
    */
    opentok.createSession(function (err, session) {
        if (err) return console.log(err);
        sessionId = session.sessionId;
        onSessionCreated(sessionId);
    });
};

router.post('/session/', function(req, res, next) {
    var onSessionCreated = () => {
        res.json({ sessionId: sessionId });
    };

    if (!sessionId) {
        createSession(onSessionCreated);
    } else {
        onSessionCreated();
    }
});

router.post('/user/', function(req, res, next) {
  /* STEP 3

  Create token and return to client
        
  */
  const token = opentok.generateToken(sessionId);
  res.json({ token });
});

module.exports = router;
