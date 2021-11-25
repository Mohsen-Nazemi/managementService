var axios = require('axios');
const partAuthenticationInterface = require('partAuthenticationInterface')
const PartSessionManager = require('partSessionManager')
const { partLoggerConfig } = require('../config');
const { callSamad } = require('./signUp');

// ----------------------------------------------
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

async function callCheckAuthenticatInterface(username, password) {
    let AuthenticationConfig = {
        global: {
            gatewayEnable: true,
            host: 'authentication.apipart.ir',
            protocol: 'http',
            port: 80,
        },
        instance: {
            auth: {
                user: 'intern_4',
                pass: 'intern_4'
            }
        }
    }

    let AI = new partAuthenticationInterface(AuthenticationConfig.global);
    let ai_gw = new AI(AuthenticationConfig.instance);

    fields = { username: username, password: password }
    status = 'active';
    system = 'intern_4';
    trackingHeaders = { 'request-id': create_UUID(), userIp: '127.0.0.1' }

    const result = await ai_gw.authenticate(fields, system, trackingHeaders);
    return result;

}
// -------------------------------------------------------------------------------------------------



async function callSamadGetRoleUser(username) {
    var data = JSON.stringify({
        "org": "intern_4",
        "filters": [
            {
                "username": username
            }
        ]
    });

    var config = {
        method: 'post',
        url: 'http://samad.partdp.ir/service/samad@8/users',
        headers: {
            'user': 'intern_4',
            'pass': 'intern_4',
            'Content-Type': 'application/json'
        },
        data: data
    };

    const result = await axios(config);

    return result.data.data[0].roles;
}
// -----------------------------------------------------------

async function createSession(username) {
    let sessionManager = new PartSessionManager({
        tokenLength: 25,
        sessionExpireTime: 120000,
        maxIdleTime: 20000,
        maxFailedLogins: 4,
        loginFailedTimeLimit: 20000,
        multiAccessTime: 5000,
        defaultVisitorObj: {
            samadUsername: 'visitor',
            roles: ['visitor']
        },
        redisConfig: {
            global: {
                partLoggerConfig: partLoggerConfig
            },
            activeDbInstance: {
                host: '127.0.0.1',
                port: 6379,
                db: 5
            },
            mapDbInstance: {
                host: '127.0.0.1',
                port: 6379,
                db: 6
            }
        },
        partLoggerConfig: partLoggerConfig
    });

    let test = new sessionManager();

    let data = {
        samadUsername: username,
        ip: '127.0.0.1'
    };

    const result = await new Promise((resolve, reject) => {
        test.start(data, function (err, res) {
            if (err) reject(err)
            else resolve(res)
        })
    });
    return result;
}




// --------------------module exports-------------------
module.exports = {
    callCheckAuthenticatInterface,
    callSamadGetRoleUser,
    createSession
};