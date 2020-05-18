var express = require('express');
var router = express.Router();

/* STEP 4

Parse incoming events - configure your Session Monitoring url in TKBX dashboard... Inspect the events!
      
*/
router.post('/', function(req, res, next) {
  //console.log(JSON.stringify(req.body));
  console.log(`Received event ${req.body.event} for session ${req.body.sessionId}`)
  res.status(200).send('ok')
});

module.exports = router;
