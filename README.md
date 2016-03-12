# Spotify Tone Insights

Analyze the lyrics in your Spotify playlists using
[IBM Watson Tone Analytics][ta].

App is currently hosted [here][app].

[Here][blog]'s my blog post about the motivation and how this app is set up.

## Running Yourself

Prerequisites:

  1. Sign up for a [Bluemix][bx] account
  1. Follow the steps for creating a Spotify Developer Account in [this guide][sa]
  1. Create a [Musixmatch Developer Account][mx] and get an App Secret
  1. In Bluemix, create an instance of the [Tone Analytics][ta] service and an
     instance of [Cloudant][cd]
     
You might also want to read [my blog post on authenticating with spotify][sblog].
That post guides you through the steps necessary to create a web app that
follows Spotify's authentication workflow. Once you're good with that you can
hop on back here to see how we use Spotify's APIs to pull in song data, get
the lyrics for those songs, and then send those off to IBM Watson Tone Analytics.

### Step 1: Install dependencies

```sh
npm i
```

phew! that was fun!

### Step 2: Set up JSON files for development

When running in Bluemix, Bluemix will set the credentials for the Tone Analytics
and Cloudant services as environment variables in your app. However, it's
annoying to set a bunch of environment variables when running locally, so the
code under the `server` directory expects there to be `ENV_VARS.json` and
`VCAP_SERVICES.json`.

`VCAP_SERVICES.json` is a literally a copy+paste of the VCAP_SERVICES object
under your app's "Environment Variables" tab in the Bluemix Dashboard.

`ENV_VARS.json` is a custom file you'll need to create that looks like:

```json
{
  "CLIENT_ID": "YOUR_SPOTIFY_CLIENT_ID",
  "CLIENT_SECRET": "YOUR_SPOTIFY_CLIENT_SECRET",
  "REDIRECT_URI": "http://localhost:3000/callback",
  "MUSIXMATCH_KEY": "YOUR_MUSIXMATCH_KEY"
}
```

### Step 3: Party

```sh
npm run build
npm start
```

This will build the "production bundle" (minified javascript, no source maps,
etc) and place it under `public/bundle.js`, and then start a server accessible
at `localhost:3000`.

```sh
npm run dev
```

This will create a "dev bundle" (unminified javascript with source maps) for
easier debugging while you're developing. It also uses some webpack magic for
hot reloading.

## Deploying to Bluemix

  1. Provision an instance of the node.js runtime
  1. Bind the Tone Analytics service and Cloudant service to that runtime
  1. Add the `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, and `MUSIXMATCH_KEY`
     environment variables (same as above).
     
Once you're set up on that end all you'll need to do is

```sh
cf login
cf push <whatever_you_named_the_runtime>
```

[app]:   http://spotifyinsights.mybluemix.net
[blog]:  http://jkaufman.io/spotify-tone-insights
[ta]:    http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tone-analyzer.html
[bx]:    https://bluemix.net
[sa]:    https://developer.spotify.com/web-api/authorization-guide/
[mx]:    https://developer.musixmatch.com/
[cd]:    https://cloudant.com/
[sblog]: http://jkaufman.io/spotify-auth-react-router/
