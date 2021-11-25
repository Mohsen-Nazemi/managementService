// =================import packages=====================
const signUp = require('./signUp');
const login = require('./login');


// ==========================Routes==========================
exports.httpHandlers = {
  middlewares: [],
  signUp: {
    middlewares: [],
    POST: {
      function: signUpUser,
      middlewares: []
    }
  },
  login: {
    middlewares: [],
    PUT: {
      function: loginUser,
      middlewares: []
    }
  },
  logout: {
    middlewares: [],
    PUT: {
      function: logoutUser,
      middlewares: []
    }
  },
};

//===============================signUp user function=======================
async function signUpUser(request, response) {
  const { id, username, password, groupName,
    nationalId, jobSkill, jobTitle, firstName, lastName,
    gender, educationDegree, email, parentId } = request.data;

  const errorMessages = []
  const results = await Promise.allSettled([
    signUp.callEmployeeService(id, nationalId, username, jobSkill, jobTitle, parentId),
    signUp.callAuthenticationInterface(username, password),
    signUp.callProfileInterface(firstName, lastName, gender, educationDegree, nationalId, email),
    signUp.callSamad(username),
  ])

  results.forEach(function (element, index) {
    if (element.status === 'rejected') {
      if (index == 0 || index == 3) {
        errorMessages.push(element.reason.response.data + '⛔')

      } else {
        errorMessages.push(element.reason.data.message.fa + '⛔')
      }
    }
  });
  if (errorMessages.length) {
    response.end(JSON.stringify(errorMessages))
  } else {
    response.end('✔ ثبت نام با موفقیت انجام شد😁')
  }

}

// ======================login================================
async function loginUser(request, response) {
  const { username, password } = request.data;
  try {
    await login.callCheckAuthenticatInterface(username, password);
    const roles = await login.callSamadGetRoleUser(username, password)
    const checkRole = roles.find(role => role == 'employer');
    if(checkRole) {
      const message = await login.createSession(username);
      response.setHeader("set-cookie", message.token);
      response.end('😁لاگین با موفقیت انجام شد.✔')
    }else{
      response.end('نقش شما دسترسی مورد نظر را ندارد.⛔')
    }
  } catch (error) {
    response.end(JSON.stringify(error.data.message.fa + "⛔"))
  }

}


// ======================login================================
async function logoutUser(request, response) {
response.end('logoutttttttttttttttttttt')

}

