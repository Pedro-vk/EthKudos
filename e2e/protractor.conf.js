// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const { JUnitXmlReporter } = require('jasmine-reporters');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const retry = require('protractor-retry').retry;

const htmlScreenshotReporter = new HtmlScreenshotReporter({
  dest: 'test-results/screenshots',
});

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts',
  ],
  capabilities: {
    browserName: 'chrome',
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: () => {},
  },
  beforeLaunch: () => {
    return new Promise(resolve => htmlScreenshotReporter.beforeLaunch(resolve));
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(new JUnitXmlReporter({
      savePath: path.join(__dirname, '../test-results/e2e'),
      consolidateAll: false,
      useFullTestName: true,
      modifySuiteName: () => 'e2e',
    }));
    jasmine.getEnv().addReporter(htmlScreenshotReporter);
    retry.onPrepare();
  },
  afterLaunch: async (exitCode) => {
    await new Promise(resolve => htmlScreenshotReporter.afterLaunch(resolve.bind(this, exitCode)));
    return await retry.afterLaunch(2);
  },
  onCleanUp: function (results) {
    retry.onCleanUp(results);
  },
};

process.on('uncaughtException', () => {
    htmlScreenshotReporter.jasmineDone();
    htmlScreenshotReporter.afterLaunch();
});
