const partAuthenticationInterface = require('partAuthenticationInterface')
const partProfileInterface = require('partProfileInterface');
var axios = require('axios');
let config = require('../config');

// ============================ uuid generator ===============================
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// ======================== Call Employee Service===========================
async function callEmployeeService(id, nationalId, username, jobSkill, jobTitle, parentId) {
    var data = JSON.stringify({
        "id": id,
        "data": {
            "nationalCode": nationalId,
            "username": username,
            "jobSkill": jobSkill,
            "jobTitle": jobTitle
        },
        "parent": parentId
    });

    var config = {
        method: 'post',
        url: 'http://127.0.0.1:81/dataService',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    const result = await axios(config)
    return result

}


// ===================Call Authentication Interface=======================
async function callAuthenticationInterface(username, password) {
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
    status = 'active'
    system = 'intern_4'
    trackingHeaders = { 'request-id': create_UUID(), userIp: '127.0.0.1' }
    const result = await ai_gw.addUser(fields, status, system, trackingHeaders)
    return result;

}


// ============================== Call Profile Interface==============================================

async function callProfileInterface(firstName, lastName, gender, educationDegree, nationalId, email) {
    let partProfileConfig = {

        global: {
            gatewayEnable: true,
            host: 'profile.apipart.ir', // دامنه‌ی سرویس
            protocol: 'http',
            port: 80,
        },
        instance: {
            auth: {
                user: 'intern_4',
                pass: '123456' // اختیاری است و بستگی به این دارد که سرویس مقصد پسورد بخواهد یا نه
            }
        }
    };


    let PI = new partProfileInterface(partProfileConfig.global);
    let pi = new PI(partProfileConfig.instance);

    let data = {
        type: 'real',
        idNumber: nationalId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        education: educationDegree,
        email: email
    };

    trackingHeaders = { 'request-id': create_UUID(), userIp: '127.0.0.1' }


    const result = await pi.addProfile(data, trackingHeaders)

    return result

}




// ==========================Call Samad Request========================================
async function callSamad(username) {

    async function addUser(username) {
        var data = JSON.stringify({
            "org": "intern_4",
            "users": [
                {
                    "username": username
                }
            ]
        });

        var config = {
            method: 'put',
            url: 'http://samad.partdp.ir/service/samad@8/users',
            headers: {
                'user': 'intern_4',
                'pass': 'intern_4',
                'Content-Type': 'application/json'
            },
            data: data
        };

        console.log('testtttttttttttt')
        const result = await axios(config)

        return result;

    }


    function assignUsersToRole(username) {
        var data = JSON.stringify({
            "org": "intern_4",
            "roleName": "employer",
            "users": [
                username
            ]
        });

        var config = {
            method: 'put',
            url: 'http://samad.partdp.ir/service/samad@8/users',
            headers: {
                'user': 'intern_4',
                'pass': 'intern_4',
                'Content-Type': 'application/json'
            },
            data: data
        };

        const result = axios(config)
        return result;
    }

    try {
        await addUser(username);
        await assignUsersToRole(username);
        return true

    } catch (error) {
        return error
    }


}






// --------------------module exports-------------------
module.exports = {
    callAuthenticationInterface,
    callEmployeeService,
    callProfileInterface,
    callSamad
};