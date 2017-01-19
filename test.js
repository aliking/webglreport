var BrowserStack = require("browserstack");
var webdriverio = require('webdriverio');
var includes = require('array-includes');
var async = require('async');


var browserStackCredentials = {
    username: process.env.BROWSERSTACK_USERNAME,
    password: process.env.BROWSERSTACK_ACCESS_KEY
};

var browserVersions = [
'chrome_55.0',
'chrome_54.0',
'chrome_53.0',
'chrome_52.0',
'firefox_45.0',
'firefox_44.0',
'firefox_43.0',
'firefox_42.0',
'edge_13.0',
'edge_12.0',
'ie_11,',
'safari_10',
'safari_9',
];


// Automate API
var automateClient = BrowserStack.createAutomateClient(browserStackCredentials);

var queue = async.queue(function(options,callback){
      testCap(options,function(val){
        logout(options,JSON.parse(val));
        callback();
      });
    },4);

automateClient.getBrowsers(function(error, browsers) {
    var queueable = browsers.filter(function(browser,i,array){
      if(browser.device !== null) {return false;}
      var broVersion = browser.browser + '_' + browser.browser_version;
      if(!includes(browserVersions,broVersion)){return false;}
      //if(browser.browser_version != '55.0' ){return false;}
      return true;
    });
    for (var i = 0; i < queueable.length; i++) {
      queue.push(queueable[i]);
    }
});



function logout(options,val){
  console.log(JSON.stringify({options:options,webgl:val})+',');
}

function desiredCapabilities(opts) {
  var cap = { desiredCapabilities: opts};
  if(opts.os !== null) {
    cap = Object.assign(cap,{
      host: 'hub.browserstack.com',
      port: 80,
      user : browserStackCredentials.username,
      key: browserStackCredentials.password,
      logLevel: 'silent'
    });
  }
  //cap.desiredCapabilities.resolution =  '1500x1000';
return cap;
}


function testCap(opts, cb) {
var options = desiredCapabilities(opts);

webdriverio
    .remote(options)
	    .init()
	    .url('https://s3.amazonaws.com/animoto/test/webglreport/index.html')
	    .execute(function(){
        return window.jsonReport;

			})
      .then(function(jsn) {
				cb(jsn.value);
			},function(err){
        cb({err:err});})
      .saveScreenshot('./scrn/' +
        Object.keys(options.desiredCapabilities).map(function(key,index){
          return options.desiredCapabilities[key];
        }).join("_") + '.png')
    .end();
}
