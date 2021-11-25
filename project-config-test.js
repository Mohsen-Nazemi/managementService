const fs = require('fs');
const path = require('path');
const os = require('os');
const numCPUs = os.cpus().length > 4 ? os.cpus().length : 4;
const { RateLimiterMemory } = require('rate-limiter-flexible');


let partLoggerConfig = {
  global: {

  },
  instance: {
    sourceTypeWidth: 8,
    sourceNameWidth: 20,
    winstonConfig: {
      handleExceptions: true,
      json: true,
      colorize: true,
      timestamp: function () {
        return (new Date()).toLocaleTimeString();
      },
      prettyPrint: true
    },
    storageConfig: {
      dls: {
        enabled: false,
        storageName: 'Logger@6-test'
      },
      mongo: {
        enabled: false,
        storageName: 'Logger@6-test'
      },
      fileSystem: {
        enabled: false,
        path: 'message.json'
      },
      http: {
        enabled: false,
        host: '127.0.0.1',
        port: '80',
        path: '/service/logServer/saveLog',
        method: 'POST'
      }
    },
    levelConfig: {
      event: {
        view: true,
        save: true,
        color: 'green',
        viewPath: false,
        priority: 2
      },
      warning: {
        view: true,
        save: true,
        color: 'yellowBg',
        viewPath: true,
        priority: 1
      },
      error: {
        view: true,
        save: false,
        color: 'redBg',
        viewPath: true,
        priority: 0
      },
      info: {
        view: true,
        save: true,
        color: 'blueBg',
        viewPath: true,
        priority: 3
      },
      saves: {
        view: true,
        save: true,
        color: 'cyanBg',
        viewPath: true,
        priority: 4
      },
      mosifa: {
        view: true,
        save: false,
        color: 'cyanBg',
        viewPath: true,
        priority: 5
      },
      part: {
        view: true,
        save: true,
        color: 'cyanBg',
        viewPath: true,
        priority: 6
      }
    }
  }
};
let globalAuthorize = {
  systemMetaOptions: {
    host: 'systemMeta.apipart.ir',
    port: 80,
    path: '/service/systemMeta@4/which',
    method: 'POST',
    auth: {
      user: 'YOUR USER',
      pass: 'YOUR PASS'
    }
  },
  partLoggerConfig: partLoggerConfig,
  gatewayHost: {
    protocol: 'http',
    host: 'apipart.ir',
    path: '/service/gateway@3/token',
    port: 80,
    method: 'POST',
    headers: {}
  }
};
let redisSessionConfig = {
  global: {
    partLoggerConfig: partLoggerConfig
  },
  activeDbInstance: {
    host: 'redis',
    port: 6379,
    db: 0
  },
  mapDbInstance: {
    host: 'redis',
    port: 6379,
    db: 1
  }
};
let partSessionManagerConfig = {
  global: {
    tokenLength: 25,
    sessionExpireTime: 120000,
    maxIdleTime: 20000,
    maxFailedLogins: 4,
    loginFailedTimeLimit: 20000,
    multiAccessTime: 5000,
    defaultVisitorObj: {
      username: 'visitor',
      roles: ['visitor'],
      samadUsername: 'visitor'
    },
    redisConfig: redisSessionConfig,
    partLoggerConfig: partLoggerConfig
  },
  instance: {}
};
let partJsonValidatorConfig = {
  global: {
    allErrors: true,
    v5: true
  },
  instance: {}
};
let partAuthorizeInterfaceConfigForProcessMode = {
  global: globalAuthorize,
  instance: {
    gatewayAuth: {
      user: 'YOUR USER',
      pass: 'YOUR PASS'
    },
    customHeaders: {
      user: 'YOUR USER',
      pass: 'YOUR PASS'
    }
  }
};
let partAuthorizeInterfaceConfigForProxyMode = {
  global: globalAuthorize,
  instance: {
    gatewayAuth: {
      user: 'YOUR USER',
      pass: 'YOUR PASS'
    },
    customHeaders: {
      user: 'YOUR USER',
      pass: 'YOUR PASS'
    }
  }
};
let partSamadInterfaceConfig = {
  global: {
    systemMetaOptions: {
      host: 'systemMeta.apipart.ir',
      port: 80,
      path: '/service/systemMeta@3/which',
      method: 'POST',
      auth: {
        user: 'YOUR USER',
        pass: 'YOUR PASS'
      }
    },
    partLoggerConfig: partLoggerConfig,
    gatewayHost: {
      protocol: 'http',
      host: 'apipart.ir',
      path: '/service/gateway@3/token',
      port: 80,
      method: 'POST',
      headers: {}
    },
  },
  instance: {
    gatewayAuth: {
      user: 'YOUR USER',
      pass: 'YOUR PASS'
    },
    org: 'YOUR ORG',
    customHeaders: {
      user: 'YOUR USER',
      pass: 'YOUR PASS'
    }
  }
};
let partSecurityConfig = {
  global: {
    partLoggerConfig: partLoggerConfig,
  },
  instance: {
    host: '127.0.0.1',
    httpPort: 80,
    httpsPort: 443,
    maxBodyLength: 5e10,
    partSamadInterfaceConfig: partSamadInterfaceConfig
  }
};
let partUrlRewriterConfig = {
  global: {},
  instance: {
    rewriteRules: {
      './index.html': function (headers, data, session, callback) {
        /*
         اینجا باید با توجه به نیازمندی پروژه، آدرس فایل ایندکس را تعیین کنید
         کد زیر تنها یک نمونه است
         session.get(['roles'], function (error, result) {
         if (error) {
         callback(u.setCatched(config.e.dbError, error));
         }
         else {
         callback(null, './' + result.roles[0] + '/index.html');
         }
         });*/
        callback(null, './indexFolder/index.html');
      }
    }
  }
};
let partServeIndexConfig = {
  global: {},
  instance: {
    path: __dirname + path.sep + 'serveIndexHome'
  }
};
let partUploaderConfig = {
  global: {
    partLoggerConfig: partLoggerConfig
  },
  instance: {
    directory: 'uploads',
    fileSize: 200000000,
    fileLimit: 10,
  }
};
let frameworkConfig = {
  clusterSize: numCPUs,
  logDataChunks: true,
  rateLimit: {
    enabled: false,
    limits: [
      {
        routes: ['/service/'],
        rateLimitOption: new RateLimiterMemory({
          points: 6,
          duration: 1000,
        }),
        // implement your strategy here 
        // note 2 thing : 
        // 1- take care about your context...use "arrow function" to save config object context
        // 2- your inner object this keyword always reference to your parent object...so your reference path start from there
        // look this keyword path in this function...this.frameworkConfig.rateLimit.limits[0].rateLimitOption.consume
        // we access to consume function by long path from this! we could not do anything about this! sorry!
        // 3- you are free to send response in "failures"... do not this in normal activities and in then clause! 
        limitFunction: (request, response, next) => {
          this.frameworkConfig.rateLimit.limits[0].rateLimitOption.consume(request.ip)
            .then(() => {
              next();
            })
            .catch((fail) => {
              // response.sendFail({'Too many requests!'});
              next(fail);
            });
        }
      }]
  },
  proxyMode: {
    enabled: false,
    proxyToken: {
      required: false,
      field: 'gateway-token',
      partAuthorizeInterfaceConfig: partAuthorizeInterfaceConfigForProxyMode,
      ignoreTokenFor: [/*List of systems for which token is ignored*/]
    },
    proxyTable: {},
    logConfig: {
      upstream: true,
      downstream: true
    }
  },
  processMode: {
    enabled: false,
    token: {
      required: true,
      field: 'process-token',
      partAuthorizeInterfaceConfig: partAuthorizeInterfaceConfigForProcessMode,
      ignoreTokenFor: [/*List of systems for which token is ignored*/]
    }
  },
  host: '127.0.0.1',
  httpServerConfig: {
    port: 80
  },
  httpsServerConfig: {
    port: 443,
    forceHttps: {
      'a.nasser.com': true,
      'y.milad.com': false
    },
    certificate: {
      key: fs.readFileSync('./certificate/key.pem'), // .toString()
      cert: fs.readFileSync('./certificate/key-cert.pem') // .toString()
    }
  },
  routeConfig: {
    'public': {
      path: __dirname + path.sep + 'public' + path.sep,
      // or : 
      // path: [__dirname + path.sep + 'public' + path.sep, __dirname + path.sep + 'anotherPublic' + path.sep], 
      //or use [first Path, second path, ...] to have multiple path 
      // note if you have multiple folder, they should not have same name 
      headers: {
        // 'Content-security-policy': 'script-src: https://www.google-analytics.com https://ssl.google-analytics.com' +
        //   'img-src: https://www.google-analytics.com' +
        //   'connect-src: https://www.google-analytics.com'
      }
    },
    'app': {
      checkSecurity: true,
      path: __dirname + path.sep + 'apps' + path.sep
    },
    'service': {
      /*checkSecurity: {
        type: 'token'
      },*/
      path: __dirname + path.sep + 'services' + path.sep
    },

    // errorPage: 'absolute/path/to/file'

    // if you want to serve specific static files...put them in below array...make sure you inter the absolute path! 
    staticFiles: [/* __dirname + path.sep+ 'public' + path.sep + 'service-worker.js' */]
  },
  responseHeaders: {
    sendOk: {
      // place your custom sendOk header hear
    },
    sendFail: {
      // place your custom sendFail header hear
    },
    general: {
      // place your custom general (both sendFail and sendOk) header hear
    }
  },
  heapDump: {
    enabled: false,
    interval: 4,
    path: 'some/path/to/save'
  },
  partSessionManagerConfig: partSessionManagerConfig,
  partJsonValidatorConfig: partJsonValidatorConfig,
  partSecurityConfig: partSecurityConfig,
  partLoggerConfig: partLoggerConfig,
  partUrlRewriterConfig: partUrlRewriterConfig,
  partServeIndexConfig: partServeIndexConfig,
  partUploaderConfig: partUploaderConfig
};

exports.frameworkConfig = frameworkConfig;