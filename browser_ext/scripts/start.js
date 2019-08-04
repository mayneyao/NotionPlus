'use strict';
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
const args = process.argv.slice(2);
const [vendor = 'chrome'] = args;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const fs = require('fs-extra');
const webpack = require('webpack');
const chalk = require('react-dev-utils/chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');

const isInteractive = process.stdout.isTTY;

// Warn and crash if vendor is not supported
if (!['chrome', 'firefox', 'opera', 'edge'].find(e => e === vendor)) {
  console.log();
  console.log(
    chalk.yellow(
      'Unsupported Browser! Vendor must be one of chrome/firefox/opera/edge.'
    )
  );
  console.log();
  process.exit(1);
}

// Warn and crash if required files are missing
if (
  !checkRequiredFiles([
    paths.appHtml,
    paths.appPopupJs,
    paths.appBackgroundJs,
    paths.appOptionsJs,
    paths.appContentScriptsJs,
  ])
) {
  process.exit(1);
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    const vendorFolder = paths.appDev + '/' + vendor;
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(vendorFolder);
  })
  .then(() => {
    const config = configFactory('development', vendor);
    const compiler = webpack(config);
    const watching = compiler.watch(
      {
        // watchOptions
        aggregateTimeout: 300,
        poll: undefined,
      },
      (err, stats) => {
        if (err) {
          return console.log(err);
        }
        if (isInteractive) {
          clearConsole();
        }
        // Print watch/build result here...
        const outputOptions = {
          context: process.cwd(),
          colors: { level: 2, hasBasic: true, has256: true, has16m: false },
          cached: false,
          cachedAssets: false,
          exclude: ['node_modules', 'bower_components', 'components'],
          infoVerbosity: 'info',
        };
        console.log(`${stats.toString(outputOptions)}\n`);

        ['SIGINT', 'SIGTERM'].forEach(function (sig) {
          process.on(sig, function () {
            watching.close();
            process.exit();
          });
        });
      }
    );
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
