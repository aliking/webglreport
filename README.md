What WebGL capabilities does your system support?  See [webglreport.com](http://webglreport.com)

<a href="" target="_blank"><img src="https://f.cloud.github.com/assets/782098/1811414/b24620a4-6e53-11e3-9f72-576bb8fbb1f0.png" /></a>

This fork adds a variable: `window.jsonReport` to the page, so that it can be read by a computer.

Also a [webdriverio](http://webdriver.io) script to capture a raft of these data from BrowserStack.

install with `npm install`
run with `node test.js` - captures screenshots and puts results to console.
`node test.js > some_file.json` - stores results in _almost_ json. You'll need to add [] around the whole lot. 
