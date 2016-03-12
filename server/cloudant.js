'use strict';

const Promise = require('bluebird');
const crypto = require('crypto');
const appEnv = require('./appEnv');
const credentials = appEnv.getService(/cloudant/ig).credentials;

// configure the credentials object
const dbCredentials = {
  dbName: 'lyrics_db',
  host: credentials.host,
  port: credentials.port,
  password: credentials.password,
  url: credentials.url,
  user: credentials.username
};

// init the db connection
const cloudant = require('cloudant')(dbCredentials.url);
const db = Promise.promisifyAll(cloudant.use(dbCredentials.dbName));

// hash function used to get from track info to _id
function hash(track, artist, album) {
  return crypto.createHash('md5').update(`${track.toLowerCase()}${artist.toLowerCase()}${album.toLowerCase()}`).digest('hex');
}

const cloudantHelper = {
  insert: function(track, artist, album, lyrics) {
    const _id = hash(track, artist, album);
    db.insertAsync({ _id, track, artist, album, lyrics });
  },

  get: function(track, artist, album) {
    const _id = hash(track, artist, album);
    return db.getAsync(_id);
  }
};

module.exports = cloudantHelper;
