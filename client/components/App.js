import React, { Component } from 'react';

/**
 * Main app component
 * Has a header and then render's the page content
 */
export default class SpotifyLogin extends Component {
  render() {
    // injected via react router
    const {children} = this.props;
    return (
      <div className="spotify-tone-insights">
        <div className="header">
          <h1>Spotify Tone Insights</h1>
          <a href="http://jkaufman.io/spotify-tone-insights" target="_blank">Blog Post</a>
          <a href="https://github.com/kauffecup/spotify-tone-insights" target="_blank">Github</a>
        </div>
        <div className="page-content">
          {children}
        </div>
      </div>
    );
  }
}
