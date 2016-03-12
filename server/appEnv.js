'use strict';

const cfenv = require('cfenv');
let cfenvOpts = null;
try {
  cfenvOpts = { vcap: { services: require('./VCAP_SERVICES.json') } };
} catch(e) {}; // don't do anything, just means JSON file doesnt exist

module.exports = cfenv.getAppEnv(cfenvOpts);
