const fs = require('fs');
const path = require('path');
const os = require('os');
const numCPUs =  /* os.cpus().length > 4 ? os.cpus().length : 4 */ 1;
const { RateLimiterMemory } = require('rate-limiter-flexible');

let partLoggerConfig = {
  global: {
    //partMongoInterfaceConfig: partMongoInterfaceConfig,
    //partDataLayerInterfaceConfig: partDataLayerInterfaceConfig
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
        enabled: true,
        storageName: 'output'
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

let tracerConfig = {
  TraceTitle: 'partFramework',
  templates: {
    tagTemplate: { component: 'partFramework' },
    logTemplate: { component: 'partFramework' }
  }
};


let globalAuthorize = {
  systemMetaOptions: {
    host: 'systemMeta.apipart.ir',
    port: 80,
    path: '/service/systemMeta@4/which',
    method: 'POST',
    auth: {
      user: 'intern_4',
      pass: 'intern_4'
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
    host: '127.0.0.1',
    port: 6379,
    db: 0
  },
  mapDbInstance: {
    host: '127.0.0.1',
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
      user: 'intern_4',
      pass: 'intern_4'
    },
    customHeaders: {
      user: 'intern_4',
      pass: 'intern_4'
    }
  }
};
// let partAuthorizeInterfaceConfigForProxyMode = {
//   global: globalAuthorize,
//   instance: {
//     gatewayAuth: {
//       user: 'intern_4',
//       pass: 'intern_4'
//     },
//     customHeaders: {
//       user: 'intern_4',
//       pass: 'intern_4'
//     }
//   }
// };
let partSamadInterfaceConfig = {
  global: {
    systemMetaOptions: {
      host: 'systemMeta.apipart.ir',
      port: 80,
      path: '/service/systemMeta@4/which',
      method: 'POST',
      auth: {
        user: 'intern_4',
        pass: 'intern_4'
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
      user: 'intern_4',
      pass: 'intern_4'
    },
    org: 'intern_4',
    customHeaders: {
      user: 'intern_4',
      pass: 'intern_4'
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


let scriptsConnectorConfig = {
  enabled: false,
  sockets: {
    port: '5000',
    redisAdapter: {
      port: 6379,
      host: 'localhost',
      db: 0
    }
  },
  scriptPath: __dirname + '/scripts',
  python: {
    status: 'deactive',
    coordinator: 'coordinator.py',
    env:  __dirname + '/scripts/' + 'python/' + 'venv/' + 'bin/' + 'python3' /* 'python3' */ // در صورتی که اسکریپت ها دارای env هستن، محل env را مشخص کنید
  }
};


let frameworkConfig = {
  clusterSize: numCPUs,
 // loadAppsOnBoot: false,
  // loadServicesOnBoot: true,
  logDataChunks: true,
  proxyMode: {
    enabled: false,
    // two mode of config you can use. do not use them together!

    // in mode 1 you only specify  servicePath and you proxy service to handle request in proxy mode
    servicePath: 'services/proxyFolder/proxyFunction',

    //in mode two you want to use built in framework proxy...so you must specify more config in here like 'proxyToken', 'proxyTable' and so on!
    // proxyToken: {
    //   required: false,
    //   field: 'gateway-token',
    //   partAuthorizeInterfaceConfig: partAuthorizeInterfaceConfigForProxyMode,
    //   ignoreTokenFor: [/*List of systems for which token is ignored*/]
    // },
    // proxyTable: {},
    // logConfig: {
    //   upstream: true,
    //   downstream: true
    // }
  },
  rateLimit: {
    enabled: true,
    limits: [
      {
        routes: ['/service/'],
        rateLimitOption: new RateLimiterMemory({
          points: 10,
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
    port: 8090
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
      path: __dirname + path.sep + 'apps' + path.sep,
      // default: __dirname + path.sep + 'apps' + path.sep + 'proxyApp' + path.sep + 'proxyApi'
    },
    'service': {
      /*checkSecurity: {
        type: 'token'
      },*/
      path: __dirname + path.sep + 'services' + path.sep,
      // default: __dirname + path.sep + 'services' + path.sep + 'proxyService' + path.sep + 'proxyApi'
    },
    // 'default': require('./default/defaultPath')


    // if you want to serve specific static files...put them in below array...make sure you inter the absolute path!
    staticFiles: [/* __dirname + path.sep+ 'public' + path.sep + 'service-worker.js' */]
  },
  http2ServerConfig: {
    port: 8443,
    spdy: {
      key: fs.readFileSync('./certificate/key.pem'),
      cert: fs.readFileSync('./certificate/key-cert.pem')
    }
  },
  wantToUseFilterDataFunction: true,   // Note if you want to use filter data, <<<<PLEASE set it as 'FALSE'>>>>
  //
  // httpsServerConfig: {
  //   port: 4433,
  //   forceHttps: true,
  //
  //   //or
  //   /**
  //    * forceHttps: :{
  //    * 'a.domain.com',
  //    * 'b.anotherDomain.com'
  //    * }
  //    */
  //
  //   useSNI : false,
  //   /* if set useSNI : false, unCommit blow domainsCerts and address your certs */
  //   // domainsCerts: {
  //   //   'localhost': {
  //   //     key: fs.readFileSync(`./certificate/domain1/key.pem`),
  //   //     cert: fs.readFileSync(`./certificate/domain1/key-cert.pem`),
  //   //   },
  //   //   'domain2': {
  //   //     key: fs.readFileSync(`./certificate/domain2/key.pem`),
  //   //     cert: fs.readFileSync(`./certificate/domain2/key-cert.pem`),
  //   //   }
  //   // },
  //   certificate: {
  //     key: fs.readFileSync('./certificate/key.pem'), // .toString()
  //     cert: fs.readFileSync('./certificate/key-cert.pem') // .toString()
  //   }
  // },
  filterRequestLogs: function (data) {
    /**
       * do some filtering operation to data
       * Add or remove some attribute
       * exp : delete data.foo !
       * or
       * exp : data.password.replace(/./g, '*');
       * or
       * anything else...
       */
    data && data.hasOwnProperty('hey') ? data.hey = data.hey.replace(/./g, '*') : true;
    return data;
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
      // 'Content-security-policy': ''
    }
  },
  heapDump: {
    enabled: false,
    interval: 4,
    path: 'C:\\Projects\\projectSample'
  },
  partSessionManagerConfig: partSessionManagerConfig,
  partJsonValidatorConfig: partJsonValidatorConfig,
  partSecurityConfig: partSecurityConfig,
  partLoggerConfig: partLoggerConfig,
  partUrlRewriterConfig: partUrlRewriterConfig,
  partServeIndexConfig: partServeIndexConfig,
  partUploaderConfig: partUploaderConfig,
  tracerConfig: tracerConfig,
  scriptsConnectorConfig: scriptsConnectorConfig,
  trackingHeaders: ['partLoggerId', 'part-trace-id'],
};

exports.frameworkConfig = frameworkConfig;
