// replace this values with the one generated in your TokBox Account
const apiKey = '46662702';
const appServerUrl = 'http://localhost:3000/tkbx';

let sessionId;
let token;
let connectionCount = 0;

// 1. Create session
createSession();

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

// 1.1 After create session, call getToken(sessionId)
function createSession() {
    axios({
        method: 'post',
        url: `${appServerUrl}/session`
    }).then(res => {        
        sessionId = res.data.sessionId;
        getToken(sessionId);
    })
    .catch(err => {
        handleError(err);
    })
}

// 2. After getToken, call initializeSession() and continue according to the tutorial
function getToken(sessionId) {
    axios({
        method: 'post',
        url: `${appServerUrl}/user`
    }).then(res => {
        token = res.data.token;
        initializeSession();
    })
    .catch(err => {
        handleError(err);
    })
}

// 3. Complete according to the tutorial
function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on({
        streamCreated: function(event) {
            session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            }, handleError);
        },
        connectionCreated: function (event) {
            connectionCount++;
            if (event.connection.connectionId != session.connection.connectionId) {
              console.log('Another client connected. ' + connectionCount + ' total.');
            }
        },
        connectionDestroyed: function connectionDestroyedHandler(event) {
            connectionCount--;
            console.log('A client disconnected. ' + connectionCount + ' total.');
        }
    });

    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });
}